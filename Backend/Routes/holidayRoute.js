import { Router } from 'express';
import {
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getHoliday,
  getHolidayById,
} from '../Controllers/Holiday.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
const router = Router();

router.post('/create-holiday', authenticate, createHoliday);
router.put('/update-holiday', authenticate, updateHoliday);
router.delete('/delete-holiday', authenticate, deleteHoliday);
router.get('/get-holiday', authenticate, getHoliday);
router.post('/get-holiday-by-id', authenticate, getHolidayById);

export default router;
