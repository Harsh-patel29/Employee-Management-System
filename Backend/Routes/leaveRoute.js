import { Router } from "express";
import { createLeave ,getAllLeave,deleteLeave,updateLeave,getLeaveById,createnewLeave} from "../Controllers/leave.controller.js";
import { authenticate } from "../Middlewares/AuthorizeMiddleware.js";

const router = Router()

router.route("/create-leave").post(authenticate,createLeave)
router.route("/get-all-leave").get(authenticate,getAllLeave)
router.route("/get-leave-by-id").post(authenticate,getLeaveById)
router.route("/update-leave").put(authenticate,updateLeave)
router.route("/delete-leave").delete(authenticate,deleteLeave)
router.route("/create-new-leave").post(authenticate,createnewLeave)

export default router;
