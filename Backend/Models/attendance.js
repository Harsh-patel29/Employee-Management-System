import mongoose, { Schema } from 'mongoose';

const AttendanceSchema = new Schema(
  {
    Image: {
      type: String,
      // required: true,
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    AttendAt: {
      type: Date,
    },
    LogHours: {
      type: String,
    },
    Latitude: {
      type: Number,
    },
    Longitude: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model('Attendance', AttendanceSchema);
