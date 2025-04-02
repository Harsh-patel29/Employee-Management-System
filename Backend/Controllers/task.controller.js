import mongoose from "mongoose";
import { Task } from "../Models/taskmodel.js";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";

const createTask = AsyncHandler(async (req, res) => {
  const {
    title,
    description,
    todo,
    comments,
    Project,
    Status,
    Asignee,
    StartDate,
    EndDate,
    EstimatedTime,
    Users,
    Attachments,
  } = req.body;

  const user = await User.findById(req.user._id);

  // const project = await User.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(req.user._id),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "projects",
  //       localField: "_id",
  //       foreignField: "users.user_id",
  //       as: "result",
  //     },
  //   },
  //   {
  //     $unwind: {
  //       path: "$result",
  //     },
  //   },
  //   {
  //     $project: {
  //       result: 1,
  //     },
  //   },
  // ]);

  try {
    const task = await Task.create({
      CODE: await Task.generatetaskCode(),
      title,
      description,
      todo: [],
      comments: [],
      Project,
      Totatime: "00:00:00",
      Status: "Backlog",
      Asignee: user.Name,
      StartDate,
      EndDate,
      EstimatedTime,
      Users,
      Attachments,
      createdBy: user.Name,
    });
    await task.save();
    return res
      .status(200)
      .json(new ApiResponse(200, task, "Task created Successfully"));
  } catch (error) {
    throw new ApiError(500, error, "Something went wrong while creating task");
  }
});

const getAlltasks = AsyncHandler(async (req, res) => {
  const allTasks = await Task.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, allTasks, "All Tasks fetched successfully"));
});

export { createTask, getAlltasks };
