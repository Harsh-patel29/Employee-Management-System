import { Router } from "express";
import { upload } from "../Middlewares/multer.Middleware.js";
import {
  createProject,
  getAllProject,
} from "../Controllers/Project.controller.js";
import { authenticate } from "../Middlewares/AuthorizeMiddleware.js";
import multer from "multer";

const router = Router();
const UploadText = multer();

router
  .route("/project")
  .post(
    upload.fields([
      {
        name: "logo",
        maxCount: 1,
      },
    ]),
    authenticate,
    createProject
  )
  .get(authenticate, getAllProject, (req, res) => {
    res.json({
      message: "User data fetched Successfully",
      user: req.user,
    });
  });

export default router;
