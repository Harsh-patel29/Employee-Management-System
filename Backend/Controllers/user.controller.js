import mongoose from "mongoose";
import { User } from "../Models/user.model.js";
import { UserAccess } from "../Models/Role_Access.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { Role } from "../Models/Role.model.js";
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
    const access_keys = rolesResult[0].permission[0];

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
      access_keys: access_keys,
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
  const access = req.permission;
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
  console.log(access);

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

  const user = await User.findById({ _id: id });
  const result = req.rolesResult;
  const roleid = result[0]._id;

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
    user.roleid = roleid;

    const updatedUser = await user.save();

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
  const requestingUserAccess = req.permission;

  if (requestingUserAccess.can_delete_user === false) {
    throw new ApiError(403, "Unauthorized");
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

  const ViewAccess = rolesPermission.can_view_other_users;

  if (ViewAccess === true) {
    const user = await User.find({});
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched Successfully"));
  } else {
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

const ManageDetails = AsyncHandler(async (req, res) => {
  const roleid = await Role.aggregate([
    [
      {
        $lookup: {
          from: "useraccesses",
          localField: "_id",
          foreignField: "role",
          as: "ok",
        },
      },
      {
        $unwind: {
          path: "$ok",
        },
      },
      {
        $project: {
          ok: "$ok",
        },
      },
    ],
  ]);

  return res.status(200).json(new ApiResponse(200, roleid, "Fetched"));
});

const getAllowedSettingsById = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params);
  const Permissions = await UserAccess.findById(id);
  const AllowedPermissions = Permissions.access_keys.user;

  return res
    .status(200)
    .json(new ApiResponse(200, AllowedPermissions, "Fetched!!"));
});

const chageAccess = AsyncHandler(async (req, res) => {
  const { id } = req.params; // permission document id
  const { key, value } = req.body; // expected payload: { key, value }

  // Additional check to ensure key is provided
  if (typeof key === "undefined" || key === null) {
    throw new ApiError(400, "Permission key is undefined");
  }

  // Validate the id format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid permissions id");
  }

  const permissions = await UserAccess.findById(id);

  if (!permissions) {
    throw new ApiError(404, "Permissions not found");
  }

  // Ensure the permissions structure is valid and the key exists
  if (!permissions.access_keys || !permissions.access_keys.user) {
    throw new ApiError(500, "Invalid permissions structure");
  }
  if (!(key in permissions.access_keys.user)) {
    throw new ApiError(400, `Permission key "${key}" does not exist`);
  }

  // Update the specific permission key with the new value
  await UserAccess.findByIdAndUpdate(
    id,
    { $set: { [`access_keys.user.${key}`]: value } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        permissions.access_keys.user,
        "Access updated successfully"
      )
    );
});

export {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  ManageDetails,
  getAllowedSettingsById,
  chageAccess,
};
