import { Role } from "./Models/Role.model.js";
import { UserAccess } from "./Models/Role_Access.js";
import { connectDB } from "./DB/index.js";
import { AsyncHandler } from "./Utils/AsyncHandler.js";
import { ApiError } from "./Utils/ApiError.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./Models/user.model.js";
import { Project_Roles } from "./Models/projectRoles.js";
import { keysSchema } from "./Models/Roles_keys.js";

dotenv.config({
  path: "../.env",
});

const seedData = async () => {
  // const id = new mongoose.Types.ObjectId("67c551bf4cdbd031d0c17c4e");
  try {
    const AdminRole = await keysSchema.create({
      access_key: {
        user: {
          can_add_user: false,
          can_update_user: false,
          can_delete_user: false,
          can_export_user: false,
          can_view_other_users: false,
          can_view_user_access: false,
          can_add_user_roles: false,
          can_update_user_roles: false,
          can_delete_user_roles: false,
        },
      },
    });
    // const manageUser = await UserAccess.deleteOne({
    //   manageUser: 0,
    //   manageUserAccess: 0,
    //   role: AdminRole._id,
    // });

    // AdminRole.permission = [manageUser._id];
    // await AdminRole.save();
    console.log("Seeding dones", AdminRole);
  } catch (error) {
    throw new ApiError(500, "Seeding failed", error);
  }
};

connectDB()
  .then(seedData())
  .catch((err) => console.log(err));
