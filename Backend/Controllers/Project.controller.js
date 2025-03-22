import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { Project } from "../Models/projectmodel.js";
import { User } from "../Models/user.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";

const createProject = AsyncHandler(async (req, res) => {
  const { name, progress_status, status } = req.body;

  if (!req.body) {
    throw new ApiError(404, "All fields are required");
  }

  const projectExists = await Project.findOne({ name });
  if (projectExists) {
    throw new ApiError(405, "Project already Exists");
  }

  const user = await User.findById(req.user._id);

  const logoLocalPath = req.files?.logo?.[0]?.path;
  if (!logoLocalPath) {
    throw new ApiError(404, "Logo is required");
  }

  let logophoto;
  try {
    logophoto = await uploadOnCloudinary(logoLocalPath);
    console.log("logo uploaded");
  } catch (error) {
    console.log("Error in uploading logo", error);
    throw new ApiError(500, "Failed to upload logo");
  }

  try {
    const project = await Project.create({
      name,
      logo: logophoto?.url,
      users: [
        {
          user_id: user._id,
        },
      ],
      progress_status,
      status,
      createdBy: user._id,
      updatedBy: user._id,
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

export { createProject, getAllProject };
