import { User } from '../Models/user.model.js';
import { Project_Roles } from '../Models/projectRoles.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';

const userid = AsyncHandler(async (req, res, next) => {
  const user = await User.aggregate([
    {
      $match: {
        Name: req.body.user,
      },
    },
    {
      $project: {
        _id: '$_id',
      },
    },
  ]);
  req.idDetail = user[0];

  next();
});

const roleid = AsyncHandler(async (req, res, next) => {
  const role = await Project_Roles.aggregate([
    {
      $match: {
        name: req.body.role,
      },
    },
    {
      $project: {
        _id: '$_id',
      },
    },
  ]);
  req.roleid = role[0];
  next();
});

export { userid, roleid };
