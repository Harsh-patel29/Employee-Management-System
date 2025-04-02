import { Router } from "express";
import { createTask, getAlltasks } from "../Controllers/task.controller.js";
import { authenticate } from "../Middlewares/AuthorizeMiddleware.js";
import { upload } from "../Middlewares/multer.Middleware.js";

const router = Router();

router.route("/createtask").post(
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  authenticate,
  createTask
);
router.route("/gettask").get(authenticate, getAlltasks);

export default router;
