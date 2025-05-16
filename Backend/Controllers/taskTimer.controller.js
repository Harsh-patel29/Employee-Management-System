import { User } from '../Models/user.model.js';
import { Task } from '../Models/taskmodel.js';
import { TaskTimer } from '../Models/tasktimermodel.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const createTaskTimer = AsyncHandler(async (req, res) => {
  const { TaskId, Message } = req.body.data;

  const task = await Task.findOne({ CODE: TaskId });
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  const taskTimer = await TaskTimer.create({
    TaskId,
    User: req.user._id,
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
  const { id, TaskCode } = req.body.data;

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
  const totalTime = await TaskTimer.aggregate([
    {
      $lookup: {
        from: 'tasks',
        localField: 'TaskId',
        foreignField: 'CODE',
        as: 'result',
      },
    },
    {
      $unwind: {
        path: '$result',
      },
    },
    {
      $match: {
        'result.CODE': TaskCode,
      },
    },
    {
      $group: {
        _id: '$result.CODE',
        totalDuration: {
          $sum: {
            $convert: {
              input: '$Duration',
              to: 'int',
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        totalDuration: 1,
      },
    },
  ]);

  await Task.findOneAndUpdate(
    { CODE: TaskCode },
    { Totaltime: totalTime[0].totalDuration }
  );
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
  const taskTimer = await TaskTimer.findOne({
    TaskId,
    User: req.user._id,
  }).populate('User');

  if (!taskTimer) {
    throw new ApiError(404, 'Task timer not found');
  }
  const finalData = {
    _id: taskTimer._id,
    TaskId: taskTimer.TaskId,
    User: taskTimer.User.Name,
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
  const user = req.user.Name;
  const rolesPermission = req.permission;
  const ViewAccess = rolesPermission?.taskTimer.canViewOthersTaskTimer;
  let taskTimer;
  if (ViewAccess === true) {
    taskTimer = await TaskTimer.find({})
      .populate('User')
      .sort({ createdAt: -1 });
  } else {
    taskTimer = await TaskTimer.find({ User: req.user._id })
      .populate('User')
      .sort({ createdAt: -1 });
  }

  const finalData = taskTimer.map((item) => {
    return {
      _id: item._id,
      TaskId: item.TaskId,
      User: item.User.Name,
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
