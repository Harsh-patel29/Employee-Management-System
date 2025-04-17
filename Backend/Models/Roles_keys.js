import mongoose, { Schema } from 'mongoose';

const RolekeysSchmea = new Schema(
  {
    access_key: {
      type: Schema.Types.Mixed,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const keysSchema = mongoose.model('RolesKeySchema', RolekeysSchmea);
