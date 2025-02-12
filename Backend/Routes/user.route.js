import { Router } from "express";
import { createUser } from "../Controllers/user.controller.js";
import { isAccessed, roles } from "../Middlewares/accessMidleware.js";
const router = Router();

router.route("/createUser").post(isAccessed, roles, createUser);

export default router;
