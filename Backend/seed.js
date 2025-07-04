import { Role } from './Models/Role.model.js';
import { UserAccess } from './Models/Role_Access.js';
import { connectDB } from './DB/index.js';
import { AsyncHandler } from './Utils/AsyncHandler.js';
import { ApiError } from './Utils/ApiError.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from './Models/user.model.js';
import { Project_Roles } from './Models/projectRoles.js';
import { keysSchema } from './Models/Roles_keys.js';
import { Attendance } from './Models/attendance.js';
import { employeeSalary } from './Models/employeeSalary.model.js';
import { Salary } from './Models/salary.model.js';
dotenv.config({
  path: '../.env',
});

const seedData = async () => {
  const id = new mongoose.Types.ObjectId('67ee522c3a81d4b972d1ff5a');
  const dateToDelete = new Date('2025-05-13');

  const startOfDay = new Date(
    Date.UTC(
      dateToDelete.getUTCFullYear(),
      dateToDelete.getUTCMonth(),
      dateToDelete.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );

  const endOfDay = new Date(
    Date.UTC(
      dateToDelete.getUTCFullYear(),
      dateToDelete.getUTCMonth(),
      dateToDelete.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
  try {
    const salaries = await Salary.find({});

    for (let salary of salaries) {
      console.log(salary.Effective_Date);
      if (typeof salary.Effective_Date === 'string') {
        salary.Effective_Date = new Date(salary.Effective_Date);
        await salary.save();
      }
    }

    // const AdminRole = await employeeSalary.deleteMany({});
    // // const manageUser = await UserAccess.deleteOne({
    // //   manageUser: 0,
    // //   manageUserAccess: 0,
    // //   role: AdminRole._id,
    // // });
    // // AdminRole.permission = [manageUser._id];
    // // await AdminRole.save();
    // console.log(`${AdminRole.deletedCount} records deleted.`);
    // console.log('Seeding dones', salaries);
  } catch (error) {
    throw new ApiError(500, 'Seeding failed', error);
  }
};

connectDB()
  .then(seedData())
  .catch((err) => console.log(err));
