import { Role } from "./Models/Role.model.js";
import { UserAccess } from "./Models/Role_Access.js";
import { connectDB } from "./DB/index.js";
import { AsyncHandler } from "./Utils/AsyncHandler.js";
import { ApiError } from "./Utils/ApiError.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const seedData = AsyncHandler(async () => {
  try {
    const AdminRole = await Role.create({
      name: "HR",
    });
    const manageUser = await UserAccess.create({
      manageUser: 0,
      manageUserAccess: 0,
      role: AdminRole._id,
    });

    AdminRole.permission = [manageUser._id];
    await AdminRole.save();
    console.log("Seeding dones");
    process.exit();
  } catch (error) {
    throw new ApiError(500, "Seeding failed");
  }
});

connectDB()
  .then(seedData())
  .catch((err) => console.log(err));
