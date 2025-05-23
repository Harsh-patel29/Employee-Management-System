import { Router } from 'express';
import { upload } from '../Middlewares/multer.Middleware.js';
import {
  uploadAttendance,
  getAttendance,
  AddRegularization,
  getRegularization,
  ApproveRegularization,
  getLogHours,
  RejectRegularization,
  getRegularizationbyDateandUser,
  fetchMonthlyReport,
} from '../Controllers/Attendance.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
import { isAuth } from '../Middlewares/authMiddleware.js';
import { chechkRole } from '../Middlewares/checkroleMiidleware.js';

const router = Router();

router
  .route('/attendance')
  .post(
    upload.fields([
      {
        name: 'attendance',
        maxCount: 1,
      },
    ]),
    authenticate,
    uploadAttendance
  )
  .get(authenticate, (req, res) => {
    res.json({
      message: 'User Data fetched Successfully',
      user: req.user,
    });
  });

router.route('/attendanceDetail').get(authenticate, isAuth, getAttendance);
router.route('/regularization').post(authenticate, AddRegularization);
router
  .route('/getRegularization')
  .get(authenticate, chechkRole, getRegularization);
router
  .route('/getApprovedRegularization')
  .post(authenticate, ApproveRegularization);
router.route('/RejectRegularization').post(authenticate, RejectRegularization);
router
  .route('/getRegularizaitonDetail')
  .post(authenticate, getRegularizationbyDateandUser);
router
  .route('/getMonthlyReportDetails')
  .post(authenticate, chechkRole, fetchMonthlyReport);
export default router;
