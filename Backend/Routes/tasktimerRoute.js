import {Router} from "express"
import {createTaskTimer,updateTaskTimer,getTaskTimer,getTaskByUser,getAllTaskTimer,deleteTaskTimer} from "../Controllers/taskTimer.controller.js"
import {authenticate} from "../Middlewares/AuthorizeMiddleware.js"

const router = Router()

router.post("/create",authenticate,createTaskTimer)
router.post("/update",authenticate,updateTaskTimer)
router.post("/get",authenticate,getTaskTimer)
router.post("/gettaskbyuser",authenticate,getTaskByUser)
router.get("/getalltasktimer",authenticate,getAllTaskTimer)
router.delete("/delete",authenticate,deleteTaskTimer)
export default router

