import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    users: {
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    },
    progress_status: {
      type: String,
      enum: ["Pending", "In-Progress", "Hold", "Completed", "Scrapped"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Active", "In-Active"],
      default: "Active",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", ProjectSchema);
