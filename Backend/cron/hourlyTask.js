import cron from 'node-cron';
import { updateAttendanceWithCutoff } from '../Controllers/Attendance.controller.js';
cron.schedule('0 * * * * ', async () => {
  console.log('Running hourly attendance cutoff check');
  await updateAttendanceWithCutoff();
});
