import mongoose from "mongoose";
import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { error, log } from "console";

const generateAccessandRefreshToken = async (UserID) => {
  try {
    const user = await User.findById(UserID);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh Token"
    );
  }
};

const createUser = AsyncHandler(async (req, res) => {
  const {
    Email,
    Name,
    Password,
    Date_of_Birth,
    Mobile_Number,
    Gender,
    EMP_CODE,
    DATE_OF_JOINING,
    Designation,
    WeekOff,
    role,
    ReportingManager,
  } = req.body;

  const userExist = await User.findOne({
    $or: [{ Email }, { EMP_CODE }],
  });
  if (userExist) {
    throw new ApiError(404, "User already exists");
  }

  try {
    const rolesResult = req.rolesResult;

    const roleid = rolesResult[0]._id;

    const user = await User.create({
      Email,
      Name,
      Password,
      Date_of_Birth,
      Mobile_Number,
      Gender,
      EMP_CODE: await User.generateEMPCode(),
      DATE_OF_JOINING,
      Designation,
      WeekOff,
      role,
      roleid: roleid,
      ReportingManager,
    });
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User Created Successfully"));
  } catch (error) {
    throw new ApiError(500, error, "User creation failed");
  }
});

const loginUser = AsyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    throw new ApiError(400, "All fileds are required");
  }

  const user = await User.findOne({ Email });
  if (!user) {
    throw new ApiError(403, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(Password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Email or Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const option = {
    httpOnly: true,
  };

  const loggedInUser = await User.findById(user._id).select("-Password ");
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiResponse(200, loggedInUser, "User loggedIn Successfully"));
});

const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User loggedOut Successfully"));
});

const updateUser = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  } else {
    (user.Name = req.body.Name),
      (user.Email = req.body.Email),
      (user.Password = req.body.Password),
      (user.Date_of_Birth = req.body.Date_of_Birth),
      (user.Mobile_Number = req.body.Mobile_Number),
      (user.Gender = req.body.Gender),
      (user.DATE_OF_JOINING = req.body.DATE_OF_JOINING || user.DATE_OF_JOINING),
      (user.Designation = req.body.Designation);
    (user.WeekOff = req.body.WeekOff),
      (user.role = req.body.role),
      (user.ReportingManager = req.body.ReportingManager);

    const updatedUser = await user.save();
    console.log(updateUser);
    const newUser = {
      Name: updatedUser.Name,
      Email: updatedUser.Email,
      Password: updatedUser.Password,
      Date_of_Birth: updatedUser.Date_of_Birth,
      Mobile_Number: updatedUser.Mobile_Number,
      Gender: updatedUser.Gender,
      DATE_OF_JOINING: updatedUser.DATE_OF_JOINING,
      Designation: updatedUser.Designation,
      WeekOff: updatedUser.WeekOff,
      role: updatedUser.role,
      ReportingManager: updatedUser.ReportingManager,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, newUser, "User updated Successfully"));
  }
});

const deleteUser = AsyncHandler(async (req, res) => {
  const requestingUser = await User.findById(req.user._id);

  if (!requestingUser) {
    throw new ApiError(404, "Requesting user not found");
  }

  if (requestingUser.role !== "Admin") {
    throw new ApiError(403, "Only admins can delete users");
  }
  const user = await User.findById(req.params.id);
  const id = req.params.id;

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.role === "Admin") {
    throw new ApiError(404, "Admin cannot be deleted");
  }

  await User.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted Successfully"));
});

const getAllUsers = AsyncHandler(async (req, res) => {
  const rolesPermission = req.permission;

  const manageAccess = rolesPermission[0].manageUserAccess;

  if (manageAccess === true) {
    const user = await User.find({});
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched Successfully"));
  }
  if (manageAccess === false) {
    const user = await User.find({ _id: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Developer Fetched Successfully"));
  }
});

const getUserById = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched Successfully"));
  }
});

export {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
};
