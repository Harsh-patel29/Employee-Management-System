import mongoose from 'mongoose';
import { User } from '../Models/user.model.js';
import { Attendance } from '../Models/attendance.js';
import { uploadOnCloudinary } from '../Utils/cloudinary.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { Regularization } from '../Models/regularization.model.js';

const calculateTimeDifferenceInSeconds = (startTime, endTime) => {
  const diffMs = endTime - startTime;
  return Math.floor(diffMs / 1000);
};

const formatSecondsToHHMMSS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes}:${seconds}`;
};

const getLogHours = async (userId, mode, match, date) => {
  let matchQuery = {};
  let pipeline = {};
  const matchedAttendance = match;
  const d = matchedAttendance?.map(
    (item) => new Date(item.AttendAt).toISOString().split('T')[0]
  );

  if (mode === 'upload') {
    matchQuery = {
      User: userId,
    };
  } else if (mode === 'regularized') {
    matchQuery = {
      User: userId,
    };
    pipeline = {
      _id: d[0],
    };
  }
  let logHours = 0;
  const currentTime = new Date();
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
  console.log('today', todayAttendance);

  const a = todayAttendance.map((item) => item.attendances);

  const lastTimeIn = a[0];

  const isEmpty = a.filter((item) => item.length > 0);

  const isfirst = a.filter((item) => item.length === 1);
  const firstAttendAt = isfirst?.[0]?.map((item) => item.AttendAt);

  const b = a.map((item) => item.length);

  const isOdd = b.map((item) => item % 2 !== 1);

  let formattedLogHours = formatSecondsToHHMMSS(logHours);

  if (matchedAttendance?.length === 0) {
    const inTime = new Date(firstAttendAt);
    logHours = calculateTimeDifferenceInSeconds(inTime, currentTime);
    formattedLogHours = formatSecondsToHHMMSS(logHours);
  } else if (matchedAttendance?.length === 1) {
    const inTime = date;
    logHours = calculateTimeDifferenceInSeconds(match[0].AttendAt, inTime);
    formattedLogHours = formatSecondsToHHMMSS(logHours);
  }

  if (isEmpty.length !== 0) {
    if (firstAttendAt) {
      if (mode === 'upload') {
        const inTime = new Date(firstAttendAt);
        logHours = calculateTimeDifferenceInSeconds(inTime, currentTime);
      }
    } else if (isOdd.includes(false)) {
      console.log('i');
      const totallogHours = a[0].map((total) => total.AttendAt);
      const sorted = totallogHours.sort((a, b) => a - b);
      console.log('total', totallogHours);
      console.log('sorted', sorted);

      for (let i = 1; i < totallogHours.length; i++) {
        const a = new Date(sorted[i]);
        const b = new Date(sorted[i - 1]);
        const ab = new Date(sorted[i]).toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
        const bc = new Date(sorted[i - 1]).toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
        });
        console.log(bc, ab);
        logHours += calculateTimeDifferenceInSeconds(b, a);
      }
      // console.log(`Index ${index} is odd: ${b[index + 1]}`);
    }
    formattedLogHours = formatSecondsToHHMMSS(logHours);
    console.log('loghours', formattedLogHours);
  }
  // if (a[0].length > 0) {
  //   if (new Date() - new Date(a[0].AttendAt) < 1000 * 60 * 1) {
  //     throw new ApiError(
  //       404,
  //       'Attendance can be marked only after 1 minute of time out'
  //     );
  //   }
  // }
  return { formattedLogHours, isOdd, isEmpty, lastTimeIn, currentTime };
};

const uploadAttendance = AsyncHandler(async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  const ImageLocalPath = req.files?.attendance?.[0]?.path;
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const { formattedLogHours, currentTime, isEmpty, isOdd, lastTimeIn } =
    await getLogHours(userId, 'upload');
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
    const attendance = await Attendance.create({
      Image: Image?.url,
      User: userId,
      AttendAt: isOdd
        ? currentTime
        : lastTimeIn && lastTimeIn[0]?.AttendAt
          ? lastTimeIn[0].AttendAt
          : currentTime,
      LogHours: formattedLogHours,
      Latitude: Latitude ? Number(Latitude) : undefined,
      Longitude: Longitude ? Number(Longitude) : undefined,
    });
    await getLogHours(userId, 'upload');
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

  // await getLogHours(req.user._id, 'upload');

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
  const { formattedLogHours } = await getLogHours(
    regularization.User,
    'regularized',
    match,
    localDate
  );

  try {
    Attendance.create({
      Image: ``,
      User: regularization.User,
      AttendAt: localDate,
      LogHours: formattedLogHours,
      Latitude: '',
      Longitude: '',
    });
    await getLogHours(regularization.User, 'regularized', match, localDate);
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

export {
  getLogHours,
  uploadAttendance,
  getAttendance,
  AddRegularization,
  getRegularization,
  ApproveRegularization,
};
