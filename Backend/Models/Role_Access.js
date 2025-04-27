import mongoose, { Schema } from 'mongoose';

const User_AccessSchema = new Schema(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    access_keys: {
      type: Schema.Types.Mixed,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const UserAccess = mongoose.model('UserAccess', User_AccessSchema);
