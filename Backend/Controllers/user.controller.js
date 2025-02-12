import { User } from "../Models/user.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
const createUser = AsyncHandler(async (req, res) => {
  const {
    Email,
    Password,
    Date_of_Birth,
    Mobile_Number,
    Gender,
    EMP_CODE,
    DATE_OF_JOINING,
    Designation,
    WeekOff,
    role,
  } = req.body;

  // if (
  //   !Email ||
  //   !Password ||
  //   !Date_of_Birth ||
  //   !Mobile_Number ||
  //   !Gender ||
  //   !DATE_OF_JOINING ||
  //   !Designation ||
  //   !WeekOff ||
  //   !role
  // ) {
  //   throw new ApiError(400, "All fields are required");
  // }

  const userExist = await User.findOne({
    $or: [{ Email }, { EMP_CODE }],
  });
  if (userExist) {
    throw new ApiError(404, "User already exists");
  }

  try {
    const rolesResult = req.rolesResult;
    const roleid = rolesResult[0]._id;
    const user = await User.create({
      Email,
      Password,
      Date_of_Birth,
      Mobile_Number,
      Gender,
      EMP_CODE: await User.generateEMPCode(),
      DATE_OF_JOINING,
      Designation,
      WeekOff,
      role,
      roleid: roleid,
    });
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User Created Successfully"));
  } catch (error) {
    throw new ApiError(500, error, "User creation failed");
  }
});

export { createUser };
