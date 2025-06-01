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

const getSalaryDataWithRanges = async () => {
  const Salaryrecords = await Salary.aggregate([
    {
      $match: {
        is_Deleted: false,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'User',
        foreignField: '_id',
        as: 'UserData',
      },
    },
    {
      $lookup: {
        from: 'weekoffs',
        localField: 'WeekOff',
        foreignField: '_id',
        as: 'WeekOffData',
      },
    },
    {
      $unwind: '$UserData',
    },
    {
      $unwind: '$WeekOffData',
    },
    {
      $sort: {
        User: 1,
        Effective_Date: 1,
      },
    },
    {
      $group: {
        _id: '$User',
        salaries: {
          $push: {
            _id: '$_id',
            Effective_Date: '$Effective_Date',
            Salary: '$Salary',
            WeekOff: '$WeekOff',
            WeekOffDays: '$WeekOffData.days',
            updatedAt: '$updatedAt',
          },
        },
        UserName: { $first: '$UserData.Name' },
        UserId: { $first: '$User' },
      },
    },
  ]);

  const earliestDate = await Salary.findOne(
    { is_Deleted: false },
    { Effective_Date: 1 }
  ).sort({ Effective_Date: 1 });

  if (!earliestDate) return [];

  const startDate = new Date(earliestDate.Effective_Date);
  const endDate = new Date();
  const monthYearPairs = [];
  const current = new Date(startDate);

  while (
    current.getFullYear() < endDate.getFullYear() ||
    (current.getFullYear() === endDate.getFullYear() &&
      current.getMonth() <= endDate.getMonth())
  ) {
    monthYearPairs.push({
      month: String(current.getMonth() + 1).padStart(2, '0'),
      year: String(current.getFullYear()),
      date: new Date(current),
    });
    current.setMonth(current.getMonth() + 1);
  }

  const result = [];

  Salaryrecords.forEach((userRecord) => {
    const { salaries, UserName, UserId } = userRecord;

    monthYearPairs.forEach((monthYear) => {
      const applicableSalary = salaries.reduce((latest, curr) => {
        const currDate = new Date(curr.Effective_Date);
        const latestDate = latest ? new Date(latest.Effective_Date) : null;

        return currDate <= monthYear.date && (!latest || currDate > latestDate)
          ? curr
          : latest;
      }, null);

      if (applicableSalary) {
        const typeOfWeek =
          applicableSalary.WeekOffDays?.map(
            (item) => `${item.day} - ${item.type} - ${item.weeks}`
          ) || [];

        result.push({
          _id: applicableSalary._id,
          UserId,
          UserName,
          month: monthYear.month,
          year: monthYear.year,
          Effective_Date: applicableSalary.Effective_Date,
          WeekOff: applicableSalary.WeekOff,
          WeekOffDays: typeOfWeek,
          Salary: applicableSalary.Salary,
          updatedAt: applicableSalary.updatedAt,
        });
      }
    });
  });

  return result;
};

const insertSalaryDataBulk = async (salaryCalculations) => {
  try {
    const data = salaryCalculations.map((item) => ({
      ...item,
      UserId: item.UserId,
      salaryId: item.salaryId,
      Salary: item.Salary,
      month: item.month,
      year: item.year,
      totaldays: item.totaldays,
      presentDays: item.presentDays,
      halfDays: item.halfDays,
      absentDays: item.absentDays,
      leaveDays: item.leaveDays,
      holidayDays: item.holidayDays,
      actualWorkingDays: item.actualWorkingDays,
      calculatedSalary: item.calculatedSalary,
    }));

    const result = await employeeSalary.insertMany(data, {
      ordered: false,
      lean: true,
    });
    console.log(`Successfully inserted ${result.length} records`);
    return result;
  } catch (error) {
    console.error('Bulk insert error:', error);
    throw new ApiError(500, 'Bulk Insert Error');
  }
};

const cleanUpfunction = async () => {
  const toDelete = [];
  const toDelete2 = [];
  const toDelete3 = [];
  const isSalaryActive = await Salary.find(
    { is_Deleted: false },
    { _id: 1, Effective_Date: -1, User: 1, Salary: 1 }
  ).lean();

  const existingSalaries = await employeeSalary
    .find({}, { salaryId: 1, month: -1, year: -1, UserId: 1, Salary: 1 })
    .lean()
    .sort({ LastCalculateddAt: -1 });

  const activeIds = new Set(
    isSalaryActive.map((entry) => entry._id.toString())
  );

  const datatobeDeleted = existingSalaries.filter(
    (item) => !activeIds.has(item.salaryId.toString())
  );

  const datatobeDeleted2 = existingSalaries.filter((item) => {
    return !isSalaryActive.some((entry) => {
      const [effYear, effMonth] = entry.Effective_Date.split('-');
      const itemYear = item.year;
      const itemMonth = item.month;

      const effYearNum = Number(effYear);
      const effMonthNum = Number(effMonth);
      const itemYearNum = Number(itemYear);
      const itemMonthNum = Number(itemMonth);

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const effValue = effYearNum * 100 + effMonthNum;
      const itemValue = itemYearNum * 100 + itemMonthNum;
      const currentValue = currentYear * 100 + currentMonth;
      const inRange = itemValue >= effValue && itemValue <= currentValue;
      return inRange;
    });
  });

  const activeSalaryIds = new Map(
    isSalaryActive.map((entry) => [entry._id.toString(), entry.User.toString()])
  );

  const datatobeDeleted3 = existingSalaries.filter((item) => {
    const activeId = activeSalaryIds.get(item.salaryId.toString());
    return !activeId || activeId !== item.UserId.toString();
  });

  toDelete.push(datatobeDeleted);
  toDelete2.push(datatobeDeleted2);
  toDelete3.push(datatobeDeleted3);

  if (isSalaryActive.length === 0) {
    await employeeSalary.deleteMany({});
  }

  if (toDelete[0]?.length > 0) {
    await employeeSalary.deleteMany({
      _id: { $in: toDelete[0].map((item) => item._id) },
    });
    console.log(
      `Deleted ${toDelete.length} older salary entries with duplicate salaryID`
    );
  } else if (toDelete2[0].length > 0) {
    await employeeSalary.deleteMany({
      _id: { $in: toDelete2[0].map((item) => item._id) },
    });
    console.log(`Deleted ${toDelete2.length} older salary entries.`);
  } else if (toDelete3[0]?.length > 0) {
    await employeeSalary.deleteMany({
      _id: { $in: toDelete3[0].map((item) => item._id) },
    });
    console.log(`Deleted ${toDelete3.length} older salary entries.`);
  } else {
    console.log('No duplicates found. All salaryIds are unique');
  }
};

const isRecalculationNeeded = async () => {
  let shouldRecalculate = false;
  const latestSalary = await Salary.findOne({ is_Deleted: false })
    .lean()
    .sort({ updatedAt: -1 });
  const lastSalaryUpdateTime = latestSalary?.updatedAt;
  const latestEmpSalary = await employeeSalary
    .findOne()
    .lean()
    .sort({ LastCalculateddAt: -1 });
  const lastEmpSalaryUpdateTime = latestEmpSalary?.LastCalculateddAt;
  const seen = new Set();
  const latestAttendance = await Attendance.findOne()
    .lean()
    .sort({ updatedAt: -1 });
  const lastAttendanceUpdateTime = latestAttendance?.updatedAt;
  const latestHoliday = await Holiday.findOne().lean().sort({ updatedAt: -1 });
  const lastHolidayUpdateTime = latestHoliday?.updatedAt;
  const latestLeave = await Leave.findOne({ Status: 'Approved' })
    .lean()
    .sort({ updatedAt: -1 });
  const lastLeaveUpdateTime = latestLeave?.updatedAt;
  const latestWeekOff = await WeekOff.findOne().lean().sort({ updatedAt: -1 });
  const lastWeekOffUpdateTime = latestWeekOff?.updatedAt;

  seen.add({
    lastAttendanceUpdateTime,
    lastHolidayUpdateTime,
    lastLeaveUpdateTime,
    lastWeekOffUpdateTime,
    lastSalaryUpdateTime,
  });
  seen.forEach((data) => {
    if (
      data.lastAttendanceUpdateTime >= lastEmpSalaryUpdateTime ||
      data.lastSalaryUpdateTime >= lastEmpSalaryUpdateTime ||
      data.lastHolidayUpdateTime >= lastEmpSalaryUpdateTime ||
      data.lastLeaveUpdateTime >= lastEmpSalaryUpdateTime ||
      data.lastWeekOffUpdateTime >= lastEmpSalaryUpdateTime ||
      (lastSalaryUpdateTime && lastEmpSalaryUpdateTime === undefined)
    ) {
      shouldRecalculate = true;
    } else {
      console.log('No Recalculation needed');
    }
  });
  return shouldRecalculate;
};

const createEmployeeSalary = AsyncHandler(async (req, res) => {
  const ShouldRecalculate = await isRecalculationNeeded();

  await cleanUpfunction();
  if (ShouldRecalculate) {
    const result = await getSalaryDataWithRanges();

    let data = [];

    for (const salary of result) {
      const datePrefix = salary.Effective_Date;

      const holiday = await Holiday.find(
        {
          Start_Date: {
            $gte: datePrefix,
          },
        },
        ['End_Date', 'Start_Date']
      );

      const holidayDays = holiday.map((item) =>
        Math.abs(new Date(item.End_Date) - new Date(item.Start_Date))
      );

      const formattedDays = holidayDays.map((item) =>
        Math.ceil(item / (1000 * 60 * 60 * 24) + 1)
      );

      const isHolidayinWeekOff = salary.WeekOffDays.filter((item) => {
        const [dayName, type, week] = item.split(' - ');

        const weeksArray = week.split(',');

        return holiday.some((holiday) => {
          const date = new Date(holiday.Start_Date);
          const weekNumber = getWeekOfMonth(date);
          const weekString = convertnumbertoWeek(weekNumber);

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

      let totalHolidayDays;
      if (isHolidayinWeekOff.length > 0) {
        totalHolidayDays =
          formattedDays.reduce((sum, val) => sum + val, 0) -
          isHolidayinWeekOff.length;
      } else {
        totalHolidayDays = formattedDays.reduce((sum, val) => sum + val, 0);
      }

      const officialHours = calculateTotalOffHours(
        salary.WeekOffDays,
        parseInt(salary?.month, 10),
        salary?.year,
        totalHolidayDays
      );
      const [hours] = officialHours.split(':');
      const workingDays = Math.round(hours / 8);

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
            '_id.month': salary.month,
            '_id.year': salary.year,
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
      const filterLeave = leave.filter((item) => item.Status === 'Approved');

      const uniqueLeave = Array.from(
        new Map(filterLeave.map((l) => [l._id.toString(), l])).values()
      );
      const userLogData = logvalue.filter(
        (log) => log.User === salary.UserId.toString()
      );

      const userTotalLeaveDays = uniqueLeave
        .filter(
          (leave) =>
            leave.userName === salary.UserName &&
            leave.Start_Date.split('-')[1] === salary.month &&
            leave.Start_Date.split('-')[0] === salary.year
        )
        .map((val) => val.Days);

      const attendanceStats = calculateAttendance(
        userLogData,
        workingDays,
        totalHolidayDays,
        userTotalLeaveDays,
        salary?.Salary,
        salary?._id
      );

      const monthlySalary = Number(attendanceStats.salary || 0);
      const perDaySalary =
        Number(attendanceStats.actualWorkingDays) > 0
          ? Math.round(
              monthlySalary / Number(attendanceStats.actualWorkingDays)
            )
          : 0;
      const calculatedSalary =
        perDaySalary * attendanceStats.presentDays +
        attendanceStats.halfDays * perDaySalary * 0.5;

      data.push({
        UserId: new mongoose.Types.ObjectId(salary.UserId),
        salaryId: attendanceStats.salaryId,
        Salary: attendanceStats.salary,
        month: salary.month,
        year: salary.year,
        totaldays: String(attendanceStats.WorkingDays) || '0',
        presentDays: String(attendanceStats.presentDays) || '0',
        halfDays: String(attendanceStats.halfDays) || '0',
        absentDays: String(attendanceStats.absentDays) || '0',
        leaveDays: String(attendanceStats.LeaveCount),
        holidayDays: String(attendanceStats.holidayCount),
        actualWorkingDays: String(attendanceStats.actualWorkingDays),
        calculatedSalary: String(Math.round(calculatedSalary)),
        LastCalculateddAt: new Date(),
      });
    }

    try {
      const result = await insertSalaryDataBulk(data);

      await Promise.all(
        result.map(async (inserted) => {
          await employeeSalary.deleteMany({
            UserId: inserted.UserId,
            _id: { $ne: inserted._id },
            month: inserted.month,
            year: inserted.year,
          });
        })
      );
      return res.status(200).json(new ApiResponse(200, result, 'Ok'));
    } catch (error) {
      throw new ApiError(500, 'DataBase Error', error);
    }
  } else {
    const EmpSalary = await employeeSalary
      .find()
      .populate('UserId', 'Name')
      .populate('salaryId', 'Salary')
      .sort({ month: 1 });
    return res
      .status(200)
      .json(new ApiResponse(200, EmpSalary, 'Employee Salary Fetched'));
  }
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
