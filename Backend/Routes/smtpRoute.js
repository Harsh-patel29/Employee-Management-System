import { Router } from 'express';
import {
  createSMTP,
  updateSMTP,
  getSMTPDetail,
  AttendanceSetting,
} from '../Controllers/Smtp.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
const router = Router();

router.route('/createSMTP').post(authenticate, createSMTP);
router.route('/updateSMTP').put(authenticate, updateSMTP);
router.route('/getSMTP').get(authenticate, getSMTPDetail);
router.route('/updateAttendanceSettings').post(authenticate, AttendanceSetting);

export default router;
