import mongoose, { Schema } from 'mongoose';

const regularizationSchema = new Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    Date: {
      type: String,
      required: true,
    },
    MissingPunch: {
      type: String,
      required: true,
    },
    Reason: {
      type: String,
      required: true,
    },
    Remarks: {
      type: String,
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

export const Regularization = mongoose.model(
  'Regularization',
  regularizationSchema
);
