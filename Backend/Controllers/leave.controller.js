import mongoose from 'mongoose';
import { Leave } from '../Models/leavemodel.js';
import { User } from '../Models/user.model.js';
import { CreateLeave } from '../Models/createleavemodel.js';
import { AsyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import nodemailer from 'nodemailer';
import { SMTP } from '../Models/smtp.model.js';

const sendMail = async (leaveData, Name) => {
  const SMTPData = await SMTP.find({});
  const data = SMTPData[0];

  const leave = await Leave.find({ userName: Name }).sort({
    createdAt: -1,
  });
  const latestLeave = leave[0];
  const leavecreator = await User.findOne({ Name: latestLeave.userName });
  const reportingManager = leavecreator.ReportingManager;
  const reportingManagerDetail = await User.findOne({ Name: reportingManager });
  const reportingManagerEmail = reportingManagerDetail.Email;
  const AdminUser = await User.find({ role: 'Admin' });
  const AdminUserEmail = AdminUser.map((item) => item.Email);
  const totalEmails = AdminUserEmail.concat(reportingManagerEmail);

  const BBC_Email = [...new Set(totalEmails)];

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: data.User_Email,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${data.From_Name} <${data.User_Email}>`,
      to: data.BBC_Email,
      bcc: BBC_Email,
      subject: `Leave Application -${leaveData.userName} (${leaveData.EMPCODE})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .header {
              background-color: #0056b3;
              color: white;
              padding: 15px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
            }
            .leave-details {
              margin-top: 20px;
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 5px;
            }
            .detail-item {
              margin-bottom: 12px;
              display: flex;
              flex-direction: column;
            }
            .detail-label {
              font-weight: bold;
              margin-bottom: 3px;
              color: #555;
            }
            .detail-value {
              padding-left: 5px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 14px;
              color: #777;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 3px;
              background-color: #ffc107;
              color: #000;
              font-weight: bold;
            }
            .divider {
              height: 1px;
              background-color: #eee;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Leave Application</h2>
            </div>
            <div class="content">
              <p>Dear HR Team,</p>
              <p>Please find below the details of a leave application submitted by <strong>${leaveData.userName}</strong>:</p>
              
              <div class="leave-details">
                <div class="detail-item">
                  <div class="detail-label">Employee Name</div>
                  <div class="detail-value">${leaveData.userName}</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="detail-item">
                  <div class="detail-label">Employee Code</div>
                  <div class="detail-value">${leaveData.EMPCODE}</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="detail-item">
                  <div class="detail-label">Leave Type</div>
                  <div class="detail-value">${leaveData.LEAVE_TYPE}</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="detail-item">
                  <div class="detail-label">Duration</div>
                  <div class="detail-value">${leaveData.Days} day(s)</div>
                </div>
                
                <div class="divider"></div>
                
                <div class="detail-item">
                  <div class="detail-label">From</div>
                  <div class="detail-value">${leaveData.Start_Date} (${leaveData.StartDateType.replace('_', ' ')})</div>
                </div>
                

                ${
                  leaveData.End_Date
                    ? `
                  <div>
                  <div class="divider"></div>
                  <div class="detail-item">
                  <div class="detail-label">To</div>
                  <div class="detail-value">
                  ${leaveData.End_Date} (
                  ${leaveData.EndDateType.replace('_', ' ')})
                  </div>
                  </div>
                  </div>
                    `
                    : ''
                }
                
                <div class="divider"></div>
                
                <div class="detail-item">
                  <div class="detail-label">Reason</div>
                  <div class="detail-value">${leaveData.Leave_Reason}</div>
                </div>                
            
              <p>This application requires your review and approval. Please login to the Employee Management System to approve or reject this request.</p>
              
              <p>Thank you,<br>Employee Management System</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending leave notification email:', error);
  }
};

const calculateLeaveDays = (startDate, endDate, startDateType, endDateType) => {
  const MS_IN_DAY = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (!end) {
    // Single-day leave
    if (startDateType === 'Full_Day') return 1;
    if (startDateType === 'First_Half' || startDateType === 'Second_Half')
      return 0.5;
    return 0;
  }

  const isSameDay = start.toDateString() === end.toDateString();
  let totalDays = 0;

  if (isSameDay) {
    if (startDateType === 'Full_Day') {
      totalDays = 1;
    } else if (
      startDateType === 'First_Half' &&
      endDateType === 'Second_Half'
    ) {
      totalDays = 1;
    } else if (startDateType === endDateType) {
      totalDays = 0.5;
    } else {
      totalDays = 1;
    }
  } else {
    const diffDays = Math.floor((end - start) / MS_IN_DAY);
    if (diffDays < 0) return 0;
    totalDays += startDateType === 'Full_Day' ? 1 : 0.5;
    totalDays += diffDays - 1;
    totalDays += endDateType === 'Full_Day' ? 1 : 0.5;
  }

  return totalDays;
};

const createLeave = AsyncHandler(async (req, res) => {
  const {
    Leave_Reason,
    LEAVE_TYPE,
    Start_Date,
    StartDateType,
    End_Date,
    EndDateType,
  } = req.body;

  if (!Leave_Reason || !LEAVE_TYPE || !Start_Date || !StartDateType) {
    throw new ApiError('All fields are required', 400);
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  try {
    const leave = await Leave.create({
      Leave_Reason,
      EMPCODE: user.EMP_CODE,
      userName: user.Name,
      LEAVE_TYPE,
      Start_Date: new Date(Start_Date)
        .toLocaleDateString('en-CA')
        .split('/')
        .join('-'),
      StartDateType,
      End_Date: req.body.End_Date
        ? new Date(End_Date).toLocaleDateString('en-CA').split('/').join('-')
        : '',
      EndDateType,
      Days: calculateLeaveDays(
        Start_Date,
        End_Date,
        StartDateType,
        EndDateType
      ),
    });
    const savedLeave = await leave.save();

    try {
      sendMail(savedLeave, req.user.Name)
        .then(() => console.log('Email sent successfully'))
        .catch((emailError) =>
          console.error('Error sending Email:', emailError)
        );
      return res
        .status(201)
        .json(new ApiResponse(201, savedLeave, 'Leave Created Successfully'));
    } catch (emailError) {
      console.error('Error sending Email:', emailError);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          savedLeave,
          'Leave Created Successfully (Email notification failed)'
        )
      );
  } catch (error) {
    throw new ApiError(500, error, 'Leave creation failed');
  }
});

const getAllLeave = AsyncHandler(async (req, res) => {
  const rolesPermission = req.permission;
  const ViewAccess = rolesPermission?.leave.canViewOthersLeave;
  if (ViewAccess === true) {
    const leave = await Leave.find({}).sort({ createdAt: -1 });
    if (!leave) {
      throw new ApiError(400, 'No leave found');
    }
    return res
      .status(200)
      .json(new ApiResponse(200, leave, 'All Leave Fetched Successfully'));
  } else {
    const leave = await Leave.find({ EMPCODE: req.user.EMP_CODE }).sort({
      createdAt: -1,
    });
    if (!leave) {
      throw new ApiError(400, 'No leave found');
    }
    return res
      .status(200)
      .json(new ApiResponse(200, leave, 'All Leave Fetched Successfully'));
  }
});

const getLeaveById = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const leave = await Leave.findById(id);
  if (!leave) {
    throw new ApiError('Leave not found', 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'Leave Fetched Successfully'));
});

const deleteLeave = AsyncHandler(async (req, res) => {
  const id = req.body;
  const newid = Object.values(id)[0];
  const leave = await Leave.findByIdAndDelete(newid);
  if (!leave) {
    throw new ApiError('Leave not found', 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'Leave Deleted Successfully'));
});

const updateLeave = AsyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.body.id);
  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  leave.Leave_Reason = req.body.data.Leave_Reason;
  leave.LEAVE_TYPE = req.body.data.LEAVE_TYPE;
  leave.Start_Date = req.body.data.Start_Date;
  leave.StartDateType = req.body.data.StartDateType;
  leave.End_Date = req.body.data.End_Date;
  leave.EndDateType = req.body.data.EndDateType;
  leave.Days = calculateLeaveDays(
    req.body.data.Start_Date,
    req.body.data.End_Date,
    req.body.data.StartDateType,
    req.body.data.EndDateType
  );

  const updatedLeave = await leave.save();

  const newLeave = {
    Leave_Reason: updatedLeave.Leave_Reason,
    LEAVE_TYPE: updatedLeave.LEAVE_TYPE,
    Start_Date: updatedLeave.Start_Date,
    StartDateType: updatedLeave.StartDateType,
    End_Date: updatedLeave.End_Date ? updatedLeave.End_Date : '',
    EndDateType: updatedLeave.EndDateType,
    Days: updatedLeave.Days,
  };

  const updatedLeaveData = {
    Leave_Reason: updatedLeave.Leave_Reason,
    EMPCODE: leave.EMPCODE,
    userName: leave.userName,
    LEAVE_TYPE: updatedLeave.LEAVE_TYPE,
    Start_Date: updatedLeave.Start_Date,
    StartDateType: updatedLeave.StartDateType,
    End_Date: updatedLeave.End_Date,
    EndDateType: updatedLeave.EndDateType,
    Days: leave.Days,
    Status: leave.Status,
    updatedAt: leave.updatedAt,
  };

  try {
    sendMail(updatedLeaveData, req.user.Name)
      .then(() => {
        console.log('Email sent Successfully');
      })
      .catch((emailErr) => {
        console.log('Error in uploading email', emailErr);
      });
    return res
      .status(201)
      .json(new ApiResponse(201, newLeave, 'Leave Updated Successfully'));
  } catch (emailError) {
    console.error('Error sending Email:', emailError);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newLeave, 'Leave Updated Successfully'));
});

const createnewLeave = AsyncHandler(async (req, res) => {
  const { Leave_Reason, Leave_Code } = req.body;

  const leaveExists = await CreateLeave.findOne({ Leave_Reason });
  if (leaveExists) {
    throw new ApiError(400, 'Leave alreday exists');
  }
  try {
    const leaveReason = await CreateLeave.create({
      Leave_Reason,
      Leave_Code,
    });
    await leaveReason.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, leaveReason, 'Leave Reason Created Successfully')
      );
  } catch (error) {
    throw new ApiError(500, error, 'Leave Reason creation failed');
  }
});

const getCreatedLeave = AsyncHandler(async (req, res) => {
  const leave = await CreateLeave.find({}).sort({ createdAt: -1 });
  if (!leave) {
    throw new ApiError('No leave found', 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'Leave Fetched Successfully'));
});

const getCreatedLeaveById = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const leave = await CreateLeave.findById(id);
  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'Leave Fetched Successfully'));
});

const updateCreatedLeave = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const leave = await CreateLeave.findById(id);

  const leaveExists = await CreateLeave.findOne({
    Leave_Reason: req.body.data.Leave_Reason,
  });
  if (leaveExists) {
    throw new ApiError(400, 'Leave alreday exists');
  }
  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }
  leave.Leave_Reason = req.body.data.Leave_Reason;
  leave.Leave_Code = req.body.data.Leave_Code;
  const updatedLeave = await leave.save();
  const newLeave = {
    Leave_Reason: updatedLeave.Leave_Reason,
    Leave_Code: updatedLeave.Leave_Code,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, newLeave, 'Leave Updated Successfully'));
});

const deleteCreatedLeave = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const newid = req.body.data;
  const leave = await CreateLeave.findByIdAndDelete(newid);
  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'Leave Deleted Successfully'));
});

const approveLeave = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const mongooseid = new mongoose.Types.ObjectId(id);
  const leave = await Leave.findById(id);
  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }
  await leave.updateOne({ Status: 'Approved' });
  if (leave.Status === 'Approved') {
    await leave.deleteOne(mongooseid);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'Leave Approved Successfully'));
});

const rejectLeave = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  const leave = await Leave.findById(id);
  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }
  await leave.updateOne({ Status: 'Rejected' });
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'Leave Rejected Successfully'));
});

export {
  createLeave,
  getAllLeave,
  deleteLeave,
  updateLeave,
  getLeaveById,
  createnewLeave,
  getCreatedLeave,
  updateCreatedLeave,
  getCreatedLeaveById,
  deleteCreatedLeave,
  approveLeave,
  rejectLeave,
};
