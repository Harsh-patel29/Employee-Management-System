import { Router } from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  ManageDetails,
  chageAccess,
  getAllowedSettingsById,
  getDefaultValue,
  getroles,
  createRole,
  getkeyroles,
  updateRole,
  getRoleById,
  deleteRole,
} from '../Controllers/user.controller.js';
import {
  authenticate,
  Authorized,
} from '../Middlewares/AuthorizeMiddleware.js';
import { isDefault, roles } from '../Middlewares/accessMidleware.js';
import { isAuth } from '../Middlewares/authMiddleware.js';
const router = Router();

router
  .route('/login')
  .post(loginUser)
  .get(authenticate, isDefault, isAuth, (req, res) => {
    res.json({
      message: 'Login Status fetched Successfully',
      user: req.user,
      permission: req.permission,
      isDefault: req.isDefault[0].is_default,
    });
  });
router
  .route('/createUser')
  .post(roles, authenticate, Authorized, isAuth, createUser);
router.route('/:id').put(roles, authenticate, updateUser);
router.route('/:id').delete(authenticate, isAuth, deleteUser);
router.route('/:id').get(authenticate, getUserById);
router.route('/detail/role').get(authenticate, isAuth, ManageDetails);
router.route('/logout').post(authenticate, logoutUser);
router.route('/').get(authenticate, isAuth, isDefault, getAllUsers);
router
  .route('/role/defaultvalue')
  .get(authenticate, isAuth, isDefault, getDefaultValue);
router
  .route('/settings/fetch/:id')
  .get(getAllowedSettingsById)
  .put(chageAccess);
router.route('/roles/all').get(authenticate, getroles);
router.route('/keys/all').get(authenticate, getroles);
router.route('/create/role').post(authenticate, createRole);
router.route('/get/keyroles').get(authenticate, getkeyroles);
router.route('/update/keyroles/:id').patch(authenticate, updateRole);
router.route('/get/role/:id').get(authenticate, getRoleById);
router.route('/delete/role/:id').delete(authenticate, deleteRole);
export default router;
