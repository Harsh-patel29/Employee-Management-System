import { Role } from "./Models/Role.model.js";
import { UserAccess } from "./Models/Role_Access.js";
import { connectDB } from "./DB/index.js";
import { AsyncHandler } from "./Utils/AsyncHandler.js";
import { ApiError } from "./Utils/ApiError.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: "../.env",
});

const seedData = async () => {
  const id = new mongoose.Types.ObjectId("67ac6426aef8063f23746a75");
  try {
    const AdminRole = await UserAccess.findByIdAndUpdate(
      id,
      {
        $set: {
          access_keys: {
            user: {
              can_add_user: true,
              can_update_user: true,
              can_delete_user: true,
              can_export_user: true,
              can_view_other_users: true,
              can_view_user_access: true,
              can_add_user_roles: true,
              can_update_user_roles: true,
              can_delete_user_roles: true,
            },
          },
        },
      },
      { new: true }
    );
    // const manageUser = await UserAccess.deleteOne({
    //   manageUser: 0,
    //   manageUserAccess: 0,
    //   role: AdminRole._id,
    // });

    // AdminRole.permission = [manageUser._id];
    // await AdminRole.save();
    console.log("Seeding dones");
    process.exit();
  } catch (error) {
    throw new ApiError(500, "Seeding failed", error);
  }
};

connectDB()
  .then(seedData())
  .catch((err) => console.log(err));
