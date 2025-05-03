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
  return Math.round(diffMs / 1000);
};

function parseTimeString(timeStr) {
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

const formatSecondsToHHMMSS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${minutes}:${seconds}`;
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

  // console.log('today', todayAttendance);
  const a = todayAttendance.map((item) => item.attendances);
  const todayAttendancelength = a?.[0]?.map((item) => item.AttendAt);
  // console.log('a', a);
  // console.log('lenght', todayAttendancelength);
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

      const ab = new Date(sorted[i]).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });
      const bc = new Date(sorted[i + 1]).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });
      console.log(ab, bc);
      logHours += calculateTimeDifferenceInSeconds(a, b);
    }
  }

  // if (a[0].length > 0) {
  //   if (new Date() - new Date(a[0].AttendAt) < 1000 * 60 * 1) {
  //     throw new ApiError(
  //       404,
  //       'Attendance can be marked only after 1 minute of time out'
  //     );
  //   }
  // }
  formattedLogHours = formatSecondsToHHMMSS(logHours);
  console.log('logHours', formattedLogHours);

  return { formattedLogHours, isOdd, lastTimeIn, currentTime };
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

export {
  getLogHours,
  uploadAttendance,
  getAttendance,
  AddRegularization,
  getRegularization,
  ApproveRegularization,
  RejectRegularization,
};
