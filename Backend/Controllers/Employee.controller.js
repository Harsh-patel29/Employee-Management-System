import { employeeSalary } from '../Models/employeeSalary.model.js';
import { Salary } from '../Models/salary.model.js';
import { WeekOff } from '../Models/weekoff.model.js';
import { Holiday } from '../Models/holiday.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { ApiError } from '../Utils/ApiError.js';
import { Attendance } from '../Models/attendance.js';
import { calculateTotalOffHours } from '../Controllers/Attendance.controller.js';
import mongoose from 'mongoose';

function TimeToMinutes(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 60 + minutes + seconds / 60;
}

function calculateAttendance(userLogData, workingDay, holidayDays, userSalary) {
  const userId = userLogData?.[0]?.User.toString();

  const attendance = {
    userId,
    presentDays: 0,
    absentDays: 0,
    WorkingDays: workingDay,
    holidayCount: holidayDays,
  };
  userLogData.forEach((item) => {
    const logMinutes = TimeToMinutes(item.LogHours);
    const isPresent = logMinutes > 360;
    if (isPresent) attendance.presentDays++;
  });
  const actualWorkingDays = attendance.WorkingDays - attendance.holidayCount;
  attendance.absentDays = actualWorkingDays - attendance.presentDays;
  attendance.actualWorkingDays = actualWorkingDays;
  attendance.salary = userSalary;

  return attendance;
}

const getWeekOffsByMonthYear = async (userId, selectedMonth, selectedYear) => {
  const startOfNextMonth = new Date(Date.UTC(selectedYear, selectedMonth, 1));

  const userWeekOff = await Salary.find({
    User: userId,
    is_Deleted: false,
  })
    .sort({ Effective_Date: -1 })
    .populate('WeekOff');

  return userWeekOff;
};

const getAllDatesInMonth = (year, month) => {
  const dates = [];

  const date = new Date(Date.UTC(year, month - 1, 1));

  const targetMonth = month - 1;

  while (date.getUTCMonth() === targetMonth) {
    dates.push(date.toISOString().split('T')[0]);
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return dates;
};

function getDayNameFromNumber(number) {
  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  return days[number];
}

function getWeekOfMonth(date = new Date()) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const offset = (dayOfWeek + 6) % 7;

  const adjustedDate = date.getDate() + offset;
  const weekNumber = Math.ceil(adjustedDate / 7);

  return weekNumber;
}

function convertnumbertoWeek(number) {
  switch (number) {
    case 1:
      return 'First Week';
    case 2:
      return 'Second Week';
    case 3:
      return 'Third Week';
    case 4:
      return 'Fourth Week';
    case 5:
      return 'Fifth Week';
  }
}

const createEmployeeSalary = AsyncHandler(async (req, res) => {
  const { selectedMonth, selectedYear } = req.body;

  const salaryDetail = await Salary.find({});

  const salaryDetailByUser = Object.groupBy(
    salaryDetail,
    (detail) => detail.User
  );
  const formattedSalaryDetail = Object.values(salaryDetailByUser).filter(
    (item) => item[0].is_Deleted === false
  );
  const UserId = formattedSalaryDetail.map((item) => item[0].User);

  const AttendanceData = await Attendance.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'User',
        foreignField: '_id',
        as: 'userData',
      },
    },
    {
      $unwind: '$userData',
    },
    {
      $lookup: {
        from: 'leaves',
        localField: 'userData.Name',
        foreignField: 'userName',
        as: 'result',
      },
    },
    {
      $addFields: {
        attendMonthOnly: {
          $dateToString: {
            format: '%m',
            date: '$AttendAt',
            timezone: 'Asia/Kolkata',
          },
        },
        attendDateOnly: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$AttendAt',
            timezone: 'Asia/Kolkata',
          },
        },
        attendYearOnly: {
          $dateToString: {
            format: '%Y',
            date: '$AttendAt',
            timezone: 'Asia/Kolkata',
          },
        },
      },
    },
    {
      $group: {
        _id: {
          month: '$attendMonthOnly',
          date: '$attendDateOnly',
          year: '$attendYearOnly',
          UserName: '$userData.Name',
        },
        logHours: {
          $push: '$$ROOT',
        },
      },
    },
    {
      $sort: {
        '_id.UserName': 1,
        '_id.date': 1,
      },
    },
    {
      $group: {
        _id: {
          month: '$_id.month',
          year: '$_id.year',
          UserName: '$_id.UserName',
        },
        dates: {
          $push: {
            date: '$_id.date',
            logHours: '$logHours',
          },
        },
      },
    },
    {
      $match: {
        '_id.month': '04',
        '_id.year': '2025',
      },
    },
    {
      $project: {
        _id: 1,
        dates: {
          $map: {
            input: '$dates',
            as: 'd',
            in: {
              date: '$$d.date',
              LogHours: {
                $arrayElemAt: [
                  '$$d.logHours',
                  {
                    $subtract: [
                      {
                        $size: '$$d.logHours',
                      },
                      1,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    },
    {
      $unwind: '$dates',
    },
  ]);

  const attendanceDate = AttendanceData.map((item) => item.dates);
  const logvalue = attendanceDate.map((item) => {
    return {
      User: item.LogHours.User.toString(),
      LogHours: item.LogHours.LogHours,
    };
  });

  const bulkInsertData = [];
  for (const userID of UserId) {
    const weekOff = await getWeekOffsByMonthYear(userID, 5, 2025);
    const weekOffData = weekOff[0];
    if (!weekOffData) continue;

    const month = new Date(weekOffData?.WeekOff?.Effective_Date).getMonth() + 1;
    const year = new Date(weekOffData?.WeekOff?.Effective_Date).getFullYear();

    const TypeofWeek = weekOffData?.WeekOff?.days?.map(
      (item) => `${item.day} - ${item.type} - ${item.weeks}`
    );
    // console.log(TypeofWeek);

    const holiday = await Holiday.find({});
    const holidayDay = holiday.map((item) => {
      return {
        StartDay: new Date(item.Start_Date),
        EndDay: new Date(item.End_Date),
      };
    });
    const isHolidayinWeekOff = TypeofWeek.filter((item) => {
      const [dayName, type, week] = item.split(' - ');

      const weeksArray = week.split(',');

      return holidayDay.some((holiday) => {
        const date = new Date(holiday.StartDay);
        const weekNumber = getWeekOfMonth(date);
        const weekString = convertnumbertoWeek(weekNumber);

        return (
          getDayNameFromNumber(new Date(holiday.StartDay).getDay()) ===
            dayName &&
          getDayNameFromNumber(new Date(holiday.EndDay).getDay()) === dayName &&
          type === 'WeekOff' &&
          weeksArray.includes(weekString)
        );
      });
    });

    const holidayDays = holiday.map((item) =>
      Math.abs(new Date(item.End_Date) - new Date(item.Start_Date))
    );

    const formattedDays = holidayDays.map((item) =>
      Math.ceil(item / (1000 * 60 * 60 * 24) + 1)
    );
    let totalHolidayDays;
    if (isHolidayinWeekOff.length > 0) {
      const filteredHolidays = holiday.filter((holiday) => {
        const date = new Date(holiday.Start_Date);
        const weekNumber = getWeekOfMonth(date);

        const weekString = convertnumbertoWeek(weekNumber);

        return !TypeofWeek.some((item) => {
          const [dayName, type, week] = item.split(' - ');
          const weeksArray = week.split(',').map((w) => w.trim());

          return (
            getDayNameFromNumber(new Date(holiday.Start_Date).getDay()) ===
              dayName &&
            getDayNameFromNumber(new Date(holiday.End_Date).getDay()) ===
              dayName &&
            type === 'WeekOff' &&
            weeksArray.includes(weekString)
          );
        });
      });

      // Recalculate formattedDays for only the filtered holidays
      const filteredHolidayDays = filteredHolidays.map((item) =>
        Math.abs(new Date(item.End_Date) - new Date(item.Start_Date))
      );

      const filteredFormattedDays = filteredHolidayDays.map((item) =>
        Math.ceil(item / (1000 * 60 * 60 * 24) + 1)
      );

      totalHolidayDays = filteredFormattedDays.reduce(
        (sum, val) => sum + val,
        0
      );
    } else {
      totalHolidayDays = formattedDays.reduce((sum, val) => sum + val, 0);
    }

    const OfficalHours = calculateTotalOffHours(
      TypeofWeek,
      month,
      year,
      totalHolidayDays
    );

    const [hours] = OfficalHours.split(':');
    const WorkingDays = Math.round(hours / 8);

    const userLogData = logvalue.filter(
      (log) => log.User === userID.toString()
    );

    const userSalary = formattedSalaryDetail.filter(
      (salary) => salary[0].User === userID
    );

    const attendanceStats = calculateAttendance(
      userLogData,
      WorkingDays,
      totalHolidayDays,
      userSalary
    );

    const userStats = Array(attendanceStats).find(
      (stat) => stat.userId === userID.toString()
    );
    console.log(userStats);

    if (!userStats) continue;
    const salaryObj = userStats.salary[0]?.[0];
    if (!salaryObj) continue;
    const monthlySalary = Number(salaryObj.Salary || 0);
    const actualWorkingDays = Number(userStats.actualWorkingDays || 0);
    const presentDays = Number(userStats.presentDays || 0);
    const perDaySalary =
      actualWorkingDays > 0 ? Math.round(monthlySalary / actualWorkingDays) : 0;
    const calculatedSalary = perDaySalary * presentDays;

    bulkInsertData.push({
      UserId: new mongoose.Types.ObjectId(userStats.userId),
      salaryId: salaryObj._id,
      month: '04',
      year: '2025',
      totaldays: String(userStats.WorkingDays),
      presentDays: String(presentDays),
      absentDays: String(userStats.absentDays),
      holidayDays: String(userStats.holidayCount),
      actualWorkingDays: String(actualWorkingDays),
      calculatedSalary: String(Math.round(calculatedSalary)),
    });

    const upsertEmployeeSalaries = async (bulkInsertData) => {
      const operations = bulkInsertData.map((data) => ({
        updateOne: {
          filter: { UserId: data.UserId, month: data.month, year: data.year },
          update: { $set: data },
          upsert: true,
        },
      }));

      try {
        const result = await employeeSalary.bulkWrite(operations);
        console.log('Upsert Result:', result);
        return result;
      } catch (error) {
        console.error('Upsert Error:', error);
        throw error;
      }
    };
    await upsertEmployeeSalaries(bulkInsertData);
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, bulkInsertData, 'Salaries datat summarize and saved')
    );
});

export { createEmployeeSalary };
