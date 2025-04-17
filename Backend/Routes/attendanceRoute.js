import { Router } from 'express';
import { upload } from '../Middlewares/multer.Middleware.js';
import {
  uploadAttendance,
  getAttendance,
} from '../Controllers/Attendance.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
import multer from 'multer';

const router = Router();

const UploadText = multer();

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

router.route('/attendanceDetail').get(authenticate, getAttendance);

export default router;
