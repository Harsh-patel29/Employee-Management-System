import { Role } from "./Models/Role.model.js";
import { UserAccess } from "./Models/Role_Access.js";
import { connectDB } from "./DB/index.js";
import { AsyncHandler } from "./Utils/AsyncHandler.js";
import { ApiError } from "./Utils/ApiError.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./Models/user.model.js";

dotenv.config({
  path: "../.env",
});

const seedData = async () => {
  const id = new mongoose.Types.ObjectId("67cc0615b3974b238cfae99b");
  try {
    const AdminRole = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          access_keys: new mongoose.Schema.Types.ObjectId(
            "67ac6426aef8063f23746a75"
          ),
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
