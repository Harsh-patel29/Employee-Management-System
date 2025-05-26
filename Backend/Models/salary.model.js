import mongoose, { Schema } from 'mongoose';

const SalarySchema = new Schema(
  {
    User: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    WeekOff: {
      type: Schema.Types.ObjectId,
      ref: 'WeekOff',
      required: true,
    },
    Effective_Date: {
      type: String,
      required: true,
    },
    Salary: {
      type: String,
      required: true,
    },
    is_Deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Salary = mongoose.model('Salary', SalarySchema);
