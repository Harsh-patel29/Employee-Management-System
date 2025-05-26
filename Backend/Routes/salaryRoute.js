import { Router } from 'express';
import {
  generateSalary,
  getSalaryDetail,
  updateSalary,
  getSalarybyId,
  deleteSalaryDetail,
} from '../Controllers/Salary.controller.js';
import { authenticate } from '../Middlewares/AuthorizeMiddleware.js';

const router = Router();

router.route('/addsalary').post(authenticate, generateSalary);
router.route('/getsalary').get(authenticate, getSalaryDetail);
router.route('/updatesalary').put(authenticate, updateSalary);
router.route('/getsalarybyId').post(authenticate, getSalarybyId);
router.route('/deletesalary').post(authenticate, deleteSalaryDetail);

export default router;
