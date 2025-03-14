import mongoose from "mongoose";
import { User } from "../Models/user.model.js";
import { Attendance } from "../Models/attendance.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import dotenv from "dotenv";
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
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const ImageLocalPath = req.files?.attendance?.[0]?.path;
  if (!ImageLocalPath) {
    throw new ApiError(404, "Image is required for attendance ");
  }

  let Image;
  try {
    Image = await uploadOnCloudinary(ImageLocalPath);
    console.log("Uploaded Attendance!!");
  } catch (error) {
    console.log("Error in uploading Attendance", error);
    throw new ApiError(500, "Failed to upload Attendance");
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
  }).sort({ AttendAt: 1 });
  console.log("today Attendance", todayAttendance);

  let lastAttendanceTime = null;

  if (todayAttendance.length > 0) {
    if (todayAttendance.length % 2 === 1) {
      lastAttendanceTime = new Date(
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

  const formattedLogHours = formatSecondsToHHMMSS(logHours);
  try {
    const attendance = await Attendance.create({
      Image: Image.url,
      User: userId,
      AttendAt: currentTime,
      LogHours: formattedLogHours,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { attendance, formattedLogHours },
          "Attendance recorded successfully"
        )
      );
  } catch (error) {
    throw new ApiError(404, error, "Failed to save Attendance");
  }
});

const getAttendanceById = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const AttendanceById = await Attendance.findById();
});

const getAttendance = AsyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  let AllAttendance = await Attendance.find({
    AttendAt: { $gte: todayStart, $lte: todayEnd },
  }).sort({ AttendAt: 1 });

  const userAttendances = {};
  AllAttendance.forEach((attendance) => {
    if (!userAttendances[attendance.User]) {
      userAttendances[attendance.User] = [];
    }
    userAttendances[attendance.User].push(attendance);
  });

  AllAttendance = AllAttendance.map((attendance) => {
    const userAttendanceList = userAttendances[attendance.User];
    const isFirstAttendance =
      userAttendanceList[0]._id.toString() === attendance._id.toString();
    const lastAttendance = userAttendanceList[userAttendanceList.length - 1];

    if (isFirstAttendance) {
      const currentTime = new Date();
      let logHours = lastAttendance.LogHours;

      if (userAttendanceList.length % 2 === 1) {
        const lastAttendTime = new Date(lastAttendance.AttendAt);
        const additionalSeconds = calculateTimeDifferenceInSeconds(
          lastAttendTime,
          currentTime
        );
        const [hours, minutes, seconds] =
          lastAttendance.LogHours.split(":").map(Number);
        const totalSeconds =
          hours * 3600 + minutes * 60 + seconds + additionalSeconds;
        logHours = formatSecondsToHHMMSS(totalSeconds);
      }

      return {
        ...attendance._doc,
        TimeOut: lastAttendance.AttendAt,
        LogHours: logHours,
      };
    }

    return attendance;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, AllAttendance, "Attendance fetched Successfully")
    );
});

export { uploadAttendance, getAttendance };
