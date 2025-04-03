import { Role } from "../Models/Role.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const isAuth = AsyncHandler(async (req, res, next) => {
  const result = await Role.aggregate([
    {
      $match: {
        name: req.user.role,
      },
    },
    {
      $project: {
        access: "$access",
      },
    },
  ]);

  req.permission = result[0].access;

  next();
});

export { isAuth };
