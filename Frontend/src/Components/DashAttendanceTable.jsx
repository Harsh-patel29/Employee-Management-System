import * as React from 'react';
import PropTypes, { func } from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector, useDispatch } from 'react-redux';
import ReusableTable from './ReusableTable.jsx';
import { fetchAttendance } from '../feature/attendancefetch/attendanceSlice.js';

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes, seconds] = timeString.split(':');
  return `${hours.padStart(2, '0')}:${minutes}:${seconds.padStart(2, '0')}`;
};

const calculateTimeDifferenceInSeconds = (startTime, endTime) => {
  const diffMs = endTime - startTime;
  return Math.floor(diffMs / 1000);
};

function convertSecondsToTimeString(totalSeconds) {
  totalSeconds = Math.abs(totalSeconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const timeString = `${hours}:${minutes}:${seconds}`;

  return timeString;
}
function Row({ row }) {
  const last = row.attendances.findLast((e) => e.LogHours);
  const isOdd = row.attendances.length % 2 !== 0;

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.index}</TableCell>
        <TableCell>{row.attendances[0].UserName}</TableCell>
        <TableCell>
          {' '}
          {isOdd
            ? formatTime(
                convertSecondsToTimeString(
                  calculateTimeDifferenceInSeconds(
                    new Date(last.AttendAt),
                    new Date()
                  )
                )
              )
            : last.LogHours}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.prototype = {
  row: PropTypes.shape({
    index: PropTypes.number,
    UserName: PropTypes.string,
    LogHours: PropTypes.string,
  }).isRequired,
};

export default function DashAttendanceTable() {
  const dispatch = useDispatch();
  const { newattendance } = useSelector((state) => state.markAttendance);
  const [attendances, setAttendances] = React.useState([]);

  React.useEffect(() => {
    dispatch(fetchAttendance());
  }, []);

  React.useEffect(() => {
    if (newattendance?.message) {
      setAttendances(newattendance.message);
    }
  }, [newattendance]);

  const latestAttendance = {};
  attendances.forEach((item, index) => {
    const { user, date } = item;
    if (
      !latestAttendance[user] ||
      new Date(date) > new Date(latestAttendance[user])
    ) {
      latestAttendance[user] = { ...item, index };
    }
  });

  const formattedData = Object.values(latestAttendance);

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'User', headerName: 'User' },
    { field: 'LogHours', headerName: 'LogHours' },
  ];

  return (
    <ReusableTable
      RowComponent={Row}
      data={formattedData}
      columns={columns}
      pagination={false}
    />
  );
}
