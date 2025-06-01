import mongoose, { Schema } from 'mongoose';

const employeeSalarySchema = new Schema(
  {
    UserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    salaryId: {
      type: Schema.Types.ObjectId,
      ref: 'Salary',
    },
    Salary: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    totaldays: {
      type: String,
      required: true,
    },
    presentDays: {
      type: String,
      required: true,
    },
    halfDays: {
      type: String,
      required: true,
    },
    absentDays: {
      type: String,
      required: true,
    },
    leaveDays: {
      type: String,
      required: true,
    },
    holidayDays: {
      type: String,
      required: true,
    },
    actualWorkingDays: {
      type: String,
      required: true,
    },
    calculatedSalary: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const employeeSalary = mongoose.model(
  'EmployeeSalary',
  employeeSalarySchema
);
