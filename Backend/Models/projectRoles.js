import mongoose, { Schema } from 'mongoose';

const Project_RolesSchema = new Schema(
  {
    name: {
      type: String,
      enum: ['Developer', 'Project_Admin', 'Project_Manager'],
      unique: true,
      required: true,
    },
    access: {
      type: Schema.Types.Mixed,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const Project_Roles = mongoose.model(
  'Project_Roles',
  Project_RolesSchema
);
