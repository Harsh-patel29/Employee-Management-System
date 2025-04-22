import { Project } from '../Models/projectmodel.js';
import { User } from '../Models/user.model.js';
import { Task } from '../Models/taskmodel.js';
import mongoose from 'mongoose';

const assignedProject = async (req, res, next) => {
  const project = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: 'users.user_id',
        as: 'result',
      },
    },
    {
      $unwind: {
        path: '$result',
      },
    },
    {
      $project: {
        result: 1,
      },
    },
  ]);
  req.project = project;

  next();
};

const assigneName = async (req, res, next) => {
  const id = req.params.id;
  const getTaskDetails = await Task.findOne({ CODE: id });
  const assignedName = await Project.aggregate([
    {
      $match: {
        name: getTaskDetails?.Project,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'users.user_id',
        foreignField: '_id',
        as: 'sdk',
      },
    },
    {
      $project: {
        sdk: 1,
      },
    },
  ]);
  req.assignedName = assignedName;

  next();
};

export { assignedProject, assigneName };
