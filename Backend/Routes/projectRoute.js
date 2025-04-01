import { Router } from "express";
import { upload } from "../Middlewares/multer.Middleware.js";
import {
  AssignUser,
  createProject,
  deleteAssignedUser,
  deleteProject,
  getAllProject,
  getAssignUserName,
  getProjectbyId,
  getProjectRoles,
  logoUpload,
  updateProject,
} from "../Controllers/Project.controller.js";
import { authenticate } from "../Middlewares/AuthorizeMiddleware.js";
import { roleid, userid } from "../Middlewares/userroleMiddleware.js";
import { uploadlogo } from "../Middlewares/uploadlogoMiddleware.js";
const router = Router();

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
router.route("/upload-logo").post(
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
  ]),
  uploadlogo,
  logoUpload
);
router.route("/project/:id").get(authenticate, getProjectbyId);
router.route("/project/roles/details").get(authenticate, getProjectRoles);
router.route("/projects/delete/:id").delete(authenticate, deleteProject);
router
  .route("/projects/update/:id")
  .put(
    upload.fields([{ name: "logo", maxCount: 1 }]),
    authenticate,
    updateProject
  );
router
  .route("/project/roles/update/:id")
  .patch(authenticate, userid, roleid, AssignUser);
router
  .route("/project/roles/details/name/:id")
  .get(authenticate, getAssignUserName);
router
  .route("/project/roles/details/name/delete/role/:id/:userid/:roleid")
  .delete(authenticate, deleteAssignedUser);

export default router;
