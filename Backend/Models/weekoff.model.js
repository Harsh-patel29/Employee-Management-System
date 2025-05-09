import mongoose, { Schema } from 'mongoose';

const DaySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ['Full Day', 'Half Day', 'WeekOff'],
  },
  weeks: {
    type: [String],
    enum: [
      'First Week',
      'Second Week',
      'Third Week',
      'Fourth Week',
      'Fifth Week',
    ],
  },
});

const weekOffSchema = new Schema(
  {
    WeekOffName: {
      type: String,
      required: true,
    },
    Effective_Date: {
      type: Date,
      required: true,
    },
    days: {
      type: [DaySchema],
      required: true,
    },
  },
  { timestamps: true }
);

export const WeekOff = mongoose.model('WeekOff', weekOffSchema);
