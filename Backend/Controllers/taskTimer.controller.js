import { User } from '../Models/user.model.js';
import { Task } from '../Models/taskmodel.js';
import { TaskTimer } from '../Models/tasktimermodel.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h: ${minutes}m ${seconds}s`;
};

const createTaskTimer = AsyncHandler(async (req, res) => {
  const { TaskId, Message } = req.body.data;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const task = await Task.findOne({ CODE: TaskId });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  const taskTimer = await TaskTimer.create({
    TaskId,
    User: user.Name,
    Message,
    StartTime: new Date(),
    EndTime: null,
    Duration: '',
  });
  await taskTimer.save();
  return res
    .status(200)
    .json(new ApiResponse(200, taskTimer, 'Task timer created successfully'));
});

const updateTaskTimer = AsyncHandler(async (req, res) => {
  const { id } = req.body.data;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const taskTimer = await TaskTimer.findById(id);
  if (!taskTimer) {
    throw new ApiError(404, 'Task timer not found');
  }
  taskTimer.EndTime = new Date();
  taskTimer.Duration = taskTimer.EndTime - taskTimer.StartTime;
  await taskTimer.save();
  return res
    .status(200)
    .json(new ApiResponse(200, taskTimer, 'Task timer updated successfully'));
});

const getTaskTimer = AsyncHandler(async (req, res) => {
  const { TaskId } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const taskTimer = await TaskTimer.findOne({ TaskId, User: user.Name });
  if (!taskTimer) {
    throw new ApiError(404, 'Task timer not found');
  }
  const finalData = {
    _id: taskTimer._id,
    TaskId: taskTimer.TaskId,
    User: taskTimer.User,
    StartTime: new Date(taskTimer.StartTime).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    }),
    EndTime: taskTimer.EndTime
      ? new Date(taskTimer.EndTime).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        })
      : null,
    Duration: taskTimer.Duration
      ? formatDuration(Number(taskTimer.Duration))
      : null,
    Message: taskTimer.Message,
    createdAt: taskTimer.createdAt,
    updatedAt: taskTimer.updatedAt,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, finalData, 'Task timer fetched successfully'));
});

const getTaskByUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const task = await Task.find({ Users: user.Name });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, 'Task fetched successfully'));
});

const getAllTaskTimer = AsyncHandler(async (req, res) => {
  const taskTimer = await TaskTimer.find({});
  const finalData = taskTimer.map((item) => {
    return {
      _id: item._id,
      TaskId: item.TaskId,
      User: item.User,
      StartTime: new Date(item.StartTime).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      }),
      EndTime: item.EndTime
        ? new Date(item.EndTime).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
          })
        : null,
      Duration: item.Duration ? formatDuration(Number(item.Duration)) : null,
      Message: item.Message,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, finalData, 'All task timer fetched successfully')
    );
});

const deleteTaskTimer = AsyncHandler(async (req, res) => {
  const id = req.body.data;

  const taskTimer = await TaskTimer.findByIdAndDelete(id);
  if (!taskTimer) {
    throw new ApiError(404, 'Task timer not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, taskTimer, 'Task timer deleted successfully'));
});

export {
  createTaskTimer,
  updateTaskTimer,
  getTaskTimer,
  getTaskByUser,
  getAllTaskTimer,
  deleteTaskTimer,
};
