import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../feature/ToggleMode/ToggleModeSlice';
import ToggleSideBarSliceReducer from '../feature/ToggelSideBar/ToggleSideBarSlice';
import authSliceReducer from '../feature/datafetch/datafetchSlice.js';
import userSliceReducer from '../feature/datafetch/userfetchSlice.js';
import detailSliceReducer from '../feature/datafetch/detailfetchSlice.js';
import ChangeDetailSliceReducer from '../feature/datafetch/ChangeFetch.js';
import markattendanceSliceReducer from '../feature/attendancefetch/attendanceSlice.js';
import createProjectSliceReducer from '../feature/projectfetch/createproject.js';
import assignuserSliceReducer from '../feature/projectfetch/assignuser.js';
import createuserSliceReducer from '../feature/createuserfetch/createuserSlice.js';
import taskSliceReducer from '../feature/taskfetch/taskfetchSlice.js';
import roleSliceReducer from '../feature/rolesfetch/getrolesSlice.js';
import filterSliceReducer from '../feature/filterSlice/filterSlice.js';
import createleaveSliceReducer from '../feature/leavefetch/createleaveSlice.js';
import taskTimerSliceReducer from '../feature/tasktimerfetch/tasktimerslice.js';
import holidaySliceReducer from '../feature/hoildayfetch/hoildaySlice.js';
import weekOffSliceReducer from '../feature/weekofffetch/weekoffslice.js';
import smtpSliceReducer from '../feature/smtpfetch/smtpSlice.js';
import otpSliceReducer from '../feature/otpfetch/otpSlice.js';
import salarySliceReducer from '../feature/salaryfetch/addsalaryslice.js';
import employeeSalaryReducer from '../feature/employeeSalaryfetch/employeeSalarySlice.js';

export default configureStore({
  reducer: {
    theme: themeReducer,
    Sidebar: ToggleSideBarSliceReducer,
    auth: authSliceReducer,
    getuser: userSliceReducer,
    getDetail: detailSliceReducer,
    ChangeAccess: ChangeDetailSliceReducer,
    markAttendance: markattendanceSliceReducer,
    project: createProjectSliceReducer,
    assignusers: assignuserSliceReducer,
    createuser: createuserSliceReducer,
    task: taskSliceReducer,
    getrole: roleSliceReducer,
    filter: filterSliceReducer,
    leave: createleaveSliceReducer,
    tasktimer: taskTimerSliceReducer,
    holiday: holidaySliceReducer,
    weekoff: weekOffSliceReducer,
    smtpSlice: smtpSliceReducer,
    otpSlice: otpSliceReducer,
    salarySlice: salarySliceReducer,
    employeeSalary: employeeSalaryReducer,
  },
});
