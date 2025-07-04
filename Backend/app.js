import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});
const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.static('public'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: 'POST,GET,PUT,DELETE,PATCH',
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import userRoute from './Routes/userRoute.js';
import attendanceRoute from './Routes/attendanceRoute.js';
import projectRoute from './Routes/projectRoute.js';
import taskRoute from './Routes/taskRoute.js';
import leaveRoute from './Routes/leaveRoute.js';
import tasktimerRoute from './Routes/tasktimerRoute.js';
import holidayRoute from './Routes/holidayRoute.js';
import weekoffRoute from './Routes/weekoffRoute.js';
import smtpRoute from './Routes/smtpRoute.js';
import otpRoute from './Routes/otpRoute.js';
import salaryRoute from './Routes/salaryRoute.js';
import employeeSalaryRoute from './Routes/employeeSalaryRoute.js';

app.use('/api/v1/user', userRoute);
app.use('/api/v2/attendance', attendanceRoute);
app.use('/api/v3/project', projectRoute);
app.use('/api/v4/tasks', taskRoute);
app.use('/api/v5/leave', leaveRoute);
app.use('/api/v6/tasktimer', tasktimerRoute);
app.use('/api/v7/holiday', holidayRoute);
app.use('/api/v8/weekoff', weekoffRoute);
app.use('/api/v9/smtp', smtpRoute);
app.use('/api/v10/otp', otpRoute);
app.use('/api/v11/salary', salaryRoute);
app.use('/api/v12/employeesalary', employeeSalaryRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.log(err.message);
  res.status(statusCode).json({ message });
});
export { app };
