import mongoose from 'mongoose';
import { User } from '../Models/user.model.js';
import { Attendance } from '../Models/attendance.js';
import { uploadOnCloudinary } from '../Utils/cloudinary.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { Regularization } from '../Models/regularization.model.js';
import { WeekOff } from '../Models/weekoff.model.js';
import { Holiday } from '../Models/holiday.model.js';
const calculateTimeDifferenceInSeconds = (startTime, endTime) => {
  const diffMs = endTime - startTime;
  return Math.round(diffMs / 1000);
};

const formatSecondsToHHMMSS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes}:${seconds}`;
};

const timeToSeconds = (timeStr) => {
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

const secondsToTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getLogHours = async (userId, mode, match, date) => {
  let logHours = 0;
  let d;
  const currentTime = new Date();
  let matchQuery = {};
  let pipeline = {};
  const matchedAttendance = match;
  if (mode === 'regularized') {
    d = matchedAttendance?.map(
      (item) => new Date(item.AttendAt).toISOString().split('T')[0]
    );
  }
  const todaydate = currentTime.toISOString().split('T')[0];

  if (mode === 'upload') {
    matchQuery = {
      User: userId,
    };
    pipeline = {
      _id: todaydate,
    };
  } else if (mode === 'regularized') {
    matchQuery = {
      User: userId,
    };
    pipeline = {
      _id: d[0],
    };
  }

  const todayAttendance = await Attendance.aggregate([
    {
      $match: matchQuery,
    },
    {
      $addFields: {
        attendDateOnly: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$AttendAt',
          },
        },
      },
    },
    {
      $group: {
        _id: '$attendDateOnly',
        attendances: {
          $push: '$$ROOT',
        },
      },
    },
    {
      $match: pipeline,
    },
    {
      $project: {
        'attendances.AttendAt': 1,
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ]);

  const a = todayAttendance?.map((item) => item.attendances);
  const todayAttendancelength = a?.[0]?.map((item) => item.AttendAt);

  const lastTimeIn = a?.[0]?.findLast((e) => e);

  const b = a.map((item) => item.length);

  const isOdd = b.map((item) => item % 2 === 1);

  let formattedLogHours = formatSecondsToHHMMSS(logHours);

  if (mode === 'regularized') {
    if (todayAttendancelength?.length === 0) {
      const inTime = date;
      logHours = calculateTimeDifferenceInSeconds(inTime, currentTime);
    } else if (
      todayAttendancelength?.length === 1 ||
      todayAttendancelength?.length % 2 == 1
    ) {
      const inTime = date;
      logHours = calculateTimeDifferenceInSeconds(match[0].AttendAt, inTime);
    }
  } else {
    if (
      todayAttendancelength?.length === 1 ||
      todayAttendancelength?.length % 2 === 1
    ) {
      logHours = calculateTimeDifferenceInSeconds(
        lastTimeIn.AttendAt,
        currentTime
      );
    }
  }

  if (
    todayAttendancelength?.length !== 0 &&
    todayAttendancelength?.length % 2 !== 1
  ) {
    const totallogHours = a?.[0]?.map((total) => total.AttendAt);
    const sorted = totallogHours?.sort((a, b) => a - b);

    for (let i = 0; i < sorted?.length - 1; i += 2) {
      const a = new Date(sorted[i]);
      const b = new Date(sorted[i + 1]);
      logHours += calculateTimeDifferenceInSeconds(a, b);
    }
    // {
    //   for (let i = sorted.length - 1; i >= 0; i--) {
    //     const a = new Date(sorted[i]);
    //     const b = new Date(sorted[i + 1]);
    //     if (b - a < 1000 * 60 * 1 === true) {
    //       throw new ApiError(
    //         400,
    //         'Attendance can only be marked after 1 minute of timeout'
    //       );
    //     }
    //   }
    //   return -1; // return -1 if no true found
    // }
  }

  formattedLogHours = formatSecondsToHHMMSS(logHours);

  return { formattedLogHours, isOdd, lastTimeIn, currentTime };
};

const daysInMonth = (month, year) => {
  switch (month) {
    case 1: // January
    case 3: // March
    case 5: // May
    case 7: // July
    case 8: // August
    case 10: // October
    case 12: // December
      return 31;
    case 4: // April
    case 6: // June
    case 9: // September
    case 11: // November
      return 30;
    case 2: // February
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    default:
      return -1; // Invalid month
  }
};
const uploadAttendance = AsyncHandler(async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const ImageLocalPath = req.files?.attendance?.[0]?.path;
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const { currentTime, isOdd, lastTimeIn } = await getLogHours(
    userId,
    'upload'
  );

  const { Latitude, Longitude } = body;
  if (!ImageLocalPath) {
    throw new ApiError(404, 'Image is required for attendance');
  }

  let Image;
  try {
    Image = await uploadOnCloudinary(ImageLocalPath);
    console.log('Uploaded Attendance!!');
  } catch (error) {
    console.log('Error in uploading Attendance', error);
    throw new ApiError(500, 'Failed to upload Attendance');
  }

  try {
    const attendance = new Attendance({
      Image: Image?.url,
      User: userId,
      AttendAt: isOdd
        ? currentTime
        : lastTimeIn
          ? lastTimeIn.AttendAt
          : currentTime,
      Latitude: Latitude ? Number(Latitude) : undefined,
      Longitude: Longitude ? Number(Longitude) : undefined,
    });
    await attendance.save();

    const { formattedLogHours } = await getLogHours(
      userId,
      'upload',
      [],
      attendance.AttendAt
    );
    attendance.LogHours = formattedLogHours;
    await attendance.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, attendance, 'Attendance recorded successfully')
      );
  } catch (error) {
    console.error('Error creating attendance:', error);
    throw new ApiError(404, 'Failed to save Attendance');
  }
});

const getAttendance = AsyncHandler(async (req, res) => {
  const rolesPermission = req.permission;
  const ViewAccess = rolesPermission?.attendance.canViewOthersAttendance;
  let AllAttendance;
  if (ViewAccess === true) {
    AllAttendance = await Attendance.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'User',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $addFields: {
          userName: '$userInfo.Name',
          attendDateOnly: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$AttendAt',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            user: '$User',
            date: '$attendDateOnly',
          },
          attendances: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          _id: 0,
          user: '$_id.user',
          date: '$_id.date',
          attendances: 1,
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);
  } else {
    AllAttendance = await Attendance.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'User',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $addFields: {
          userName: '$userInfo.Name',
          attendDateOnly: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$AttendAt',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            user: '$User',
            date: '$attendDateOnly',
          },
          attendances: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          _id: 0,
          user: '$_id.user',
          date: '$_id.date',
          attendances: 1,
        },
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]);
  }
  const userAttendances = {};
  AllAttendance.forEach((attendance) => {
    if (!userAttendances[attendance.User]) {
      userAttendances[attendance.User] = [];
    }
    userAttendances[attendance.User].push(attendance);
  });

  const values = Object.values(userAttendances);

  return res
    .status(200)
    .json(new ApiResponse(200, values[0], 'Attendance fetched Successfully'));
});

const AddRegularization = AsyncHandler(async (req, res) => {
  const { Date, MissingPunch, Reason, Remarks } = req.body;

  if (!Date || !MissingPunch || !Reason || !Remarks) {
    throw new ApiError(400, 'All fields are required');
  }
  const UserId = req.user._id;
  try {
    const regularization = await Regularization.create({
      User: UserId,
      Date: Date,
      MissingPunch: MissingPunch,
      Reason: Reason,
      Remarks: Remarks,
    });
    await regularization.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          regularization,
          'Regularization created Successfully'
        )
      );
  } catch (error) {
    throw new ApiError(500, error, 'Regularization creation failed');
  }
});

const getRegularization = AsyncHandler(async (req, res) => {
  const regularization = await Regularization.find({})
    .populate('User', 'Name')
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        regularization,
        'Regularization fethced successfully'
      )
    );
});

const ApproveRegularization = AsyncHandler(async (req, res) => {
  const { id } = req.body;

  const regularization = await Regularization.findById(id);
  if (!regularization) {
    throw new ApiError(400, 'Regularization not found');
  }
  await regularization.updateOne({ Status: 'Approved' });
  const b = await Attendance.find({ User: regularization.User });
  const match = b
    .filter(
      (item) =>
        new Date(item.AttendAt).toLocaleDateString() ===
        new Date(regularization.Date).toLocaleDateString()
    )
    .sort((a, b) => a.AttendAt - b.AttendAt);

  const localDate = new Date(
    `${regularization.Date}T${regularization.MissingPunch}:00`
  );

  try {
    const newAttendance = new Attendance({
      Image: ``,
      User: regularization.User,
      AttendAt: localDate,

      Latitude: '',
      Longitude: '',
    });
    await newAttendance.save();
    const { formattedLogHours } = await getLogHours(
      regularization.User,
      'regularized',
      match,
      localDate
    );
    newAttendance.LogHours = formattedLogHours;
    await getLogHours(regularization.User, 'regularized', match, localDate);
    await newAttendance.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          regularization,
          'Regularization fetched successfully'
        )
      );
  } catch (error) {
    throw new ApiError(500, 'failed');
  }
});

const RejectRegularization = AsyncHandler(async (req, res) => {
  const { id } = req.body;

  const regularization = await Regularization.findById(id);
  if (!regularization) {
    throw new ApiError(400, 'Regularization not found');
  }
  await regularization.updateOne({ Status: 'Rejected' });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        regularization,
        'Regularization rejected Successfully'
      )
    );
});

const getRegularizationbyDateandUser = AsyncHandler(async (req, res) => {
  const { user, Date } = req.body;

  const regularization = await Regularization.find({ Date: Date, User: user });
  if (!regularization) {
    throw new ApiError(400, 'regularization not found');
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        regularization,
        'Regularization fetched successfully'
      )
    );
});

const fetchMonthlyReport = AsyncHandler(async (req, res) => {
  const weekOff = await WeekOff.find({});
  const holiday = await Holiday.find({});

  const holidayDays = holiday.map((item) =>
    Math.abs(new Date(item.End_Date) - new Date(item.Start_Date))
  );

  const formattedDays = holidayDays.map((item) =>
    Math.ceil(item / (1000 * 60 * 60 * 24) + 1)
  );

  const totalHolidayDays = formattedDays.reduce((sum, val) => sum + val, 0);

  const month = new Date(weekOff[0].Effective_Date).getMonth() + 1;
  const formattedMonth = month.toString().padStart(2, '0');

  const year = new Date(weekOff[0].Effective_Date).getFullYear();
  const LogHours = await Attendance.aggregate([
    [
      {
        $addFields: {
          attendMonthOnly: {
            $dateToString: {
              format: '%m',
              date: '$AttendAt',
            },
          },
          attendDateOnly: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$AttendAt',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: '$attendMonthOnly',
            date: '$attendDateOnly',
            UserName: '$UserName',
          },
          logHours: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $sort: {
          '_id.UserName': 1,
          '_id.date': 1,
        },
      },
      {
        $group: {
          _id: {
            month: '$_id.month',
            UserName: '$_id.UserName',
          },
          dates: {
            $push: {
              date: '$_id.date',
              logHours: '$logHours',
            },
          },
        },
      },
      {
        $match: {
          '_id.month': formattedMonth,
        },
      },
      {
        $project: {
          _id: 1,
          dates: {
            $map: {
              input: '$dates',
              as: 'd',
              in: {
                date: '$$d.date',
                LogHours: {
                  $arrayElemAt: [
                    '$$d.logHours',
                    {
                      $subtract: [
                        {
                          $size: '$$d.logHours',
                        },
                        1,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    ],
  ]);

  const TypeofWeek = weekOff[0]?.days?.map((item) => item.type);
  const weekoff = TypeofWeek.filter((item) => item === 'WeekOff');
  const OfficalHours = `${(daysInMonth(month, year) - totalHolidayDays - weekoff.length) * 8}:00:00`;

  const formattedData = LogHours.map((userEntry) => {
    return {
      userName: userEntry._id.UserName,
      logs: userEntry.dates.map((entry) => ({
        date: entry.date,
        LogHours: entry.LogHours?.LogHours || '00:00:00',
      })),
    };
  });

  const logHours = formattedData.map((user) => {
    const totalSeconds = user.logs.reduce((acc, curr) => {
      return acc + timeToSeconds(curr.LogHours);
    }, 0);

    return {
      ...user,
      totalLogHours: secondsToTime(totalSeconds),
    };
  });

  const officialSeconds = timeToSeconds(OfficalHours);
  const updatedLogHours = logHours.map((item) => {
    const workingSeconds = timeToSeconds(item.totalLogHours);
    const pendingSeconds = officialSeconds - workingSeconds;

    return {
      ...item,
      officialHours: OfficalHours,
      workingHours: item.totalLogHours,
      pendingHours: secondsToTime(Math.max(pendingSeconds, 0)),
    };
  });

  const getAllDatesInMonth = (year, month) => {
    const dates = [];

    const date = new Date(Date.UTC(year, month - 1, 1));

    const targetMonth = month - 1;

    while (date.getUTCMonth() === targetMonth) {
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      date.setUTCDate(date.getUTCDate() + 1);
    }

    return dates;
  };

  const allDates = getAllDatesInMonth(2025, 4);

  const normalizedData = updatedLogHours.map((user) => {
    const logsMap = new Map(user.logs.map((log) => [log.date, log.LogHours]));

    const fullLogs = allDates.map((date) => ({
      date,
      logHours: logsMap.get(date) || '00:00:00',
    }));

    return {
      userName: user.userName,
      officialHours: OfficalHours,
      totalLogHours: user.totalLogHours,
      pendingHours: user.pendingHours,
      workingHours: user.workingHours,
      logs: fullLogs,
    };
  });

  return res.status(200).json(new ApiResponse(200, normalizedData, 'Fetched'));
});

export {
  getLogHours,
  uploadAttendance,
  getAttendance,
  AddRegularization,
  getRegularization,
  ApproveRegularization,
  RejectRegularization,
  getRegularizationbyDateandUser,
  fetchMonthlyReport,
};
