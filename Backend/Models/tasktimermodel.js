import mongoose, { Schema } from 'mongoose';

const tasktimerSchema = new Schema(
  {
    TaskId: {
      type: String,
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    StartTime: {
      type: Date,
    },
    EndTime: {
      type: Date,
    },
    Duration: {
      type: String,
    },
    Message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TaskTimer = mongoose.model('TaskTimer', tasktimerSchema);
