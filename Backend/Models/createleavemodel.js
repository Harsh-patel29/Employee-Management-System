import mongoose, { Schema } from 'mongoose';

const createleaveSchema = new Schema({
  Leave_Reason: {
    type: String,
    required: true,
  },
  Leave_Code: {
    type: String,
    required: true,
  },
});

export const CreateLeave = mongoose.model('CreateLeave', createleaveSchema);
