import { Router } from 'express';
import { createEmployeeSalary } from '../Controllers/Employee.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';
const router = Router();

router.route('/getDetail').post(authenticate, createEmployeeSalary);

export default router;
