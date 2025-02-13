import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import bcryptjs from "bcryptjs";

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
    Password,
    Date_of_Birth,
    Mobile_Number,
    Gender,
    EMP_CODE,
    DATE_OF_JOINING,
    Designation,
    WeekOff,
    role,
  } = req.body;

  // if (
  //   !Email ||
  //   !Password ||
  //   !Date_of_Birth ||
  //   !Mobile_Number ||
  //   !Gender ||
  //   !DATE_OF_JOINING ||
  //   !Designation ||
  //   !WeekOff ||
  //   !role
  // ) {
  //   throw new ApiError(400, "All fields are required");
  // }

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

  const loggedInUser = await User.findById(user._id).select(
    "-Password -refreshToken"
  );
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

export { createUser, loginUser, logoutUser };
