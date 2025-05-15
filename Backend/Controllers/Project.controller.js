import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { Project } from '../Models/projectmodel.js';
import { Project_Roles } from '../Models/projectRoles.js';
import { User } from '../Models/user.model.js';
import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../Utils/cloudinary.js';
const cleanup = async (public_id) => {
  try {
    await deleteFromCloudinary(public_id);
  } catch (cleanupError) {
    console.log('Failed to delete logo from cloudinary', cleanupError);
  }
};

const createProject = AsyncHandler(async (req, res) => {
  const { name, progress_status, status, logo } = req.body;
  if (!req.body) {
    throw new ApiError(404, 'All fields are required');
  }

  const projectExists = await Project.findOne({ name });
  if (projectExists) {
    throw new ApiError(405, 'Project already Exists');
  }

  const user = await User.findById(req.user._id);

  const role_id = await Project_Roles.aggregate([
    {
      $match: {
        name: 'Project_Admin',
      },
    },
    {
      $project: {
        _id: '$_id',
      },
    },
  ]);

  try {
    const project = await Project.create({
      name,
      logo: {
        url: logo.secure_url,
        public_id: logo.public_id,
      },
      progress_status,
      status,
      createdBy: user._id,
      updatedBy: user._id,
      users: [
        {
          user_id: user._id,
          role_id: role_id[0],
        },
      ],
    });
    await project.save();

    return res
      .status(200)
      .json(new ApiResponse(200, project, 'Project created Successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'Project creation failed');
  }
});

const getAllProject = AsyncHandler(async (req, res) => {
  const userid = req.user._id;
  const rolesPermission = req.permission;
  const ViewAccess = rolesPermission?.project.canViewOthersProject;

  if (ViewAccess === true) {
    const project = await Project.find({}).sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, project, 'Projects fetched successfully'));
  } else {
    const project = await Project.find({
      users: { $elemMatch: { user_id: userid } },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, project, 'Projects fetched successfully'));
  }
});

const getProjectbyId = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const project = await Project.findById(id);
  const userResponse = {
    ...project.toObject(),
  };
  if (!project) {
    throw new ApiError(404, 'Project not found');
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, userResponse, 'Project fetched successfully'));
  }
});

const updateProject = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const project = await Project.findById(id);

  if (req.body.name && req.body.name !== project.name) {
    const nameexists = await Project.findOne({ name: req.body.name });
    if (nameexists) {
      throw new ApiError(404, 'Project name already exists');
    }
  }

  try {
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (req.body.logo && req.body.logo.secure_url && req.body.logo.public_id) {
      if (req.body.logo.public_id !== project.logo?.public_id) {
        const oldLogoPublicId = project.logo?.public_id;

        project.logo = {
          url: req.body.logo.secure_url,
          public_id: req.body.logo.public_id,
        };

        if (oldLogoPublicId && oldLogoPublicId !== req.body.logo.public_id) {
          await cleanup(oldLogoPublicId);
        }
      }
    }

    project.name = req.body.name;
    project.progress_status = req.body.progress_status;
    project.status = req.body.status;
    project.updatedBy = req.user._id;

    const updatedProject = await project.save();

    const newProject = {
      name: updatedProject.name,
      logo: updatedProject.logo,
      progress_status: updatedProject.progress_status,
      status: updatedProject.status,
      createdBy: updatedProject.createdBy,
      updatedBy: updatedProject.updatedBy,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, newProject, 'Project updated Successfully'));
  } catch (error) {
    throw new ApiError(
      500,
      error,
      'Something went wrong while updating project'
    );
  }
});

const deleteProject = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const deletedProject = await Project.findByIdAndDelete(id);
  if (deletedProject.logo) {
    await cleanup(deletedProject.logo.public_id);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Project deleted successfully'));
});

const getProjectRoles = AsyncHandler(async (req, res) => {
  const Roles = await Project_Roles.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, Roles, 'Details fetched successfully'));
});

const AssignUser = AsyncHandler(async (req, res) => {
  const { user, role } = req.body;

  if (!user || !role) {
    throw new ApiError(404, 'user and role is required');
  }

  const id = new mongoose.Types.ObjectId(req.params.id);
  const userid = req.idDetail;
  const user_id = Object.values(userid);
  const roleid = req.roleid;
  const role_id = Object.values(roleid);

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const userExists = project.users.some(
    (user) => user.user_id.toString() === user_id[0].toString()
  );
  const roleExists = project.users.some(
    (user) =>
      user.user_id.toString() === user_id[0].toString() &&
      user.role_id.toString() === role_id[0].toString()
  );

  if (roleExists) {
    throw new ApiError(
      404,
      'User with this role already exists in this project'
    );
  }

  let updatedProject;

  if (userExists) {
    updatedProject = await Project.findOneAndUpdate(
      {
        _id: id,
        'users.user_id': user_id[0],
      },
      {
        $set: {
          'users.$.role_id': role_id[0],
        },
      },
      { new: true }
    );
  } else {
    updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        $push: {
          users: {
            user_id,
            role_id,
          },
        },
      },
      { new: true }
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, 'Updated Successfully'));
});

const getAssignUserName = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  const name = await Project.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $unwind: {
        path: '$users',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'users.user_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $lookup: {
        from: 'project_roles',
        localField: 'users.role_id',
        foreignField: '_id',
        as: 'rolesResult',
      },
    },
    {
      $unwind: {
        path: '$userDetails',
      },
    },
    {
      $unwind: {
        path: '$rolesResult',
      },
    },
    {
      $project: {
        _id: 0,
        userid: '$userDetails._id',
        username: '$userDetails.Name',
        roleId: '$rolesResult._id',
        rolesName: '$rolesResult.name',
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, name, 'Users name and roles fetched successfully')
    );
});

const deleteAssignedUser = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const userid = req.params.userid;
  const roleid = req.params.roleid;
  const deleteUser = await Project.updateOne(
    { _id: id },
    {
      $pull: {
        users: {
          user_id: userid,
          role_id: roleid,
        },
      },
    }
  );
  if (deleteUser.modifiedCount > 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Assigned user deleted successfully'));
  } else {
    throw new ApiError(500, 'User not found or already deleted');
  }
});

const logoUpload = AsyncHandler(async (req, res) => {
  const logo = req.logodetail;
  return res
    .status(200)
    .json(new ApiResponse(200, logo, 'Logo Uploaded Successfully'));
});

const deleteLogo = AsyncHandler(async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    console.log('Logo public_id is required');
  }
  const existingProject = await Project.findOne({
    'logo.public_id': public_id,
  });
  if (existingProject) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Logo is in use, skipping deletion'));
  }
  try {
    await cleanup(public_id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Logo Deleted Successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'Failed to delete logo');
  }
});

export {
  createProject,
  getAllProject,
  getProjectbyId,
  getProjectRoles,
  AssignUser,
  getAssignUserName,
  deleteAssignedUser,
  deleteProject,
  updateProject,
  logoUpload,
  deleteLogo,
};
