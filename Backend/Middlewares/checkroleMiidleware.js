import { User } from '../Models/user.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiError } from '../Utils/ApiError.js';

const chechkRole = AsyncHandler(async (req, res, next) => {
  const role = req.user.role;
  if (!role || role !== 'Admin') {
    throw new ApiError(403, 'Access Denied');
  }
  next();
});

export { chechkRole };
