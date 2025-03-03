import mongoose, { Schema } from "mongoose";

const RolekeysSchmea = new Schema(
  {
    access_key: {
      user: {
        type: Array,
        required: true,
      },
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const keysSchema = mongoose.model("RolesKeySchema", RolekeysSchmea);
