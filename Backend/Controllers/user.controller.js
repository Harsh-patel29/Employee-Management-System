import mongoose from 'mongoose';
import { User } from '../Models/user.model.js';
import { UserAccess } from '../Models/Role_Access.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { Role } from '../Models/Role.model.js';
import { keysSchema } from '../Models/Roles_keys.js';

const generateAccessandRefreshToken = async (UserID, RemeberMe) => {
  try {
    const user = await User.findById(UserID);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const accessToken = await user.generateAccessToken(RemeberMe);
    const refreshToken = await user.generateRefreshToken(RemeberMe);

    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating access and refresh Token'
    );
  }
};

const createUser = AsyncHandler(async (req, res) => {
  const {
    Email,
    Name,
    Password,
    Date_of_Birth,
    Mobile_Number,
    Gender,
    DATE_OF_JOINING,
    Designation,
    WeekOff,
    role,
    ReportingManager,
  } = req.body;

  const userExist = await User.findOne({
    $or: [{ Email }, { Name }],
  });

  if (userExist) {
    throw new ApiError(404, 'User already exists');
  }

  try {
    const rolesResult = req.rolesResult;

    const roleid = rolesResult[0]._id;
    const access_keys = rolesResult[0].permission[0];

    const user = await User.create({
      Email,
      Name,
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
      access_keys: access_keys,
      ReportingManager,
    });
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User Created Successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'User creation failed');
  }
});

const loginUser = AsyncHandler(async (req, res) => {
  const { Email, Password, RememberMe } = req.body;

  if (!Email || !Password) {
    throw new ApiError(400, 'All fileds are required');
  }

  const user = await User.findOne({ Email });
  if (!user) {
    throw new ApiError(403, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(Password);

  if (!isPasswordValid) {
    throw new ApiError(400, 'Email or Password is incorrect');
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id,
    RememberMe
  );

  const accessTokenExpiry = RememberMe
    ? 7 * 24 * 60 * 60 * 1000
    : 24 * 60 * 60 * 1000;

  const RefreshTokenExpiry = RememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 15 * 60 * 60 * 1000;

  const loggedInUser = await User.findById(user._id).select('-Password ');
  return res
    .status(200)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: accessTokenExpiry,
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: true,
      maxAge: RefreshTokenExpiry,
    })
    .json(new ApiResponse(200, loggedInUser, 'User loggedIn Successfully'));
});

const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
  };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User loggedOut Successfully'));
});

const updateUser = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  const user = await User.findById({ _id: id });
  const result = req.rolesResult;
  const roleid = result[0]._id;

  if (req.body.Name && req.body.Name !== user.Name) {
    const nameexists = await User.findOne({ Name: req.body.Name });
    if (nameexists) {
      throw new ApiError(404, 'User name already exists');
    }
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  } else {
    user.Name = req.body.Name;
    user.Email = req.body.Email;
    if (req.body.Password && req.body.Password.length >= 6) {
      user.Password = req.body.Password;
    } else {
      user.Password = user.Password;
    }
    (user.Date_of_Birth = req.body.Date_of_Birth),
      (user.Mobile_Number = req.body.Mobile_Number),
      (user.Gender = req.body.Gender),
      (user.DATE_OF_JOINING = req.body.DATE_OF_JOINING || user.DATE_OF_JOINING),
      (user.Designation = req.body.Designation);
    (user.WeekOff = req.body.WeekOff),
      (user.role = req.body.role),
      (user.ReportingManager = req.body.ReportingManager);
    user.roleid = roleid;

    const updatedUser = await user.save();

    const newUser = {
      Name: updatedUser.Name,
      Email: updatedUser.Email,
      Password: '',
      Date_of_Birth: updatedUser.Date_of_Birth,
      Mobile_Number: updatedUser.Mobile_Number,
      Gender: updatedUser.Gender,
      DATE_OF_JOINING: updatedUser.DATE_OF_JOINING,
      Designation: updatedUser.Designation,
      WeekOff: updatedUser.WeekOff,
      role: updatedUser.role,
      ReportingManager: updatedUser.ReportingManager,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, newUser, 'User updated Successfully'));
  }
});

const deleteUser = AsyncHandler(async (req, res) => {
  const requestingUserAccess = req.permission;

  if (requestingUserAccess.can_delete_user === false) {
    throw new ApiError(403, 'Unauthorized');
  }
  const user = await User.findById(req.params.id);
  const id = req.params.id;

  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  if (user.role === 'Admin') {
    throw new ApiError(404, 'Admin cannot be deleted');
  }

  await User.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User deleted Successfully'));
});

const getAllUsers = AsyncHandler(async (req, res) => {
  const rolesPermission = req.permission;
  const ViewAccess = rolesPermission.user.can_view_other_users;
  if (ViewAccess === true) {
    const user = await User.find({}).sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User fetched Successfully'))
      .sort({ createdAt: -1 });
  } else {
    const user = await User.find({ _id: req.user._id });
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'Employee Fetched Successfully'));
  }
});

const getUserById = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const user = await User.findById(id);
  const userResponse = {
    ...user.toObject(),
    Password: '',
  };
  if (!user) {
    throw new ApiError(404, 'User not found');
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, userResponse, 'User fetched Successfully'));
  }
});

const ManageDetails = AsyncHandler(async (req, res) => {
  const roleid = await Role.aggregate([
    [
      {
        $lookup: {
          from: 'useraccesses',
          localField: '_id',
          foreignField: 'role',
          as: 'ok',
        },
      },
      {
        $unwind: {
          path: '$ok',
        },
      },
      {
        $project: {
          ok: '$ok',
        },
      },
    ],
  ]);

  return res.status(200).json(new ApiResponse(200, roleid, 'Fetched'));
});

const getAllowedSettingsById = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params);
  const Permissions = await Role.findById(id);
  const AllowedPermissions = Permissions.access;

  return res
    .status(200)
    .json(new ApiResponse(200, AllowedPermissions, 'Fetched!!'));
});

const chageAccess = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category, key, value } = req.body;

  if (typeof key === 'undefined' || key === null) {
    throw new ApiError(400, 'Permission key is undefined');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid permissions id');
  }

  const permissions = await Role.findById(id);

  if (!permissions) {
    throw new ApiError(404, 'Permissions not found');
  }

  if (!permissions.access || !permissions.access.user) {
    throw new ApiError(500, 'Invalid permissions structure');
  }
  if (!(key in permissions.access[category])) {
    throw new ApiError(400, `Permission key "${key}" does not exist`);
  }

  await Role.findByIdAndUpdate(
    id,
    { $set: { [`access.${category}.${key}`]: value } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        permissions.access[category],
        'Access updated successfully'
      )
    );
});

const getDefaultValue = AsyncHandler(async (req, res) => {
  const isDefault = req.isDefault;
  const isDefaultFlag = isDefault && isDefault[0] && isDefault[0].is_default;
  return res
    .status(200)
    .json(new ApiResponse(200, isDefaultFlag, 'Fetched Successfully!!'));
});

const getroles = AsyncHandler(async (req, res) => {
  const roles = await Role.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, roles, 'Roles Fetched Successfully'));
});

const getkeysRoles = AsyncHandler(async (req, res) => {
  const keys = await keysSchema.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, keys, 'Keys Fetched Successfully'));
});

const createRole = AsyncHandler(async (req, res, err) => {
  const { name, access } = req.body;

  if (!name) {
    throw new ApiError(405, 'All fields are required');
  }

  const isRoleExists = await Role.findOne({ name });

  if (isRoleExists) {
    throw new ApiError(404, 'Role Already Exists');
  }

  try {
    const allKeys = await keysSchema.findOne({ is_deleted: false });
    if (!allKeys || !allKeys.access_key || !allKeys.access_key.user) {
      throw new ApiError(404, 'No permission keys found in database');
    }

    const access = await keysSchema.find({});
    const completeAccess = access[0].access_key;

    Object.keys(allKeys.access_key.user).forEach((key) => {
      completeAccess.user[key] = false;
    });

    if (access && access.user) {
      Object.keys(access.user).forEach((key) => {
        if (key in completeAccess.user) {
          completeAccess.user[key] = access.user[key];
        }
      });
    }

    const newrole = await Role.create({
      name,
      access: completeAccess,
    });

    await newrole.save();
    return res
      .status(200)
      .json(new ApiResponse(200, newrole, 'New Role created Successfully'));
  } catch (error) {
    throw new ApiError(
      500,
      error,
      'Something went wrong while creating new role'
    );
  }
});

const getkeyroles = AsyncHandler(async (req, res) => {
  const result = await keysSchema.find({});
  const keys = result;
  return res
    .status(200)
    .json(new ApiResponse(200, keys, 'Fetched Successfully'));
});

const updateRole = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const role = await Role.findById(id);

  if (req.body.name && req.body.name !== role.name) {
    const nameexists = await Role.findOne({ name: req.body.name });
    if (nameexists) {
      throw new ApiError(404, 'Role name already exists');
    }
  }

  try {
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }
    role.name = req.body.name;
    role.access = req.body.access;
    await role.save();
    const newRole = {
      name: role.name,
      access: role.access,
    };
    return res
      .status(200)
      .json(new ApiResponse(200, newRole, 'Role updated Successfully'));
  } catch (error) {
    throw new ApiError(500, error, 'Something went wrong while updating role');
  }
});

const getRoleById = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const role = await Role.findById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, role, 'Role fetched Successfully'));
});

const deleteRole = AsyncHandler(async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  await Role.findByIdAndDelete(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Role deleted Successfully'));
});

export {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  ManageDetails,
  getAllowedSettingsById,
  chageAccess,
  getDefaultValue,
  getroles,
  getkeysRoles,
  createRole,
  getkeyroles,
  updateRole,
  getRoleById,
  deleteRole,
};
