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
      Project:"",
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

const updateTaskStatus = AsyncHandler(async (req,res)=>{
  const {taskId,status} = req.body
  const task = await Task.findByIdAndUpdate(taskId,{Status:status},{new:true})
  return res.status(200).json(new ApiResponse(200,task,"Task status updated successfully"))
})

const updateTask = AsyncHandler(async (req,res)=>{
  const code = req.params.code
  const task = await Task.findOne({CODE:code})

try {
    if(!task){
      throw new ApiError(404,"Task not found")
    }
    task.title = req.body.title
    task.description = req.body.description
    task.Project = req.body.Project
    task.todo = req.body.todo
    task.comments = req.body.comments
    task.EndDate = req.body.EndDate
    task.Totatime = req.body.Totatime
    task.EstimatedTime = req.body.EstimatedTime
    task.Users = req.body.Users
    task.Attachments = req.body.Attachments
    task.Status = req.body.status
    task.Asignee = req.body.Asignee
    task.StartDate = req.body.StartDate
  
     const updatedTask = await task.save()
  
    const newTask = {
      title: updatedTask.title,
      description: updatedTask.description,
      Project: updatedTask.Project,
      todo: updatedTask.todo,
      comments: updatedTask.comments,
      EndDate: updatedTask.EndDate,
      Totatime: updatedTask.Totatime,
      EstimatedTime: updatedTask.EstimatedTime,
      Users: updatedTask.Users,
      Attachments: updatedTask.Attachments,
      Status: updatedTask.Status,
      Asignee: updatedTask.Asignee,
      StartDate: updatedTask.StartDate,
    }
  
    return res.status(200).json(new ApiResponse(200,newTask,"Task updated successfully"))
} catch (error) {
  throw new ApiError(500,error,"Something went wrong while updating task")
}
})

export { createTask, getAlltasks,updateTaskStatus,updateTask };
