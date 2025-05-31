import { WeekOff } from '../Models/weekoff.model.js';
import { Salary } from '../Models/salary.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { ApiError } from '../Utils/ApiError.js';

const Days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const defaultWeeks = [
  'First Week',
  'Second Week',
  'Third Week',
  'Fourth Week',
  'Fifth Week',
];
const createWeekOff = AsyncHandler(async (req, res) => {
  const { WeekOffName, Effective_Date, days } = req.body;

  if (!WeekOffName || !Effective_Date) {
    throw new ApiError(400, 'WeekOffName and Effective Date is required');
  }

  const normalizedByMap = {};

  if (Array.isArray(days)) {
    days.forEach((dayObject) => {
      if (dayObject.day && Days.includes(dayObject.day)) {
        let { day, type, weeks } = dayObject;

        const hasSelectedWeeks = Array.isArray(weeks) && weeks.length > 0;

        if (hasSelectedWeeks) {
          type = 'WeekOff';
        } else if (!hasSelectedWeeks && type === '') {
          type = 'Full Day';
        }
        if (type === 'WeekOff') {
          weeks =
            Array.isArray(weeks) && weeks.length > 0 ? weeks : defaultWeeks;
        } else if (type === 'Half Day') {
          weeks =
            Array.isArray(weeks) && weeks.length > 0 ? weeks : defaultWeeks;
        } else {
          weeks = undefined;
        }
        if (type === '') {
          day = Array.isArray(day) && day.length > 0 ? day : Days;
        }
        normalizedByMap[day] = { day, type, weeks };
      }
    });
  }

  const finalDays = Days.map((day) => {
    return (
      normalizedByMap[day] || {
        day,
        type: 'Full Day',
      }
    );
  });

  try {
    const weekoff = await WeekOff.create({
      WeekOffName,
      Effective_Date,
      days: finalDays,
    });
    await weekoff.save();
    return res
      .status(200)
      .json(new ApiResponse(200, weekoff, 'WeekOff Created Successfully'));
  } catch (error) {
    throw new ApiResponse(500, error, 'WeekOff creation failed');
  }
});

const getAllWeekoff = AsyncHandler(async (req, res) => {
  const weekOff = await WeekOff.find({}).sort({ createdAt: -1 });
  const formattedWeekOff = weekOff.map((item) => ({
    ...item.toObject(),
    Effective_Date: item.Effective_Date.toISOString().split('T')[0],
  }));
  return res
    .status(201)
    .json(
      new ApiResponse(201, formattedWeekOff, 'WeekOff fetched successfully')
    );
});

const getWeekOffById = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const weekoff = await WeekOff.findById(id);

  if (!weekoff) {
    throw new ApiError(400, 'WeekOff not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, weekoff, 'WeekOff found Successfully'));
});

const updateWeekOff = AsyncHandler(async (req, res) => {
  const id = req.body.id;
  const weekOff = await WeekOff.findById(id);

  if (!weekOff) {
    throw new ApiError(404, 'WeekOff not found');
  }
  weekOff.WeekOffName = req.body.data.WeekOffName;
  weekOff.Effective_Date = req.body.data.Effective_Date;
  weekOff.days = req.body.data.days;
  const updatedWeekOff = await weekOff.save();

  const days = updatedWeekOff.days;

  const normalizedByMap = {};

  if (Array.isArray(days)) {
    days.forEach((dayObject) => {
      if (dayObject.day && Days.includes(dayObject.day)) {
        let { day, type, weeks, _id } = dayObject;

        const hasSelectedWeeks = Array.isArray(weeks) && weeks.length > 0;
        if (hasSelectedWeeks) {
          type = type;
        } else if (!hasSelectedWeeks && type === '') {
          type = 'Full Day';
        }
        if (type === 'WeekOff') {
          weeks =
            Array.isArray(weeks) && weeks.length > 0 ? weeks : defaultWeeks;
        } else if (type === 'Half Day') {
          weeks =
            Array.isArray(weeks) && weeks.length > 0 ? weeks : defaultWeeks;
        } else {
          weeks = undefined;
        }
        if (type === '') {
          day = Array.isArray(day) && day.length > 0 ? day : Days;
        }
        normalizedByMap[day] = { day, type, weeks };
      }
    });
  }

  const finalDays = Days.map((day) => {
    return (
      normalizedByMap[day] || {
        day,
        type: 'Full Day',
      }
    );
  });
  await weekOff.save();
  const newWeekOff = {
    WeekOffName: updatedWeekOff.WeekOffName,
    Effective_Date: updatedWeekOff.Effective_Date,
    days: finalDays,
  };
  const newUpdatedWeekOff = await WeekOff.findByIdAndUpdate(id, newWeekOff, {
    new: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, newUpdatedWeekOff, 'WeekOff updated Successfully')
    );
});

const deleteWeekOff = AsyncHandler(async (req, res) => {
  const id = req.body.data;

  const weekOff = await WeekOff.findById(id);

  if (!weekOff) {
    throw new ApiError(404, 'WeekOff not found');
  }

  const salaryCount = await Salary.countDocuments({ WeekOff: weekOff?._id });

  if (salaryCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete this WeekOff policy. It is currently used by ${salaryCount} salary record(s). 
         Please update those records first.`
    );
  }

  const deletedWeekOff = await WeekOff.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedWeekOff, 'WeekOff deleted Successfully'));
});

export {
  createWeekOff,
  getAllWeekoff,
  deleteWeekOff,
  updateWeekOff,
  getWeekOffById,
};
