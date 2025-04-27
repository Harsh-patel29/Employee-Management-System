import mongoose, { Schema } from 'mongoose';

const leaveSchema = new Schema(
  {
    Leave_Reason: {
      type: String,
      required: true,
    },
    EMPCODE: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    LEAVE_TYPE: {
      type: String,
      required: true,
    },
    Start_Date: {
      type: String,
      required: true,
    },
    StartDateType: {
      type: String,
      enum: ['First_Half', 'Second_Half', 'Full_Day'],
      required: true,
    },
    End_Date: {
      type: String,
      required: true,
    },
    EndDateType: {
      type: String,
      enum: ['First_Half', 'Second_Half', 'Full_Day'],
      required: true,
    },
    Days: {
      type: Number,
      required: true,
    },
    Status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      required: true,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export const Leave = mongoose.model('Leave', leaveSchema);
