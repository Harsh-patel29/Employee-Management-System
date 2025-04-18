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
    enum: ['First Week', 'Second Week', 'Third Week', 'Fourth Week'],
  },
});

const weekOffSchema = new Schema({
  WeekOffName: {
    type: String,
    required: true,
  },
  Effective_Date: {
    type: String,
    required: true,
  },
  days: {
    type: [DaySchema],
    required: true,
  },
});

export const WeekOff = mongoose.model('WeekOff', weekOffSchema);
