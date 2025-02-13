import { Role } from "../Models/Role.model.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
// const isAccessed = AsyncHandler(async (req, res, next) => {
//   try {
//     await Role.aggregate([
//       {
//         $lookup: {
//           from: "useraccesses",
//           localField: "_id",
//           foreignField: "role",
//           as: "Accessed",
//         },
//       },
//       {
//         $match: {
//           name: "Admin",
//         },
//       },
//     ]);
//     next();
//   } catch (error) {
//     throw new ApiError(500, error, "Something went wrong");
//   }
// });

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
