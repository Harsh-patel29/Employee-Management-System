import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../Controllers/user.controller.js";
import {
  authenticate,
  Authorized,
} from "../Middlewares/AuthorizeMiddleware.js";
import { roles } from "../Middlewares/accessMidleware.js";
const router = Router();

router.route("/login").post(loginUser).get(authenticate, Authorized, roles);
router.route("/createUser").post(authenticate, Authorized, roles, createUser);
router.route("/logout").post(authenticate, logoutUser);

export default router;
