import React from 'react';
import ReusableTable from '../Components/ReusableTable.jsx';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { getMonthlyReportDetail } from '../feature/attendancefetch/attendanceSlice.js';

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

function formatToUK(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, 0);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function Row({ row, z }) {
  const dateColumns = z
    .map((col) => col)
    .filter(
      (header) =>
        header !== 'UserName' &&
        header !== 'Official Hours' &&
        header !== 'Working Hours' &&
        header !== 'Pending Hours'
    );

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>Harsh Patel</TableCell>
        {dateColumns.map((headerDate) => {
          const formattedHeader = headerDate.split(' ')[1];
          const matched = row.dataforEachDate.find(
            (entry) => formatToUK(entry.date) === formattedHeader
          );

          return (
            <TableCell key={headerDate}>
              {matched ? matched.LogHours.LogHours : '00:00:00'}
            </TableCell>
          );
        })}
        <TableCell>{row.OfficialHours}</TableCell>
        <TableCell>{row.WorkingHours}</TableCell>
        <TableCell>{row.PendingHours}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const MonthlyReportTable = () => {
  const [detail, setDetail] = React.useState([]);
  const { fetchedMonthlyReportDetail } = useSelector(
    (state) => state.markAttendance
  );
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getMonthlyReportDetail());
  }, []);

  React.useEffect(() => {
    if (fetchedMonthlyReportDetail?.message) {
      setDetail(fetchedMonthlyReportDetail.message);
    }
  }, [fetchedMonthlyReportDetail]);
  console.log(detail);

  const days = getDaysinMonth(2025, 4);

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
  const z = columns.map((item) => item.headerName);

  const data = detail.map((item, index) => {
    const date = item.dataforEachDate;
    const matchedDates = date.map((item) => item.date);
    const abs = z.slice(1, 31);

    const c = matchedDates.filter((item) => item);
    return {
      OfficialHours: item.officialHours,
      PendingHours: item.pendingHours,
      WorkingHours: item.workingHours,
      dataforEachDate: date,
    };
  });

  return (
    <ReusableTable
      columns={columns}
      RowComponent={Row}
      data={data}
      rowProps={{ z }}
    />
  );
};

export default MonthlyReportTable;
