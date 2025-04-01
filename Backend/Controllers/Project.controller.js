import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { Project } from "../Models/projectmodel.js";
import { Project_Roles } from "../Models/projectRoles.js";
import { User } from "../Models/user.model.js";
import mongoose from "mongoose";

const createProject = AsyncHandler(async (req, res) => {
  const { name, progress_status, status, logo } = req.body;

  if (!req.body) {
    throw new ApiError(404, "All fields are required");
  }

  const projectExists = await Project.findOne({ name });
  if (projectExists) {
    throw new ApiError(405, "Project already Exists");
  }

  const user = await User.findById(req.user._id);

  const role_id = await Project_Roles.aggregate([
    {
      $match: {
        name: "Project_Admin",
      },
    },
    {
      $project: {
        _id: "$_id",
      },
    },
  ]);

  try {
    const project = await Project.create({
      name,
      logo,
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
      .json(new ApiResponse(200, project, "Project created Successfully"));
  } catch (error) {
    throw new ApiError(500, error, "Project creation failed");
  }
});

const getAllProject = AsyncHandler(async (req, res) => {
  const project = await Project.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Projects fetched successfully"));
});

const getProjectbyId = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const project = await Project.findById(id);
  const userResponse = {
    ...project.toObject(),
  };
  if (!project) {
    throw new ApiError(404, "Project not found");
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, userResponse, "Project fetched successfully"));
  }
});

const updateProject = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const project = await Project.findById(id);

  try {
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    project.name = req.body.name;
    project.logo = req.body.logo || project.logo;
    project.progress_status = req.body.progress_status;
    project.status = req.body.status;
    project.createdBy = req.user._id;
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
      .json(new ApiResponse(200, newProject, "Project updated Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error,
      "Something went wrong while updating project"
    );
  }
});

const deleteProject = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  await Project.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

const getProjectRoles = AsyncHandler(async (req, res) => {
  const Roles = await Project_Roles.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, Roles, "Details fetched successfully"));
});

const AssignUser = AsyncHandler(async (req, res) => {
  const { user, role } = req.body;

  if (!user || !role) {
    throw new ApiError(404, "user and role is required");
  }

  const id = new mongoose.Types.ObjectId(req.params.id);
  const userid = req.idDetail;
  const user_id = Object.values(userid);
  const roleid = req.roleid;
  const role_id = Object.values(roleid);

  const AssignedUser = await Project.findByIdAndUpdate(
    id,
    {
      $push: {
        users: {
          user_id,
          role_id,
        },
      },
    },
    { new: true, upsert: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, AssignedUser, "Updated Successfully"));
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
        path: "$users",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "users.user_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $lookup: {
        from: "project_roles",
        localField: "users.role_id",
        foreignField: "_id",
        as: "rolesResult",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
      },
    },
    {
      $unwind: {
        path: "$rolesResult",
      },
    },
    {
      $project: {
        _id: 0,
        userid: "$userDetails._id",
        username: "$userDetails.Name",
        roleId: "$rolesResult._id",
        rolesName: "$rolesResult.name",
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, name, "Users name and roles fetched successfully")
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
      .json(new ApiResponse(200, {}, "Assigned user deleted successfully"));
  } else {
    throw new ApiError(500, "User not found or already deleted");
  }
});

const logoUpload = AsyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.logo, "Logo Uploaded "));
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
};
