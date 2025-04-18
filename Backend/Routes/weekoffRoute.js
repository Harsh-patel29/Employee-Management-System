import { Router } from 'express';
import {
  createWeekOff,
  getAllWeekoff,
  deleteWeekOff,
  getWeekOffById,
  updateWeekOff,
} from '../Controllers/weekoff.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
const router = Router();

router.post('/createWeekOff', authenticate, createWeekOff);
router.get('/getAllWeekOff', authenticate, getAllWeekoff);
router.delete('/deleteWeekOff', authenticate, deleteWeekOff);
router.post('/getweekOffById', authenticate, getWeekOffById);
router.put('/updateWeekOff', authenticate, updateWeekOff);
export default router;
