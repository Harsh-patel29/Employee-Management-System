import { Router } from 'express';
import {
  createEmployeeSalary,
  getemployeeSalary,
} from '../Controllers/Employee.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
const router = Router();

router.route('/updateEmpSalary').post(authenticate, createEmployeeSalary);
router.route('/getEmpSalary').get(authenticate, getemployeeSalary);

export default router;
