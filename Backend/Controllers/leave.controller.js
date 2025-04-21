import mongoose from 'mongoose';
import { Leave } from '../Models/leavemodel.js';
import { User } from '../Models/user.model.js';
import { CreateLeave } from '../Models/createleavemodel.js';
import { AsyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createLeave = AsyncHandler(async (req, res) => {
  const {
    Leave_Reason,
    LEAVE_TYPE,
    Start_Date,
    StartDateType,
    End_Date,
    EndDateType,
  } = req.body;
  if (
    !Leave_Reason ||
    !LEAVE_TYPE ||
    !Start_Date ||
    !StartDateType ||
    !End_Date ||
    !EndDateType
  ) {
    throw new ApiError('All fields are required', 400);
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end - start);
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      End_Date: new Date(End_Date)
        .toLocaleDateString('en-CA')
        .split('/')
        .join('-'),
      EndDateType,
      Days: calculateDays(Start_Date, End_Date),
    });
    await leave.save();
    return res
      .status(200)
      .json(new ApiResponse(200, leave, 'Leave Created Successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'Leave creation failed');
  }
});

const getAllLeave = AsyncHandler(async (req, res) => {
  const leave = await Leave.find({});
  if (!leave) {
    throw new ApiError('No leave found', 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, leave, 'All Leave Fetched Successfully'));
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
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end - start);
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const leave = await Leave.findById(req.body.id);
  if (!leave) {
    throw new ApiError('Leave not found', 404);
  }

  leave.Leave_Reason = req.body.data.Leave_Reason;
  leave.LEAVE_TYPE = req.body.data.LEAVE_TYPE;
  leave.Start_Date = req.body.data.Start_Date;
  leave.StartDateType = req.body.data.StartDateType;
  leave.End_Date = req.body.data.End_Date;
  leave.EndDateType = req.body.data.EndDateType;
  leave.Days = calculateDays(req.body.data.Start_Date, req.body.data.End_Date);

  const updatedLeave = await leave.save();
  const newLeave = {
    Leave_Reason: updatedLeave.Leave_Reason,
    LEAVE_TYPE: updatedLeave.LEAVE_TYPE,
    Start_Date: updatedLeave.Start_Date,
    StartDateType: updatedLeave.StartDateType,
    End_Date: updatedLeave.End_Date,
    EndDateType: updatedLeave.EndDateType,
    Days: updatedLeave.Days,
  };
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
  const leave = await CreateLeave.find({});
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
