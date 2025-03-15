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
  console.log(req.files);
  const body = JSON.parse(JSON.stringify(req.body));
  console.log(body);

  const userId = new mongoose.Types.ObjectId(req.user._id);
  const ImageLocalPath = req.files?.attendance?.[0]?.path;

  const { Latitude, Longitude } = body;

  if (!ImageLocalPath) {
    throw new ApiError(404, "Image is required for attendance");
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
  }).sort({ AttendAt: -1 });
  const isOdd = todayAttendance.length % 2 !== 1;
  const isEmpty = todayAttendance.length !== 0;

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
      AttendAt: isOdd || isEmpty ? currentTime : todayAttendance[0].AttendAt,
      LogHours: formattedLogHours,
      Latitude: Latitude ? Number(Latitude) : undefined,
      Longitude: Longitude ? Number(Longitude) : undefined,
    });
    console.log(attendance);

    return res
      .status(200)
      .json(
        new ApiResponse(200, attendance, "Attendance recorded successfully")
      );
  } catch (error) {
    console.error("Error creating attendance:", error);
    throw new ApiError(404, "Failed to save Attendance");
  }
});

const getAttendanceById = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const AttendanceById = await Attendance.findById();
});

const getAttendance = AsyncHandler(async (req, res) => {
  let AllAttendance = await Attendance.find({ User: req.user._id }).sort({
    AttendAt: -1,
  });

  const userAttendances = {};

  AllAttendance.forEach((attendance) => {
    if (!userAttendances[attendance.User]) {
      userAttendances[attendance.User] = [];
    }
    userAttendances[attendance.User].push(attendance);
  });

  AllAttendance = AllAttendance.map((attendance) => {
    // console.log("userAttendances", attendance);
    const userAttendanceList = userAttendances[attendance.User];
    const firstAttendance = userAttendanceList.findLast((e) => {
      return e;
    });
    // console.log("First Attendance ", firstAttendance);

    const isFirstAttendance =
      firstAttendance._id.toString() === attendance._id.toString();
    // console.log(isFirstAttendance);
    // console.log("Attendanceid", attendance._id.toString());

    const lastAttendance = userAttendanceList[0];
    // console.log("Last Attendance", lastAttendance);

    if (isFirstAttendance) {
      const currentTime = new Date();
      let logHours = lastAttendance.LogHours;
      if (userAttendanceList.length % 2 !== 1) {
        const lastAttendanceTime = new Date(lastAttendance.AttendAt);
        const TimeOut = lastAttendanceTime.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
      } else {
        const additionalSeconds = calculateTimeDifferenceInSeconds(
          lastAttendance,
          currentTime
        );
        const [hours, minutes, seconds] =
          lastAttendance.LogHours.split(":").map(Number);
        const totalSeconds =
          hours * 3600 + minutes * 60 + seconds + additionalSeconds;
        logHours = formatSecondsToHHMMSS(totalSeconds);
        const TimeOut = "19:00:00";
      }
    }

    const values = Object.values(userAttendances);

    // AllAttendance = AllAttendance.map((attendance) => {
    //   const userAttendanceList = userAttendances[attendance.User];
    //   const isFirstAttendance =
    //     userAttendanceList[0]._id.toString() === attendance._id.toString();
    //   const lastAttendance = userAttendanceList[userAttendanceList.length - 1];

    //   if (isFirstAttendance) {
    //     const currentTime = new Date();
    //     let logHours = lastAttendance.LogHours;

    //     if (userAttendanceList.length % 2 === 1) {
    //       const lastAttendTime = new Date(lastAttendance.AttendAt);
    //       const additionalSeconds = calculateTimeDifferenceInSeconds(
    //         lastAttendTime,
    //         currentTime
    //       );

    //     return {
    //       ...attendance._doc,
    //       TimeOut: lastAttendance.AttendAt,
    //       LogHours: logHours,
    //     };
    //   }

    // return attendance;

    return res
      .status(200)
      .json(new ApiResponse(200, values[0], "Attendance fetched Successfully"));
  });
});
export { uploadAttendance, getAttendance };
