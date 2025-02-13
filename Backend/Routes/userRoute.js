import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
} from "../Controllers/user.controller.js";
import {
  authenticate,
  Authorized,
} from "../Middlewares/AuthorizeMiddleware.js";
import { roles } from "../Middlewares/accessMidleware.js";
const router = Router();

router.route("/login").post(loginUser).get(authenticate, Authorized, roles);
router.route("/createUser").post(authenticate, Authorized, roles, createUser);
router.route("/updateUser").put(authenticate, Authorized, roles, updateUser);
router.route("/:id").delete(authenticate, Authorized, deleteUser);
router.route("/logout").post(authenticate, logoutUser);

export default router;
