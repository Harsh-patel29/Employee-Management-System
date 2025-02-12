import mongoose, { Schema } from "mongoose";

const User_AccessSchema = new Schema({
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  manageUser: {
    type: Boolean,
    default: 0,
  },
  manageUserAccess: {
    type: Boolean,
    default: 0,
  },
});

export const UserAccess = mongoose.model("UserAccess", User_AccessSchema);
