import { Router } from "express";
import { createLeave ,getAllLeave,deleteLeave,updateLeave,getLeaveById,createnewLeave,getCreatedLeave,updateCreatedLeave,getCreatedLeaveById,deleteCreatedLeave,approveLeave,rejectLeave} from "../Controllers/leave.controller.js";
import { authenticate } from "../Middlewares/AuthorizeMiddleware.js";

const router = Router()

router.route("/create-leave").post(authenticate,createLeave)
router.route("/get-all-leave").get(authenticate,getAllLeave)
router.route("/get-leave-by-id").post(authenticate,getLeaveById)
router.route("/update-leave").put(authenticate,updateLeave)
router.route("/delete-leave").delete(authenticate,deleteLeave)
router.route("/create-new-leave").post(authenticate,createnewLeave)
router.route("/get-created-leave").get(authenticate,getCreatedLeave)
router.route("/update-created-leave").put(authenticate,updateCreatedLeave)
router.route("/get-created-leave-by-id").post(authenticate,getCreatedLeaveById)
router.route("/delete-created-leave").delete(authenticate,deleteCreatedLeave)
router.route("/approve-leave").post(authenticate,approveLeave)
router.route("/reject-leave").post(authenticate,rejectLeave)
export default router;
