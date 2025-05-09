import React from 'react';
import ReusableTable from '../Components/ReusableTable.jsx';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { getMonthlyReportDetail } from '../feature/attendancefetch/attendanceSlice.js';
import { fetchHoliday } from '../feature/hoildayfetch/hoildaySlice.js';
import Select from 'react-select';

const getDaysinMonth = (year, month) => {
  const days = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const day = String(date.getDate()).padStart(2, '0');
    const monthStr = String(date.getMonth() + 1);
    const yearStr = date.getFullYear();
    days.push(`${dayName} ${day}/${monthStr}/${yearStr}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

function getDatesInRange(start, end) {
  const date = new Date(start);
  const endDate = new Date(end);
  const dates = [];

  while (date <= endDate) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function Row({ row }) {
  const { fetchedMonthlyReportDetail } = useSelector(
    (state) => state.markAttendance
  );

  const dispatch = useDispatch();
  const [HolidayDate, SetHolidayDate] = React.useState([]);

  const { allHoliday } = useSelector((state) => state.holiday);

  React.useEffect(() => {
    dispatch(fetchHoliday());
  }, []);

  React.useEffect(() => {
    if (allHoliday?.message) {
      SetHolidayDate(allHoliday.message);
    }
  }, [allHoliday]);

  let holidayDatesSet = new Set();

  HolidayDate?.forEach((item) => {
    const [startDay, startMonth, startYear] = item.Start_Date.split('-');
    const [endDay, endMonth, endYear] = item.End_Date.split('-');

    const startDate = new Date(`${startYear}-${startMonth}-${startDay}`);
    const endDate = new Date(`${endYear}-${endMonth}-${endDay}`);

    const rangeDates = getDatesInRange(startDate, endDate);
    rangeDates.forEach((d) => holidayDatesSet.add(d));
  });

  const getWeekOfMonth = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    return Math.ceil(day / 7);
  };

  const weekOffMap = {};
  row.weekOffDays.forEach((entry) => {
    const [day, type, weekStr] = entry.split(' - ');
    weekOffMap[day.toLowerCase()] = {
      type,
      weeks: weekStr?.trim() ? weekStr.split(',') : ['All'],
    };
  });

  const weekNames = [
    'First Week',
    'Second Week',
    'Third Week',
    'Fourth Week',
    'Fifth Week',
  ];

  const getColorByStatus = (status) => {
    switch (status) {
      case 'P':
        return '#03C04A';
      case 'A':
        return 'red';
      case 'HD':
        return 'purple';
      case 'H':
        return 'orange';
      case 'W':
        return 'gray';
      case 'L':
        return 'blue';
      case 'POW':
        return 'teal';
      case 'POH':
        return 'brown';
      case 'POL':
        return '#1565C0';
      default:
        return 'black';
    }
  };

  const parseTimeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.userName}</TableCell>
        {row.logs.map((item) => {
          const currentDate = new Date(item.date);

          const date = new Date(item.date);

          const leaveEntry = item.leaveData.find((leave) => {
            if (leave.Status !== 'Approved') return false;
            const start = new Date(leave.StartDate);

            const end = leave.EndDate ? new Date(leave.EndDate) : start;
            return currentDate >= start && currentDate <= end;
          });

          const dayName = date
            .toLocaleDateString('en-US', { weekday: 'long' })
            .toLowerCase();
          const weekOfMonth = getWeekOfMonth(item.date);
          const weekLabel = weekNames[weekOfMonth - 1];
          const logHours = item.logHours;
          const isZero = logHours === '00:00:00' || logHours === '0:0:0';

          const logSeconds = parseTimeToSeconds(logHours);
          const isUnderTime = logSeconds < 4 * 3600;
          const isHalfDay = logSeconds >= 4 * 3600 && logSeconds < 6 * 3600;

          let status = isZero ? 'A' : 'P';

          if (holidayDatesSet.has(item.date)) {
            status = isZero ? 'H' : 'POH';
          } else if (leaveEntry) {
            const isHalf = !Number.isInteger(leaveEntry.Days);
            const startDate = new Date(leaveEntry.StartDate);
            const endDate = leaveEntry.EndDate
              ? new Date(leaveEntry.EndDate)
              : startDate;

            if (isHalf) {
              const isStart =
                currentDate.toDateString() === startDate.toDateString();
              const isEnd =
                currentDate.toDateString() === endDate.toDateString();

              if (
                (isStart && leaveEntry.StartDateType === 'Second_Half') ||
                (isEnd && leaveEntry.EndDateType === 'First_Half')
              ) {
                status = isZero ? 'HD' : 'POL';
              } else {
                status = isZero ? 'L' : 'POL';
              }
            } else {
              status = isZero ? 'L' : 'POL';
            }
          } else if (weekOffMap[dayName]) {
            const { type, weeks } = weekOffMap[dayName];
            const appliesToThisWeek =
              weeks.includes('All') || weeks.includes(weekLabel);

            if (appliesToThisWeek) {
              if (type === 'WeekOff') {
                status = isZero ? 'W' : 'POW';
              } else if (type === 'Half Day' && isHalfDay) {
                status = 'HD';
              } else if (type === 'Leave') {
                status = 'L';
              }
            }
          } else {
            if (isZero) {
              status = 'A';
            } else if (isHalfDay) {
              status = 'HD';
            } else if (isUnderTime) {
              status = 'A';
            }
          }

          return (
            <TableCell key={item.date} sx={{ color: getColorByStatus(status) }}>
              <div style={{ fontWeight: 'bold' }}>{status}</div>
              <div>{item.logHours}</div>
            </TableCell>
          );
        })}
        <TableCell sx={{ color: '#3e8be2' }}>{row.officialHours}</TableCell>
        <TableCell sx={{ color: 'red' }}>{row.workingHours}</TableCell>
        <TableCell sx={{ color: 'red' }}>{row.pendingHours}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const monthOptions = [
  { value: '01', label: 'Januaray' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const monthName = monthOptions.map((item) => item.label);

const getMonthByName = (monthNumber) => {
  if (monthNumber >= 1 && monthNumber <= 12) {
    return monthName[monthNumber - 1];
  } else {
    return 'Invalid month number';
  }
};

const currentMonth = new Date().getMonth() + 1;

const currentYear = new Date().getFullYear();
const YearDropdown = () => {
  const startYear = 2000;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => {
      const year = startYear + index;
      return { value: year, label: year.toString() };
    }
  ).reverse();
  return years;
};

const MonthlyReportTable = () => {
  const [detail, setDetail] = React.useState([]);
  const [selectedMonth, setSelectedMonth] = React.useState(`0${currentMonth}`);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const dispatch = useDispatch();
  const { fetchedMonthlyReportDetail } = useSelector(
    (state) => state.markAttendance
  );

  const data = {
    selectedMonth,
    selectedYear,
  };

  React.useEffect(() => {
    if (selectedMonth && selectedYear) {
      dispatch(getMonthlyReportDetail(data));
    }
  }, [selectedMonth, selectedYear]);

  React.useEffect(() => {
    if (fetchedMonthlyReportDetail?.message) {
      setDetail(fetchedMonthlyReportDetail.message);
    }
  }, [fetchedMonthlyReportDetail]);

  const days = getDaysinMonth(selectedYear, selectedMonth);

  const monthByName = getMonthByName(selectedMonth);

  const columns = [
    { field: 'UserName', headerName: 'UserName' },
    ...days.map((dayString, index) => {
      const [dayName, dateStr] = dayString.split(' ');
      return {
        field: `day_${index}`,
        headerName: `${dayName} ${dateStr}`,
      };
    }),
    { field: 'Officail_Hours', headerName: 'Official Hours' },
    { field: 'Working_Hours', headerName: 'Working Hours' },
    { field: 'Pending_Hours', headerName: 'Pending Hours' },
  ];

  return (
    <>
      <div className="inline-flex justify-between w-full px-2 bg-white h-15 rounded-md  mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif] flex items-center ml-2">
          Attendance Monthly Report
        </h5>
        <h2 className="flex items-center text-[22px] mr-10">
          {monthByName}-{selectedYear}
        </h2>
        <div className="flex gap-2 items-center">
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                fontSize: '15px',
                backgroundColor: 'transparent',
                width: 'auto',
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                fontSize: '15px',
                width: 'auto',
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused ? 'rgb(51,141,181)' : 'white',
                color: state.isFocused ? 'white' : 'rgb(120, 122, 126)',
                ':hover': {
                  backgroundColor: 'rgb(51,141,181)',
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: 'white',
                minWidth: '120px',
              }),
            }}
            className="z-50"
            placeholder={monthByName}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.value)}
            options={monthOptions}
          />
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                fontSize: '15px',
                backgroundColor: 'transparent',
                width: 'auto',
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                fontSize: '15px',
                width: 'auto',
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: state.isFocused ? 'rgb(51,141,181)' : 'white',
                color: state.isFocused ? 'white' : 'rgb(120, 122, 126)',
                ':hover': {
                  backgroundColor: 'rgb(51,141,181)',
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: 'white',
                minWidth: '120px',
              }),
            }}
            className="z-50"
            placeholder={selectedYear}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.value)}
            options={YearDropdown()}
          />
        </div>
      </div>
      <div className="flex gap-x-2 w-auto mb-2 overflow-x-auto">
        <div className="border border-[#03C04A] px-2 text-[#03C04A] rounded-sm">
          P --- Present
        </div>
        <div className="border border-[red] px-2 text-[red] rounded-sm">
          A --- Absent
        </div>
        <div className="border border-[purple] px-2 text-[purple] rounded-sm">
          HD --- Half Day
        </div>
        <div className="border border-[gray]  text-[gray] px-2 rounded-sm">
          W --- WeekOff
        </div>
        <div className="border border-[orange] text-[orange] px-2 rounded-sm">
          H --- Holiday
        </div>
        <div className="border border-[blue] text-[blue] px-2 rounded-sm">
          L --- Leave
        </div>
        <div className="border border-[teal] text-[teal] px-2 rounded-sm">
          POW --- Present on WeekOff
        </div>
        <div className="border border-[brown] text-[brown] px-2 rounded-sm">
          POH --- Present on Holiday
        </div>
        <div className="border border-[#1565C0] text-[#1565C0] px-2 w-auto rounded-sm">
          POL --- Present on Leave
        </div>
      </div>
      <ReusableTable
        columns={columns}
        RowComponent={Row}
        data={detail}
        padding="1"
        width="99%"
        rowProps={{ detail }}
        containerStyle={{ borderRadius: 0 }}
        cellStyle={{ border: 2 }}
        tableStyle={{
          '& .MuiTableCell-root': {
            border: 2,
            padding: 1,
            textAlign: 'center',
            borderColor: 'gray',
          },
        }}
      />
    </>
  );
};

export default MonthlyReportTable;
