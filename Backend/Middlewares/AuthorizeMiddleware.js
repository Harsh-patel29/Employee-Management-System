import { User } from "../Models/user.model.js";
import { Role } from "../Models/Role.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const authenticate = AsyncHandler(async (req, res, next) => {
  const token =
    (req.cookies && req.cookies.accessToken) ||
    (req.header("Authorization") &&
      req.header("Authorization").startsWith("Bearer ") &&
      req.header("Authorization").replace("Bearer ", ""));

  if (!token) {
    throw new ApiError(404, "Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-Password");

    if (!user) {
      throw new ApiError(400, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid AccessToken");
  }
});

const Authorized = AsyncHandler(async (req, res, next) => {
  const roleid = req.user.roleid;
  const isAdmin = await Role.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(process.env.Admin_ID),
      },
    },
  ]);

  const AdminId = isAdmin[0]._id;

  if (roleid.toString() === AdminId.toString()) {
    console.log("Authorized");
    next();
  } else {
    throw new ApiError(404, "Unauthorized");
  }
});

export { authenticate, Authorized };
