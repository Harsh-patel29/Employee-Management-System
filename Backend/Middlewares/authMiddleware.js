import { Role } from "../Models/Role.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const isAuth = AsyncHandler(async (req, res, next) => {
  const result = await Role.aggregate([
    {
      $lookup: {
        from: "useraccesses",
        localField: "_id",
        foreignField: "role",
        as: "ok",
      },
    },
    {
      $match: {
        name: req.user.role,
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
  ]);
  req.permission = result;
  next();
});

export { isAuth };
