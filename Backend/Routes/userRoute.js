import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../Controllers/user.controller.js";
import {
  authenticate,
  Authorized,
} from "../Middlewares/AuthorizeMiddleware.js";
import { roles } from "../Middlewares/accessMidleware.js";
const router = Router();

router
  .route("/login")
  .post(loginUser)
  .get(authenticate, (req, res) => {
    res.json({ message: "Login Status fetched Successfully", user: req.user });
  });
router.route("/createUser").post(roles, authenticate, Authorized, createUser);
router.route("/updateUser").put(authenticate, Authorized, roles, updateUser);
router.route("/:id").delete(authenticate, Authorized, deleteUser);
router.route("/logout").post(authenticate, logoutUser);
router.route("/").get(authenticate, Authorized, getAllUsers);

export default router;
