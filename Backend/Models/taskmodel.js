import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    CODE: {
      type: String,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    todo: [
      {
        todoTitle: {
          type: String,
        },
      },
    ],
    comments: [
      {
        Attachments: {
          type: String,
        },
        comment: {
          type: String,
        },
      },
    ],
    StartDate: {
      type: String,
    },
    EndDate: {
      type: String,
    },
    Project: {
      type: String,
    },
    Totatime: {
      type: String,
      default: "00:00:00",
    },
    Status: {
      type: String,
      enum: ["Backlog", "In-Progress", "DONE", "Completed", "Deployes"],
      default: "Backlog",
    },
    Asignee: {
      type: String,
    },
    EstimatedTime: {
      type: String,
    },
    Users: {
      type: "String",
    },
    Attachments: {
      type: String,
    },
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);

taskSchema.statics.generatetaskCode = async function () {
  const lastTask = await this.findOne({}, { CODE: 1 })
    .sort({
      CODE: -1,
    })
    .limit(1);
  if (!lastTask) {
    return "T00001";
  }
  const lastnumber = parseInt(lastTask.CODE.slice(3));
  const nextnumber = lastnumber + 1;
  return `T${nextnumber.toString().padStart(5, "0")}`;
};

export const Task = mongoose.model("Task", taskSchema);
