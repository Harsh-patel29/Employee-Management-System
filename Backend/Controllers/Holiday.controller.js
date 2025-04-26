import { Holiday } from '../Models/holiday.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';

const createHoliday = AsyncHandler(async (req, res) => {
  const { holiday_name, Start_Date, End_Date } = req.body;
  const Holidayexists = await Holiday.findOne({ holiday_name });
  if (Holidayexists) {
    throw new ApiError(400, 'Holiday already exists');
  }
  if (!holiday_name || !Start_Date) {
    throw new ApiError(400, 'Holiday Name and Start Date are required');
  }

  try {
    const hoilday = await Holiday.create({
      holiday_name,
      Start_Date,
      End_Date,
    });
    await hoilday.save();
    return res
      .status(200)
      .json(new ApiResponse(200, hoilday, 'Holiday Created Successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'Holiday Creation Failed');
  }
});

const updateHoliday = AsyncHandler(async (req, res) => {
  const id = req.body.id;

  const holiday = await Holiday.findById(id);
  if (!holiday) {
    throw new ApiError(404, 'Holiday not found');
  }
  const Holidayexists = await Holiday.find({
    holiday_name: req.body.data.holiday_name,
  });
  if (Holidayexists) {
    throw new ApiError(400, 'Holiday already exists');
  }
  holiday.holiday_name = req.body.data.holiday_name;
  holiday.Start_Date = req.body.data.Start_Date;
  holiday.End_Date = req.body.data.End_Date;

  const updatedHoliday = await holiday.save();

  const newHoliday = {
    holiday_name: updatedHoliday.holiday_name,
    Start_Date: updatedHoliday.Start_Date,
    End_Date: updatedHoliday.End_Date,
  };
  await holiday.save();
  return res
    .status(200)
    .json(new ApiResponse(200, newHoliday, 'Holiday Updated Successfully'));
});

const deleteHoliday = AsyncHandler(async (req, res) => {
  const id = req.body.data;
  const holiday = await Holiday.findByIdAndDelete(id);
  if (!holiday) {
    throw new ApiError(404, 'Holiday not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, holiday, 'Holiday Deleted Successfully'));
});

const getHoliday = AsyncHandler(async (req, res) => {
  const holiday = await Holiday.find({});
  if (!holiday) {
    throw new ApiError(404, 'Holiday not found');
  }
  const finalData = holiday.map((item) => {
    return {
      _id: item._id,
      holiday_name: item.holiday_name,
      Start_Date: new Date(item.Start_Date)
        .toLocaleDateString('en-GB')
        .split('/')
        .join('-'),
      End_Date:
        item.End_Date !== null
          ? new Date(item.End_Date)
              .toLocaleDateString('en-GB')
              .split('/')
              .join('-')
          : '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });
  return res
    .status(200)
    .json(new ApiResponse(200, finalData, 'Holiday Fetched Successfully'));
});

const getHolidayById = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const holiday = await Holiday.findById(id);
  if (!holiday) {
    throw new ApiError(404, 'Holiday not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, holiday, 'Holiday Fetched Successfully'));
});

export {
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getHoliday,
  getHolidayById,
};
