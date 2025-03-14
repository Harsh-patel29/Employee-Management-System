import mongoose, { Schema } from "mongoose";
import { type } from "os";

const AttendanceSchema = new Schema(
  {
    Image: {
      type: String,
      required: true,
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    AttendAt: {
      type: Date,
      default: Date.now,
    },
    LogHours: {
      type: String,
      default: "00:00:00",
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", AttendanceSchema);
