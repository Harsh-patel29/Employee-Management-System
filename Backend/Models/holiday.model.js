import mongoose, { Schema } from 'mongoose';

const holidaySchema = new Schema(
  {
    holiday_name: {
      type: String,
      required: true,
    },
    Start_Date: {
      type: String,
      required: true,
    },
    End_Date: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Holiday = mongoose.model('Holiday', holidaySchema);
