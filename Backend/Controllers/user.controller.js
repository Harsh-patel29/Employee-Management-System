import { User } from "../Models/user.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";

const generateAccessadndRefreshToken = async (UserID) => {
  try {
    const user = await User.findById(UserID);
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      "500",
      "Something went wrong while creating access and RefreshToken"
    );
  }
};

const signUp = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(404, "All credentials are Required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(400, "User with username and email already exists");
  }
  try {
    const user = await User.create({
      username: username,
      email: email,
      password: password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new ApiError(500, "User not Created");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User created Successfully"));
  } catch (error) {
    console.log("Something went wrong while creating User", error);
    throw new ApiError(500, "Something went wrong while creating User");
  }
});

const loginUser = AsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ email }],
    });

    const { accessToken, refreshToken } = await generateAccessadndRefreshToken(
      existedUser._id
    );
    if (!existedUser) {
      throw new ApiError(404, "User does not exists");
    }
    const isPasswordValid = await existedUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(404, "Password is incorrect");
    }

    const loggedinUser = await User.findById(existedUser._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json(new ApiResponse(200, loggedinUser, "User LoggedIn Successfully"));
  } catch (error) {
    console.log("Something went wrong while loggin user", error);
    throw new ApiError(500, "Something went wrong while loggin user");
  }
});

export { signUp, loginUser };
