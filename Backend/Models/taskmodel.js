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
        todoStatus: {
          type: Boolean,
          default: false,
        },
      }
    ],
    comments: [
      {
        Attachments: [
          {
            url:{
              type:String,
            },
            public_id:{
              type:String,
            }
          }
        ],
        comment: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
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
      enum: ["Backlog", "In_Progress", "Done", "Completed", "Deployed"],
      default: "Backlog",
    },
    Asignee: {
      type: String,
    },
    EstimatedTime: {
      type: String,
    },
    Users: [
      {
        type: String,
      },
    ],
    Attachments: [
      {
        url:{
          type:String,
        },
        public_id:{
          type:String,
        },
        orignalname:{
          type:String,
        },
        format:{
          type:String,
        }
      },
    ],
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
