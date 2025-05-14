import { Router } from 'express';
import {
  sendOtp,
  verifyOtp,
  resetPassword,
  resendOtp,
} from '../Controllers/Otp.controller.js';

const router = Router();

router.route('/generateOtp').post(sendOtp);
router.route('/verifyOtp').post(verifyOtp);
router.route('/resendOtp').post(resendOtp);
router.route('/resetPassword').post(resetPassword);

export default router;
