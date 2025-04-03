import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  permission: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserAccess",
    },
  ],
  access: {
    type: Schema.Types.Mixed,
  },
});

export const Role = mongoose.model("Role", roleSchema);
