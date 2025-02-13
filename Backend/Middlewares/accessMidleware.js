import { Role } from "../Models/Role.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const roles = AsyncHandler(async (req, res, next) => {
  const result = await Role.aggregate([
    [
      {
        $match: {
          name: req.body.role,
        },
      },
    ],
  ]);
  req.rolesResult = result;
  next();
});

export { roles };
