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
  console.log(req.user.role);

  const isAuthorized = await User.aggregate([
    [
      {
        $lookup: {
          from: "useraccesses",
          localField: "roleid",
          foreignField: "role",
          as: "ok",
        },
      },
      {
        $match: {
          role: req.user.role,
        },
      },
      {
        $unwind: {
          path: "$ok",
        },
      },
      {
        $project: {
          manageUserAccess: "$ok.manageUserAccess",
          manageuser: "$ok.manageUser",
        },
      },
    ],
  ]);
  const isManageUserAllowed = isAuthorized[0].manageuser;
  const isUserAccessAllowed = isAuthorized[0].manageUserAccess;

  if (isManageUserAllowed && isUserAccessAllowed) {
    console.log("Authorizes");
    next();
  } else {
    throw new ApiError(404, "Unauthorized");
  }
});

export { authenticate, Authorized };
