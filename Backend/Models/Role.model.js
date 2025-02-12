import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["Admin", "Developer", "HR", "Product_Manager"],
  },
  permission: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserAccess",
    },
  ],
});

export const Role = mongoose.model("Role", roleSchema);
