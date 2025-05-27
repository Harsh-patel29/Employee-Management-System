import mongoose from 'mongoose';
import { Attendance } from '../Models/attendance.js';
import { uploadOnCloudinary } from '../Utils/cloudinary.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { Regularization } from '../Models/regularization.model.js';
import { WeekOff } from '../Models/weekoff.model.js';
import { Holiday } from '../Models/holiday.model.js';
import { User } from '../Models/user.model.js';
import { fromZonedTime, format } from 'date-fns-tz';

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

function addLogHours(time1, time2) {
  const [h1, m1, s1] = time1.split(':').map(Number);
  const [h2, m2, s2] = time2.split(':').map(Number);

  let seconds = s1 + s2;
  let minutes = m1 + m2 + Math.floor(seconds / 60);
  let hours = h1 + h2 + Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getDayNumberFromName(dayName) {
  const days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return days[dayName];
}

function getWeekdayWeekMap(month, year, dayIndex) {
  const result = {
    'First Week': [],
    'Second Week': [],
    'Third Week': [],
    'Fourth Week': [],
    'Fifth Week': [],
  };

  const date = new Date(year, month - 1, 1);
  let weekCount = 0;

  while (date.getMonth() === month - 1) {
    if (date.getDay() === dayIndex) {
      weekCount++;
      if (weekCount === 1) result['First Week'].push(new Date(date));
      if (weekCount === 2) result['Second Week'].push(new Date(date));
      if (weekCount === 3) result['Third Week'].push(new Date(date));
      if (weekCount === 4) result['Fourth Week'].push(new Date(date));
      if (weekCount === 5) result['Fifth Week'].push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }

  return result;
}

function calculateTotalOffHours(TypeofWeek, month, year, totalHolidayDays) {
  let totalOffHours = 0;

  TypeofWeek.forEach((entry) => {
    const [dayNameRaw, typeRaw, weekStrRaw] = entry
      .split(' - ')
      .map((x) => x.trim());
    if (!dayNameRaw || !typeRaw) return;

    const type = typeRaw;
    const dayName = dayNameRaw;
    const weekStr = weekStrRaw || '';

    const weeks = weekStr
      .split(',')
      .map((w) => w.trim())
      .filter((w) => w);

    const targetWeekday = getDayNumberFromName(dayName);
    const weekMap = getWeekdayWeekMap(month, year, targetWeekday);
    weeks.forEach((weekName) => {
      const days = weekMap[weekName] || [];

      if (type === 'WeekOff') {
        totalOffHours += days.length * 8;
      } else if (type === 'Half Day') {
        totalOffHours += days.length * 6;
      }
    });
  });

  const totalWorkingHoursInMonth = daysInMonth(month, year) * 8;

  const officialHours =
    totalWorkingHoursInMonth - totalOffHours - totalHolidayDays * 8;

  const OfficalHours = `${officialHours}:00:00`;

  return OfficalHours;
}

const getLogHours = async (userId, mode, match, date) => {
  let logHours = 0;
  let d;
  const currentTime = new Date();
  let matchQuery = {};
  let pipeline = {};
  const matchedAttendance = match;

  if (mode === 'regularized') {
    d = matchedAttendance?.map((item) => {
      const istDate = fromZonedTime(new Date(item.AttendAt), 'Asia/Kolkata');
      return format(istDate, 'yyyy-MM-dd', { timeZone: 'Asia/Kolkata' });
    });
  }

  const zonedDate = fromZonedTime(currentTime, 'Asia/Kolkata');
  const todaydate = format(zonedDate, 'yyyy-MM-dd', 'Asia/Kolkata');

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
            timezone: 'Asia/Kolkata',
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

  const todayDateOnly = currentTime.toISOString().split('T')[0];

  let sevenPmIstInUtc;
  let regularizedDate;

  sevenPmIstInUtc = new Date(`${todayDateOnly}T13:30:00.000Z`);
  let formattedLogHours = formatSecondsToHHMMSS(logHours);

  if (mode === 'regularized') {
    regularizedDate = date.toISOString().split('T')[0];
    sevenPmIstInUtc = new Date(`${regularizedDate}T13:30:00.000Z`);
  }

  if (mode === 'regularized' && todayAttendance?.length === 0) {
    logHours += calculateTimeDifferenceInSeconds(date, sevenPmIstInUtc);
  }

  const isPastSevenPmIst = currentTime > sevenPmIstInUtc;

  if (todayAttendancelength?.length > 0) {
    const totallogHours = a?.[0]?.map((total) => total.AttendAt);
    const sorted = totallogHours?.sort((a, b) => new Date(a) - new Date(b));
    const pairsToProcess = Math.floor(sorted.length / 2);

    for (let i = 0; i < pairsToProcess * 2; i += 2) {
      const timeIn = new Date(sorted[i]);
      const timeOut = new Date(sorted[i + 1]);
      logHours += calculateTimeDifferenceInSeconds(timeIn, timeOut);
    }

    if (sorted.length % 2 === 1) {
      const lastCheckIn = new Date(sorted[sorted.length - 1]);
      if (isPastSevenPmIst) {
        {
          logHours += calculateTimeDifferenceInSeconds(
            lastCheckIn,
            sevenPmIstInUtc
          );
        }
      } else {
        logHours += calculateTimeDifferenceInSeconds(lastCheckIn, currentTime);
      }
    }
  }

  formattedLogHours = formatSecondsToHHMMSS(logHours);

  return {
    formattedLogHours,
    isOdd,
    lastTimeIn,
    currentTime,
    cutoffApplied:
      (isPastSevenPmIst && todayAttendancelength?.length === 1) ||
      todayAttendancelength?.length % 2 == 1,
    cutoffTime: sevenPmIstInUtc,
  };
};

const updateAttendanceWithCutoff = async () => {
  try {
    const currentTime = new Date();
    const todayDate = currentTime.toISOString().split('T')[0];
    const sevenPmIstInUtc = new Date(`${todayDate}T13:30:00.000Z`); // 7 PM IST is 13:30 UTC

    if (currentTime <= sevenPmIstInUtc) {
      console.log('Not yet 7 PM IST, skipping attendance update');
      return;
    }
    const usersWithOddAttendance = await Attendance.aggregate([
      {
        $addFields: {
          attendDateOnly: {
            $dateToString: { format: '%Y-%m-%d', date: '$AttendAt' },
          },
        },
      },
      {
        $match: {
          attendDateOnly: todayDate,
        },
      },
      {
        $group: {
          _id: {
            user: '$User',
            date: '$attendDateOnly',
          },
          count: { $sum: 1 },
          attendances: { $push: '$$ROOT' },
        },
      },
      {
        $match: {
          count: { $mod: [2, 1] },
        },
      },
    ]);

    for (const userRecord of usersWithOddAttendance) {
      const userId = userRecord._id.user;
      const logHoursResult = await getLogHours(userId, 'upload', null, null);

      const lastAttendance = await Attendance.findOne({
        User: userId,
      })
        .sort({ AttendAt: -1 })
        .limit(1);

      if (lastAttendance) {
        await Attendance.findByIdAndUpdate(lastAttendance._id, {
          $set: {
            LogHours: logHoursResult.formattedLogHours,
          },
        });

        console.log(
          `Updated attendance for user ${userId} with log hours ${logHoursResult.formattedLogHours}`
        );
      }
    }
    console.log('Completed 7 PM cutoff attendance update');
  } catch (error) {
    console.error('Error updating attendance with cutoff:', error);
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
  const lastTime = new Date(lastTimeIn?.AttendAt).getTime();
  const current = new Date().getTime();

  if (current - lastTime < 60 * 1000) {
    throw new ApiError(
      409,
      'Attendance can only be marked after 1 min of TimeOut'
    );
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
              timezone: 'Asia/Kolkata',
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
              timezone: 'Asia/Kolkata',
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
  let UserId;
  UserId = req.user?._id;
  if (req.user.role === 'Admin') {
    UserId = req.body.UserId;
  }

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
  const matchLast = match?.findLast((e) => e);

  const localDate = `${regularization.Date}T${regularization.MissingPunch}`;

  const utcDate = fromZonedTime(localDate, 'Asia/Kolkata');
  const sevenPmIstInUtc = new Date(`${regularization.Date}T13:30:00.000Z`);

  try {
    const newAttendance = new Attendance({
      Image: ``,
      User: regularization.User,
      AttendAt: utcDate,
      Latitude: '',
      Longitude: '',
    });
    await newAttendance.save();
    const { formattedLogHours } = await getLogHours(
      regularization.User,
      'regularized',
      match,
      utcDate
    );
    newAttendance.LogHours = formattedLogHours;

    const matchLastTime = new Date(matchLast?.AttendAt).getTime();
    const lastTimeInTime = new Date(newAttendance?.AttendAt).getTime();

    if (matchLastTime > lastTimeInTime) {
      if (match.length % 2 !== 1) {
        newAttendance.LogHours = matchLast.LogHours;
        matchLast.LogHours = calculateTimeDifferenceInSeconds(
          matchLast.AttendAt,
          sevenPmIstInUtc
        );
        const formattedMatchlastLogHours = formatSecondsToHHMMSS(
          matchLast.LogHours
        );
        const totalLogHours = addLogHours(
          newAttendance.LogHours,
          formattedMatchlastLogHours
        );

        matchLast.LogHours = totalLogHours;
        await Attendance.findOneAndUpdate(
          { AttendAt: matchLast?.AttendAt },
          { LogHours: matchLast.LogHours }
        );
      } else {
        matchLast.LogHours = newAttendance.LogHours;
        await Attendance.findOneAndUpdate(
          { AttendAt: matchLast?.AttendAt },
          { LogHours: matchLast?.LogHours }
        );
      }
    }

    await getLogHours(regularization.User, 'regularized', match, utcDate);
    await newAttendance.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          regularization,
          'Regularization Approved successfully'
        )
      );
  } catch (error) {
    throw new ApiError(500, error, 'failed');
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
  const { selectedMonth, selectedYear } = req.body;

  const getWeekOffsByMonthYear = async (selectedMonth, selectedYear) => {
    const startOfNextMonth = new Date(Date.UTC(selectedYear, selectedMonth, 1));

    const requestedWeekOff = await WeekOff.find({
      Effective_Date: { $lt: startOfNextMonth },
    })
      .sort({ Effective_Date: -1 })
      .limit(1);

    return requestedWeekOff;
  };

  const getAllDatesInMonth = (year, month) => {
    const dates = [];

    const date = new Date(Date.UTC(year, month - 1, 1));

    const targetMonth = month - 1;

    while (date.getUTCMonth() === targetMonth) {
      dates.push(date.toISOString().split('T')[0]);
      date.setUTCDate(date.getUTCDate() + 1);
    }

    return dates;
  };

  const weekOff = await getWeekOffsByMonthYear(selectedMonth, selectedYear);

  const holiday = await Holiday.find({});

  const holidayDays = holiday.map((item) =>
    Math.abs(new Date(item.End_Date) - new Date(item.Start_Date))
  );

  const formattedDays = holidayDays.map((item) =>
    Math.ceil(item / (1000 * 60 * 60 * 24) + 1)
  );

  const totalHolidayDays = formattedDays.reduce((sum, val) => sum + val, 0);

  const month = new Date(weekOff[0]?.Effective_Date).getMonth() + 1;

  const year = new Date(weekOff[0]?.Effective_Date).getFullYear();

  const LogHours = await Attendance.aggregate([
    [
      {
        $lookup: {
          from: 'users',
          localField: 'User',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $unwind: '$userData',
      },
      {
        $lookup: {
          from: 'leaves',
          localField: 'userData.Name',
          foreignField: 'userName',
          as: 'result',
        },
      },
      {
        $addFields: {
          attendMonthOnly: {
            $dateToString: {
              format: '%m',
              date: '$AttendAt',
              timezone: 'Asia/Kolkata',
            },
          },
          attendDateOnly: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$AttendAt',
              timezone: 'Asia/Kolkata',
            },
          },
          attendYearOnly: {
            $dateToString: {
              format: '%Y',
              date: '$AttendAt',
              timezone: 'Asia/Kolkata',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: '$attendMonthOnly',
            date: '$attendDateOnly',
            year: '$attendYearOnly',
            UserName: '$userData.Name',
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
            year: '$_id.year',
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
          '_id.month': selectedMonth,
          '_id.year': String(selectedYear),
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

  let TypeofWeek;
  TypeofWeek = weekOff[0]?.days?.map(
    (item) => `${item.day} - ${item.type} - ${item.weeks}`
  );

  if (weekOff.length === 0) {
    TypeofWeek = [
      'Full Day - ',
      'Full Day - ',
      'Full Day - ',
      'Full Day - ',
      'Full Day - ',
      'Full Day - ',
      'Full Day - ',
    ];
  }

  let OfficalHours;

  OfficalHours = calculateTotalOffHours(
    TypeofWeek,
    month,
    year,
    totalHolidayDays
  );

  const paredSelectedMonth = parseInt(selectedMonth, 10);

  if ((!month, !year)) {
    OfficalHours = `${daysInMonth(paredSelectedMonth, selectedYear) * 8}:00:00`;
  }

  const weekOffDay = () => {
    const result = [];
    for (let i = 0; i < TypeofWeek.length; i++) {
      const days = () => {
        switch (i) {
          case 0:
            return 'Monday';
          case 1:
            return 'TuesDay';
          case 2:
            return 'WednesDay';
          case 3:
            return 'ThrusDay';
          case 4:
            return 'Friday';
          case 5:
            return 'Saturday';
          case 6:
            return 'Sunday';
          default:
            return '';
        }
      };
      result.push(`${days()} - ${TypeofWeek[i]}`);
    }
    return result;
  };

  const formattedData = LogHours?.map((userEntry) => {
    return {
      userName: userEntry._id.UserName,
      logs: userEntry.dates.map((entry) => ({
        date: entry.date,
        LogHours: entry.LogHours?.LogHours || '00:00:00',
        Leave: entry.LogHours.result,
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

  const allDates = getAllDatesInMonth(selectedYear, selectedMonth);
  let normalizedData;

  const allUsers = await User.find({});

  // Create a map to easily look up user data from updatedLogHours
  const userLogsMap = new Map();

  updatedLogHours.forEach((user) => {
    userLogsMap.set(user.userName, user);
  });

  // Process all users, whether they have logs or not
  normalizedData = allUsers.map((user) => {
    // Check if this user has log data
    const userWithLogs = userLogsMap.get(user.Name);

    if (userWithLogs) {
      const logsMap = new Map(
        userWithLogs.logs.map((log) => [log.date, log.LogHours])
      );

      const leave = userWithLogs?.logs?.map((leave) => leave.Leave);

      let leaveData = [];
      if (leave && leave[0]) {
        leaveData = leave[0].map((Leave) => {
          return {
            StartDate: Leave.Start_Date,
            EndDate: Leave.End_Date,
            Days: Leave.Days,
            StartDateType: Leave.StartDateType,
            EndDateType: Leave.EndDateType,
            Status: Leave.Status,
          };
        });
      }

      const fullLogs = allDates.map((date) => ({
        date,
        logHours: logsMap.get(date) || '00:00:00',
        leaveData,
      }));

      return {
        userName: user.Name,
        id: user._id,
        officialHours: OfficalHours,
        totalLogHours: userWithLogs.totalLogHours,
        pendingHours: userWithLogs.pendingHours,
        workingHours: userWithLogs.workingHours,
        logs: fullLogs,
        weekOffDays: weekOffDay(),
      };
    } else {
      const workingSeconds = timeToSeconds('00:00:00');
      const pendingSeconds = officialSeconds - workingSeconds;

      const fullLogs = allDates.map((date) => ({
        date,
        logHours: '00:00:00',
        leaveData: [],
      }));

      return {
        userName: user.Name,
        id: user._id,
        officialHours: OfficalHours,
        totalLogHours: '00:00:00',
        pendingHours: secondsToTime(Math.max(pendingSeconds, 0)),
        workingHours: '00:00:00',
        logs: fullLogs,
        weekOffDays: weekOffDay(),
      };
    }
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
  updateAttendanceWithCutoff,
  getDayNumberFromName,
  getWeekdayWeekMap,
  calculateTotalOffHours,
};
