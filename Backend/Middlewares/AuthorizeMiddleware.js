import { User } from "../Models/user.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import jwt from "jsonwebtoken";
import { UserAccess } from "../Models/Role_Access.js";

const authenticate = AsyncHandler(async (req, res, next) => {
  const token =
    (req.cookies && req.cookies.accessToken) ||
    (req.header("Authorization") &&
      req.header("Authorization").startsWith("Bearer ") &&
      req.header("Authorization").replace("Bearer ", ""));

  if (!token) {
    throw new ApiError(404, "No token");
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
  const isAuthorized = await User.aggregate([
    [
      {
        $lookup: {
          from: "useraccesses",
          localField: "roleid",
          foreignField: "role",
          as: "result",
        },
      },
      {
        $match: {
          role: req.user.role,
        },
      },
      {
        $project: {
          result: "$result",
        },
      },
      {
        $unwind: {
          path: "$result",
        },
      },
    ],
  ]);
  const access = isAuthorized[0].result.access_keys.user;

  if (
    access.can_add_user === true ||
    access.can_update_user === true ||
    access.can_delete_user === true
  ) {
    next();
  } else {
    throw new ApiError(404, "Unauthorized");
  }
});

const accessAllowed = AsyncHandler(async (req, res, next) => {
  const isAllowed = await UserAccess.find({});
  req.Allowed = isAllowed;

  next();
});

export { authenticate, Authorized, accessAllowed };
