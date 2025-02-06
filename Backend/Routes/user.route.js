import { Router } from "express";
import { loginUser, signUp } from "../Controllers/user.controller.js";
const router = Router();

router.route("/").post(signUp);
router.post("/auth", loginUser);

export default router;
