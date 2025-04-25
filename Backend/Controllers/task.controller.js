import mongoose from 'mongoose';
import { Task } from '../Models/taskmodel.js';
import { TaskTimer } from '../Models/tasktimermodel.js';
import { User } from '../Models/user.model.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { deleteFromCloudinary } from '../Utils/cloudinary.js';

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

  try {
    const task = await Task.create({
      CODE: await Task.generatetaskCode(),
      title,
      description,
      todo: [],
      comments: [],
      Project: '',
      Totatime: '00:00:00',
      Status: 'Backlog',
      Asignee: user.Name,
      StartDate,
      EndDate,
      EstimatedTime,
      Users: user.Name,
      Attachments,
      createdBy: user.Name,
    });
    await task.save();
    return res
      .status(200)
      .json(new ApiResponse(200, task, 'Task created Successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'Something went wrong while creating task');
  }
});

const getAlltasks = AsyncHandler(async (req, res) => {
  const allTasks = await Task.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, allTasks, 'All Tasks fetched successfully'));
});

const updateTaskStatus = AsyncHandler(async (req, res) => {
  const { taskId, status } = req.body;

  if (status === 'Due_Today') {
    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        Status: 'In_Progress',
        EndDate: new Date().toLocaleDateString('en-CA').split('/').join('-'),
      },
      { new: true }
    );
    if (task.StartDate === undefined) {
      await Task.findByIdAndUpdate(
        taskId,
        {
          StartDate: new Date()
            .toLocaleDateString('en-CA')
            .split('/')
            .join('-'),
        },
        { new: true }
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, task, 'Task status updated successfully'));
  } else if (status === 'OverDue') {
    const prevDate = new Date(new Date().setDate(new Date().getDate() - 1));
    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        Status: 'In_Progress',
        EndDate: prevDate.toLocaleDateString('en-CA').split('/').join('-'),
        StartDate: prevDate.toLocaleDateString('en-CA').split('/').join('-'),
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, task, 'Task status updated successfully'));
  } else {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { Status: status },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, task, 'Task status updated successfully'));
  }
});

const updateTask = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const todo = req.body.todo;
  const todoIndex = req.body.todoIndex;
  const todoStatus = req.body.todoStatus;
  const comments = req.body.comments;
  const isProjectUpdated = req.body.field === 'Project';
  const isUsersUpdated = req.body.field === 'Users';
  try {
    const task = await Task.findOne({ CODE: id });
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    // const totalTime = await TaskTimer.aggregate([
    //   {
    //     $lookup: {
    //       from: 'tasks',
    //       localField: 'TaskId',
    //       foreignField: 'CODE',
    //       as: 'result',
    //     },
    //   },
    //   {
    //     $project: {
    //       result: 1,
    //     },
    //   },
    // ]);

    // console.log(totalTime);

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      Project: req.body.Project,
      EndDate: req.body.EndDate,
      Totatime: req.body.Totatime,
      EstimatedTime: req.body.EstimatedTime,
      Users: req.body.Users,
      Attachments: req.body.Attachments,
      Status: req.body.Status,
      Asignee: req.body.Asignee,
      StartDate: req.body.StartDate,
    };
    updateData.$set = updateData.$set || {};
    updateData.$push = updateData.$push || {};

    if (isProjectUpdated) {
      updateData.Users = req.user.Name;
      updateData.Asignee = req.user.Name;
    } else if (isUsersUpdated && req.body.Users) {
      updateData.Users = req.body.Users;
    }

    if (
      updateData.StartDate > updateData.EndDate ||
      updateData.StartDate === ''
    ) {
      updateData.EndDate = '';
    }

    if (todo) {
      updateData.$push.todo = todo;
    }

    if (todoIndex !== undefined && todoStatus !== undefined) {
      updateData.$set[`todo.${todoIndex}.todoStatus`] = todoStatus;
    }

    if (comments) {
      updateData.$push.comments = comments;
    }

    const updatedTask = await Task.findOneAndUpdate({ CODE: id }, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTask, 'Task updated successfully'));
  } catch (error) {
    console.error('Error updating task:', error);
    throw new ApiError(500, error, 'Something went wrong while updating task');
  }
});

const deleteTask = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOne({ CODE: id });
  const images = task.comments.map((item) => item.Attachments);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  for (const attachment of task.Attachments) {
    await deleteFromCloudinary(attachment.public_id);
  }

  for (const commentAttachments of images) {
    if (commentAttachments && commentAttachments.length > 0) {
      for (const attachment of commentAttachments) {
        if (attachment && attachment.public_id) {
          await deleteFromCloudinary(attachment.public_id);
        }
      }
    }
  }

  await Task.findByIdAndDelete(task._id);
  return res
    .status(200)
    .json(new ApiResponse(200, task, 'Task deleted successfully'));
});

const getTaskById = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const project = req.project;
  const projectName = project.map((item) => item.result.name);
  const assigneName = req.assignedName;
  const name = assigneName.map((item) => item.sdk.map((item) => item.Name));

  const task = await Task.findOne({ CODE: id });
  const data = {
    task,
    projectName,
    name: name[0],
  };
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Task fetched successfully'));
});

const uploadAttachmentImage = AsyncHandler(async (req, res) => {
  const attachment = req.attachmentdetail;
  return res
    .status(200)
    .json(
      new ApiResponse(200, attachment, 'Task attachment uploaded successfully')
    );
});

const Attachment = AsyncHandler(async (req, res) => {
  const attachment = req.attachment;
  return res
    .status(200)
    .json(new ApiResponse(200, attachment, 'Attachment uploaded successfully'));
});

const deleteUploadedImage = AsyncHandler(async (req, res) => {
  const { public_id } = req.body;
  console.log(public_id);
  if (!public_id) {
    throw new ApiError(400, 'Public id is required');
  }
  const attachment = await Task.findOne({
    Attachments: { $elemMatch: { public_id } },
  });
  console.log(attachment);

  const deletedAttachment = await Task.findOneAndUpdate(
    { CODE: attachment.CODE },
    { $pull: { Attachments: { public_id } } },
    { new: true }
  );

  try {
    await deleteFromCloudinary(public_id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedAttachment,
          'Attachment deleted successfully'
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error,
      'Something went wrong while deleting attachment'
    );
  }
});

const deleteAttachedFile = AsyncHandler(async (req, res) => {
  const { public_id } = req.body;
  if (!public_id) {
    throw new ApiError(400, 'Public id is required');
  }
  await deleteFromCloudinary(public_id);
  return res
    .status(200)
    .json(new ApiResponse(200, 'Attached File Deleted Successfully'));
});

const deleteAttachment = AsyncHandler(async (req, res) => {
  const { public_id } = req.body;
  if (!public_id) {
    throw new ApiError(400, 'Public id is required');
  }
  const attachment = await Task.findOne({
    Attachments: { $elemMatch: { public_id } },
  });

  if (!attachment) {
    throw new ApiError(404, 'Attachment not found');
  }
  try {
    const deletedAttachment = await Task.findOneAndUpdate(
      { CODE: attachment.CODE },
      { $pull: { Attachments: { public_id } } },
      { new: true }
    );

    await deleteFromCloudinary(public_id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deletedAttachment,
          'Attachment deleted successfully'
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error,
      'Something went wrong while deleting attachment'
    );
  }
});

const removeTodo = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const { todoId } = req.body;
  if (!id || !todoId) {
    throw new ApiError(400, 'Task ID and Todo ID are required');
  }

  try {
    const task = await Task.findOneAndUpdate(
      { CODE: id },
      { $pull: { todo: { _id: todoId } } },
      { new: true }
    );
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    return res
      .status(200)
      .json(new ApiResponse(200, task, 'Todo removed successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'Something went wrong while removing todo');
  }
});

export {
  createTask,
  getAlltasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTaskById,
  uploadAttachmentImage,
  Attachment,
  deleteAttachment,
  deleteUploadedImage,
  removeTodo,
  deleteAttachedFile,
};
