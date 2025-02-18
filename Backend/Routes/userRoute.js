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
} from "../Controllers/user.controller.js";
import {
  authenticate,
  Authorized,
} from "../Middlewares/AuthorizeMiddleware.js";
import { roles } from "../Middlewares/accessMidleware.js";
import { isAuth } from "../Middlewares/authMiddleware.js";
const router = Router();

router
  .route("/login")
  .post(loginUser)
  .get(authenticate, (req, res) => {
    res.json({ message: "Login Status fetched Successfully", user: req.user });
  });
router.route("/createUser").post(roles, authenticate, Authorized, createUser);
router.route("/:id").put(roles, authenticate, updateUser);
router.route("/:id").delete(authenticate, deleteUser);
router.route("/:id").get(authenticate, getUserById);
router.route("/detail/role").get(authenticate, isAuth, ManageDetails);
router.route("/logout").post(authenticate, logoutUser);
router.route("/").get(authenticate, isAuth, getAllUsers);
export default router;
