import { employeeSalary } from '../Models/employeeSalary.model.js';
import { Salary } from '../Models/salary.model.js';
import { Leave } from '../Models/leavemodel.js';
import { Holiday } from '../Models/holiday.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import { ApiError } from '../Utils/ApiError.js';
import { Attendance } from '../Models/attendance.js';
import { WeekOff } from '../Models/weekoff.model.js';
import { calculateTotalOffHours } from '../Controllers/Attendance.controller.js';
import mongoose from 'mongoose';

function TimeToMinutes(timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 60 + minutes + seconds / 60;
}

function calculateAttendance(
  userLogData,
  workingDay,
  holidayDays,
  leave,
  salary,
  salaryId
) {
  const userId = userLogData?.[0]?.User?.toString();

  const totalLeaveDays = leave.reduce((current, next) => current + next, 0);

  const attendance = {
    userId,
    salaryId,
    salary,
    presentDays: 0,
    absentDays: 0,
    halfDays: 0,
    WorkingDays: workingDay,
    holidayCount: holidayDays,
    LeaveCount: leave,
  };
  userLogData.forEach((item) => {
    const logMinutes = TimeToMinutes(item.LogHours);
    const isPresent = logMinutes >= 360;
    if (isPresent) attendance.presentDays++;
    const isHalfDay = logMinutes >= 240 && logMinutes <= 360;
    if (isHalfDay) attendance.halfDays++;
  });
  const actualWorkingDays = attendance.WorkingDays - attendance.holidayCount;
  attendance.absentDays =
    actualWorkingDays -
    attendance.presentDays -
    attendance.halfDays +
    totalLeaveDays;
  attendance.actualWorkingDays = actualWorkingDays;
  attendance.salary = salary;
  attendance.salaryId = salaryId;
  attendance.LeaveCount = totalLeaveDays;

  return attendance;
}

const getWeekOffsByMonthYear = async (userId, selectedMonth, selectedYear) => {
  const startOfNextMonth = new Date(selectedYear, selectedMonth, 1);

  const userWeekOff = await Salary.find({
    User: new mongoose.Types.ObjectId(userId),
    is_Deleted: false,
    Effective_Date: { $lte: startOfNextMonth },
  })
    .sort({ Effective_Date: -1 })
    .populate('WeekOff');

  return userWeekOff;
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

const cleanUpfunction = async () => {
  const seen = new Set();
  const toDelete = [];

  const existingSalaries = await employeeSalary
    .find({}, 'salaryId')
    .sort({ updatedAt: -1 });

  for (const entry of existingSalaries) {
    const idStr = entry.salaryId?.toString();

    if (seen.has(idStr)) {
      toDelete.push(entry._id);
    } else {
      seen.add(idStr);
    }
  }
  if (toDelete.length > 0) {
    await employeeSalary.deleteMany({ _id: { $in: toDelete } });
    console.log(
      `Deleted ${toDelete.length} older salary entries with duplicate salaryID`
    );
  } else {
    console.log('No duplicates found. All salaryIds are unique');
  }
};

const createEmployeeSalary = AsyncHandler(async (req, res) => {
  await cleanUpfunction();
  const salaryDetail = await Salary.find().populate('User', 'Name');

  const filteredSalaries = salaryDetail.filter((salary) => {
    return !salary.is_Deleted;
  });

  const existingSalaries = await employeeSalary
    .find({}, 'salaryId')
    .sort({ updatedAt: -1 });

  const validCombinations = filteredSalaries.map((salary) => salary._id);

  const entriesToDelete = existingSalaries.filter((entry) => {
    return !validCombinations.some(
      (valid) => valid?._id?.toString() === entry?.salaryId?.toString()
    );
  });

  if (entriesToDelete.length > 0) {
    const idsToDelete = entriesToDelete.map((entry) => entry._id);

    await employeeSalary.deleteMany({ _id: { $in: idsToDelete } });

    console.log(`Deleted ${idsToDelete.length} unmatched salary entries.`);
  } else {
    console.log('No unmatched salary entries found to delete.');
  }

  const upsertEmployeeSalaries = async (bulkInsertData) => {
    const operations = bulkInsertData.map((data) => ({
      updateOne: {
        filter: {
          UserId: data.UserId,
          month: data.month,
          year: data.year,
        },
        update: { $set: data },
        upsert: true,
      },
    }));

    const result = await employeeSalary.bulkWrite(operations);
    console.log('Salary inserted/updated:', result);
    return result;
  };

  const bulkInsertData = [];
  for (const salary of filteredSalaries) {
    const userID = salary.User._id;

    const earliestSalary = await Salary.findOne({
      User: userID,
      Effective_Date: { $gte: salary.Effective_Date },
      is_Deleted: false,
    }).sort({
      Effective_Date: 1,
    });

    if (!earliestSalary) {
      return [];
    }

    const startDate = new Date(earliestSalary.Effective_Date);
    const endDate = new Date();

    const monthYearPairs = [];
    const current = new Date(startDate);

    while (
      current.getFullYear() < endDate.getFullYear() ||
      (current.getFullYear() === endDate.getFullYear() &&
        current.getMonth() <= endDate.getMonth())
    ) {
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const year = String(current.getFullYear());
      monthYearPairs.push({ month, year });

      current.setMonth(current.getMonth() + 1);
    }

    for (const { month, year } of monthYearPairs) {
      const datePrefix = `${year}-${month}`;

      const salaryEntry = await Salary.findOne({
        User: userID,
        Effective_Date: { $regex: `^${datePrefix}` },
        is_Deleted: false,
      });

      let Salarys;
      if (salaryEntry === null) {
        Salarys = await Salary.findOne({
          User: userID,
          Effective_Date: { $lt: datePrefix + '-01' },
          is_Deleted: false,
        })
          .sort({ Effective_Date: -1 })
          .limit(1);

        if (!Salarys) {
          console.log('No salary entry found for user');
        }
      } else {
        Salarys = salaryEntry;
      }

      const weekOff = await getWeekOffsByMonthYear(userID, month, year);

      const existingSalary = await employeeSalary.findOne({
        UserId: userID,
        month: month,
        year: year,
      });

      const weekOffData = weekOff[0];

      if (!weekOffData) continue;

      const TypeofWeek = weekOffData?.WeekOff?.days?.map(
        (item) => `${item.day} - ${item.type} - ${item.weeks}`
      );

      const holiday = await Holiday.find({
        Start_Date: { $regex: `^${datePrefix}` },
      });

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
            getDayNameFromNumber(new Date(holiday.EndDay).getDay()) ===
              dayName &&
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

      const lastCalculated = new Date(existingSalary?.updatedAt);
      const lastSalaryUpdate = new Date(salary?.updatedAt);

      const startOfMonth = new Date(`${year}-${month}-01T00:00:00.000Z`);
      const endOfMonth = new Date(year, parseInt(month), 1);

      const shouldRecalculate = lastCalculated < lastSalaryUpdate;

      const latestHoliday = await Holiday.findOne({
        Start_Date: {
          $regex: `^${year}-${month}`,
        },
      }).sort({ updatedAt: -1 });

      const latestLeave = await Leave.findOne({
        Start_Date: {
          $regex: `^${year}-${month}`,
        },
      }).sort({ updatedAt: -1 });

      const latestAttendance = await Attendance.findOne({
        AttendAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      }).sort({
        updatedAt: -1,
      });

      const weekOffUpdatedAt = weekOffData?.WeekOff?.updatedAt;
      let shouldUpsert = false;

      if (existingSalary === null) {
        shouldUpsert = true;
      } else {
        const lastSalaryUpdate = new Date(existingSalary.updatedAt);
        const latestHolidayUpdate = latestHoliday
          ? new Date(latestHoliday?.updatedAt)
          : null;
        const latestLeaveUpdate = latestLeave
          ? new Date(latestLeave?.updatedAt)
          : null;
        const latestAttendanceUpdate = latestAttendance
          ? new Date(latestAttendance?.updatedAt)
          : null;
        const latestWeekOffUpdate = weekOffUpdatedAt
          ? new Date(weekOffUpdatedAt)
          : null;

        if (
          (latestHolidayUpdate && latestHolidayUpdate > lastSalaryUpdate) ||
          (latestWeekOffUpdate && latestWeekOffUpdate > lastSalaryUpdate) ||
          (latestLeaveUpdate && latestLeaveUpdate > lastSalaryUpdate) ||
          (latestAttendanceUpdate &&
            latestAttendanceUpdate > lastSalaryUpdate) ||
          existingSalary.holidayDays !== String(totalHolidayDays) ||
          shouldRecalculate
        ) {
          shouldUpsert = true;
        }
      }

      try {
        if (shouldUpsert) {
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
                '_id.month': month,
                '_id.year': year,
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
              Leave: item.LogHours.result,
            };
          });

          const leave = logvalue?.flatMap((leave) => leave.Leave);
          const filterLeave = leave.filter(
            (item) => item.Status === 'Approved'
          );
          const uniqueLeave = Array.from(
            new Map(filterLeave.map((l) => [l._id.toString(), l])).values()
          );

          const OfficalHours = calculateTotalOffHours(
            TypeofWeek,
            parseInt(month, 10),
            year,
            totalHolidayDays
          );

          const [hours] = OfficalHours.split(':');
          const WorkingDays = Math.round(hours / 8);

          const userLogData = logvalue.filter(
            (log) => log.User === userID.toString()
          );

          const userTotalLeaveDays = uniqueLeave
            .filter(
              (leave) =>
                leave.userName === salary.User.Name &&
                leave.Start_Date.split('-')[1] === month &&
                leave.Start_Date.split('-')[0] === year
            )
            .map((val) => val.Days);
          const attendanceStats = calculateAttendance(
            userLogData,
            WorkingDays,
            totalHolidayDays,
            userTotalLeaveDays,
            Salarys?.Salary,
            salaryEntry?._id
          );

          const userStats = Array(attendanceStats).find(
            (stat) =>
              stat.userId === userID.toString() || stat.userId === undefined
          );

          if (!userStats) continue;

          const monthlySalary = Number(userStats.salary || 0);
          const actualWorkingDays = Number(userStats.actualWorkingDays || 0);
          const leaveDays = userStats.LeaveCount;
          const presentDays = Number(userStats.presentDays || 0);
          const halfDays = Number(userStats.halfDays || 0);
          const perDaySalary =
            actualWorkingDays > 0
              ? Math.round(monthlySalary / actualWorkingDays)
              : 0;
          const calculatedSalary =
            perDaySalary * presentDays + halfDays * perDaySalary * 0.5;

          bulkInsertData.push({
            UserId: new mongoose.Types.ObjectId(userID),
            salaryId: userStats.salaryId,
            Salary: String(monthlySalary),
            month: month,
            year: year,
            totaldays: String(userStats.WorkingDays) || '0',
            presentDays: String(presentDays) || '0',
            halfDays: String(halfDays) || '0',
            absentDays: String(userStats.absentDays) || '0',
            leaveDays: String(leaveDays),
            holidayDays: String(userStats.holidayCount) || totalHolidayDays,
            actualWorkingDays: String(actualWorkingDays),
            calculatedSalary: String(Math.round(calculatedSalary)),
            LastCalculateddAt: new Date(),
          });
        } else {
          console.log('No calculation needed');
        }
      } catch (error) {
        console.error('Upsert Error:', error);
        throw error;
      }
    }
    if (bulkInsertData.length > 0) {
      await upsertEmployeeSalaries(bulkInsertData);
    } else {
      console.log('No salary data calculated, skipping upsert.');
    }
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, bulkInsertData, 'Salaries data summarize and saved')
    );
});

const getemployeeSalary = AsyncHandler(async (req, res) => {
  const data = await employeeSalary
    .find()
    .populate('UserId', 'Name')
    .populate('salaryId', 'Salary')
    .sort({ month: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Employee Salary Fetched'));
});

export { createEmployeeSalary, getemployeeSalary };
