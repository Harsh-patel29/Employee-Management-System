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

const getLogHours = async (userId) => {
  let logHours = 0;
  const currentTime = new Date();
  const todayAttendance = await Attendance.aggregate([
    {
      $match: {
        User: userId,
      },
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
  console.log(todayAttendance);

  const a = todayAttendance.map((item) => item.attendances);
  console.log('a', a);

  const lastTimeIn = a[0];
  console.log('lastTimeIn', lastTimeIn);

  const isEmpty = a.filter((item) => item.length > 0);
  console.log('isEmpty', isEmpty.length !== 0);

  const isfirst = a.filter((item) => item.length === 1);
  const firstAttendAt = isfirst?.[0]?.map((item) => item.AttendAt);
  console.log('first', isfirst);
  console.log('firstAttendAt', firstAttendAt);

  const b = a.map((item) => item.length);

  const isOdd = b.map((item) => item % 2 !== 1);
  console.log('isOdd', isOdd);

  let formattedLogHours = formatSecondsToHHMMSS(logHours);

  if (isEmpty.length !== 0) {
    if (firstAttendAt) {
      const inTime = new Date(firstAttendAt);
      logHours = calculateTimeDifferenceInSeconds(inTime, currentTime);
    } else {
      if (isOdd.includes(false)) {
        //even
        const totallogHours = a[0].map((total) => total.AttendAt);

        const sorted = totallogHours.sort((a, b) => b - a);
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
          logHours += calculateTimeDifferenceInSeconds(a, b);
        }
      }
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
    await getLogHours(userId);
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
    console.log(attendance);
    getLogHours(userId);
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
  const date = new Date(regularization.Date).toISOString().split('T')[0];
  const b = await Attendance.find({ User: regularization.User });
  const match = b.filter(
    (item) => new Date(item.AttendAt).toISOString().split('T')[0] === date
  );
  // console.log(match);

  const datePart = regularization.Date; // e.g., '2025-05-01'
  const timePart = regularization.MissingPunch; // e.g., '10:00'
  let attendDateTime;
  const localDate = new Date(`${datePart}T${timePart}:00`);
  const tzOffset = localDate.getTimezoneOffset() * 60000;
  attendDateTime = new Date(localDate.getTime() - tzOffset);
  const { currentTime, formattedLogHours, isEmpty, isOdd, lastTimeIn } =
    await getLogHours(regularization.User);

  try {
    const newAttendance = new Attendance({
      Image: ``,
      User: regularization.User,
      AttendAt: localDate,
      LogHours: formattedLogHours,
      Latitude: '',
      Longitude: '',
    });
    const savedAttendance = await newAttendance.save();
    console.log('Created attendance from regularization:', savedAttendance);
    return (
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            regularization,
            'Regularization fetched successfully'
          )
        ),
      savedAttendance
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
