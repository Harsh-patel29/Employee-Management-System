import mongoose from 'mongoose';
import { User } from '../Models/user.model.js';
import { Attendance } from '../Models/attendance.js';
import { uploadOnCloudinary } from '../Utils/cloudinary.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import dotenv from 'dotenv';
dotenv.config();

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

const uploadAttendance = AsyncHandler(async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));

  const userId = new mongoose.Types.ObjectId(req.user._id);
  const ImageLocalPath = req.files?.attendance?.[0]?.path;

  const userName = await User.find({ _id: userId });
  console.log(userName[0].Name);

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

  let logHours = 0;
  const currentTime = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayAttendance = await Attendance.find({
    User: userId,
    AttendAt: { $gte: todayStart, $lte: todayEnd },
  }).sort({ AttendAt: -1 });
  const isOdd = todayAttendance.length % 2 !== 1;

  const isEmpty = todayAttendance.length !== 0;

  let lastAttendanceTime = null;
  let formattedLogHours = formatSecondsToHHMMSS(logHours);
  if (todayAttendance.length > 0) {
    if (todayAttendance.length === 1) {
      const inTime = new Date(todayAttendance[0].AttendAt);
      logHours = calculateTimeDifferenceInSeconds(inTime, currentTime);
    } else {
      if (todayAttendance.length % 2 === 1) {
        const lastAttendanceTime = new Date(
          todayAttendance[todayAttendance.length - 1].AttendAt
        );
        logHours = calculateTimeDifferenceInSeconds(
          lastAttendanceTime,
          currentTime
        );
      }
      for (let i = 0; i < todayAttendance.length - 1; i += 2) {
        const inTime = new Date(todayAttendance[i].AttendAt);
        const outTime = new Date(todayAttendance[i + 1].AttendAt);
        logHours += calculateTimeDifferenceInSeconds(inTime, outTime);
      }
    }
    formattedLogHours = formatSecondsToHHMMSS(logHours);
  }

  if (todayAttendance.length > 0) {
    if (new Date() - new Date(todayAttendance[0].AttendAt) < 1000 * 60 * 1) {
      throw new ApiError(
        404,
        'Attendance can be marked only after 1 minute of time out'
      );
    }
  }

  const nowIST = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });
  const currentDateIST = new Date(nowIST);

  // Set 7:00 PM for today in IST
  const sevenPMIST = new Date(nowIST);
  sevenPMIST.setHours(19, 0, 0, 0); // 19:00:00.000

  // Comparison
  if (currentDateIST >= sevenPMIST) {
    logHours = calculateTimeDifferenceInSeconds(
      todayAttendance[0].AttendAt,
      sevenPMIST
    );
    formattedLogHours = formatSecondsToHHMMSS(logHours);
  }

  try {
    const attendance = await Attendance.create({
      Image: Image.url,
      User: userId,
      UserName: userName[0].Name,
      AttendAt: isOdd || isEmpty ? currentTime : todayAttendance[0].AttendAt,
      LogHours: formattedLogHours,
      Latitude: Latitude ? Number(Latitude) : undefined,
      Longitude: Longitude ? Number(Longitude) : undefined,
    });

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
    // AllAttendance.filter((item) => item.User !== req.user._id);
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
export { uploadAttendance, getAttendance };
