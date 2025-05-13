import { SMTP } from '../Models/smtp.model.js';
import { Leave } from '../Models/leavemodel.js';
import { User } from '../Models/user.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { ApiError } from '../Utils/ApiError.js';
import bcryptjs from 'bcryptjs';

const createSMTP = AsyncHandler(async (req, res) => {
  const { Host, Port, User_Email, Password, From_Name, Email_From } = req.body;
  if (!Host || !Port || !User_Email || !Password || !From_Name || !Email_From) {
    throw new ApiError(400, 'All fields are required');
  }
  const leave = await Leave.find({ userName: req.user.Name }).sort({
    createdAt: -1,
  });

  const latestLeave = leave[0];

  const leavecreator = await User.findOne({ Name: latestLeave.userName });
  const reportingManager = leavecreator.ReportingManager;
  const reportingManagerDetail = await User.findOne({ Name: reportingManager });
  const reportingManagerEmail = reportingManagerDetail.Email;
  const AdminUser = await User.find({ role: 'Admin' });
  const AdminUserEmail = AdminUser.map((item) => item.Email);

  const hashPassword = await bcryptjs.hash(Password, 10);

  const newSMTP = await SMTP.create({
    Host: Host,
    Port: Port,
    User_Email: User_Email,
    Password: hashPassword,
    From_Name: From_Name,
    Email_From: Email_From,
    BBC_Email: req.body.BBC_Email,
    Attendance: {
      'Is Image Required': false,
    },
  });

  const createdSMTP = await newSMTP.save();

  return res
    .status(200)
    .json(new ApiResponse(200, createdSMTP, 'SMTP created Successfully'));
});

const getSMTPDetail = AsyncHandler(async (req, res) => {
  const smtp = await SMTP.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, smtp, 'SMTP Fetched Successfully'));
});

const updateSMTP = AsyncHandler(async (req, res) => {
  const smtp = await SMTP.find({});
  const data = smtp[0];

  if (!data) {
    throw new ApiError(400, 'No SMTP found');
  }
  data.Host = req.body.Host;
  data.Port = req.body.Port;
  data.User_Email = req.body.User_Email;
  data.Password = req.body.Password;
  data.From_Name = req.body.From_Name;
  data.Email_From = req.body.Email_From;
  data.BBC_Email = req.body.BBC_Email;
  data.Attendance = req.body.Attendance;

  const updatedData = await data.save();

  const newData = {
    Host: updatedData.Host,
    Port: updatedData.Port,
    User_Email: updatedData.User_Email,
    Password: updatedData.Password,
    From_Name: updatedData.From_Name,
    Email_From: updatedData.Email_From,
    BBC_Email: data.BBC_Email,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, newData, 'SMTP Updated Successfully'));
});

const AttendanceSetting = AsyncHandler(async (req, res) => {
  const isImageRequired = true;

  const newAttendanceSetting = {
    Attendance: {
      'Is Image Required': isImageRequired,
    },
  };
  await SMTP.updateOne(
    { _id: someId },
    {
      $set: {
        'Attendance.Is Image Required': false,
      },
    }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newAttendanceSetting,
        'New Attendance Setting inserted Successfully'
      )
    );
});

export { createSMTP, updateSMTP, getSMTPDetail, AttendanceSetting };
