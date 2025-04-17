import mongoose, { Schema } from 'mongoose';

const AttendanceSchema = new Schema(
  {
    Image: {
      type: String,
      required: true,
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    AttendAt: {
      type: Date,
      default: '19:00:00',
    },
    LogHours: {
      type: String,
      default: '00:00:00',
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
