import { Router } from "express";
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
} from "../Controllers/user.controller.js";
import {
  accessAllowed,
  authenticate,
  Authorized,
} from "../Middlewares/AuthorizeMiddleware.js";
import { isDefault, roles } from "../Middlewares/accessMidleware.js";
import { isAuth } from "../Middlewares/authMiddleware.js";
const router = Router();

router
  .route("/login")
  .post(loginUser)
  .get(authenticate, isDefault, isAuth, (req, res) => {
    res.json({
      message: "Login Status fetched Successfully",
      user: req.user,
      permission: req.permission,
      isDefault: req.isDefault[0].is_default,
    });
  });
router
  .route("/createUser")
  .post(roles, authenticate, Authorized, isAuth, createUser);
router.route("/:id").put(roles, authenticate, updateUser);
router.route("/:id").delete(authenticate, isAuth, deleteUser);
router.route("/:id").get(authenticate, getUserById);
router.route("/detail/role").get(authenticate, isAuth, ManageDetails);
router.route("/logout").post(authenticate, logoutUser);
router.route("/").get(authenticate, isAuth, isDefault, getAllUsers);
router
  .route("/role/defaultvalue")
  .get(authenticate, isAuth, isDefault, getDefaultValue);
router
  .route("/settings/fetch/:id")
  .get(getAllowedSettingsById)
  .put(chageAccess);
export default router;
