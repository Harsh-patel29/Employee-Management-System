import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  fetchAttendance,
  openAttendanceSheet,
  AddRegularization,
  resetRegularization,
  GetRegularization,
} from '../feature/attendancefetch/attendanceSlice.js';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '../Components/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Components/components/ui/dialog';
import { Button } from '../Components/components/ui/button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Link } from 'react-router-dom';
import Loader from './Loader.jsx';
import ReusableTable from './ReusableTable.jsx';
import ExporttoExcel from './Export.jsx';
import RegularizationForm from './RegularizationForm.jsx';
import { Bounce, toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import RegularizationDetailTable from './RegularizationDetailTable.jsx';
import { formatInTimeZone } from 'date-fns-tz';
import { TableContainer } from '@mui/material';
import AttendanceFilterSheet from './AttendanceFilterSheet.jsx';
import { setFilter } from '../feature/filterSlice/filterSlice';

const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  const [hours, minutes, seconds] = timeString.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
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

function convertTimeStringToSeconds(timeStr) {
  const [h, m, s] = timeStr.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function Row({ row }) {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const theme = useSelector((state) => state.theme.theme);
  const { fetchedRegularization } = useSelector(
    (state) => state.markAttendance
  );
  const { user } = useSelector((state) => state.auth);

  const [DirectSheet, setDirectSheet] = React.useState(false);
  const [detail, setdetail] = React.useState([]);

  React.useEffect(() => {
    if (fetchedRegularization?.message) {
      setdetail(fetchedRegularization.message);
    }
  }, [fetchedRegularization]);
  const matchedWithRegularization = detail.map((item) => item.Date);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowDownIcon
                sx={{ color: theme === 'light' ? 'black' : '#f8f9fa' }}
              />
            ) : (
              <KeyboardArrowRightIcon
                sx={{ color: theme === 'light' ? 'black' : '#f8f9fa' }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{row.index}</TableCell>
        <TableCell className="">
          <div className="flex justify-center">{row.Image}</div>
        </TableCell>
        <TableCell>{row.Date}</TableCell>
        <TableCell>{row.User}</TableCell>
        <TableCell>{row.AttendAt}</TableCell>
        <TableCell>{row.TimeOut}</TableCell>
        <TableCell>{row.formattedLogHours}</TableCell>
        <TableCell>
          {row.Latitude !== null || row.Longitude !== null ? (
            <Link
              onClick={() => {
                const url = `https://www.google.com/maps?q=${row.Latitude},${row.Longitude}`;
                window.open(url, '_blank');
              }}
              className="bg-transparent text-[rgb(51,141,181)] text-[15px]"
            >
              View
            </Link>
          ) : (
            <p>No Coordinates</p>
          )}
        </TableCell>
        <TableCell>
          <div className="flex justify-center gap-2">
            {(row.otherAttendances.length % 2 === 1 ||
              row.otherAttendances.some(
                (entry) =>
                  entry.attendDateOnly ===
                  new Date().toISOString().split('T')[0]
              )) &&
              (user.user.role === 'Admin' || user.user.Name === row.User) && (
                <Sheet open={DirectSheet} onOpenChange={setDirectSheet}>
                  <SheetTrigger asChild>
                    <FaEdit className="cursor-pointer font-semibold text-xl text-[#d7d869]" />
                  </SheetTrigger>
                  <SheetContent className="bg-white min-w-xl">
                    <SheetHeader>
                      <SheetDescription>
                        <RegularizationForm
                          mode="Direct"
                          id={row.Date}
                          Login={row.AttendAt}
                          LastLogin={row.TimeOut}
                          onSubmit={(data) => {
                            dispatch(AddRegularization(data));
                            dispatch(fetchAttendance());
                          }}
                        />
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              )}
            {matchedWithRegularization.find((item) => item === row.Date) && (
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <FaInfoCircle className="cursor-pointer font-semibold text-xl text-[#338db5]" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-gray-700 text-3xl font-[sans-serif,Inter] border-b-1  border-gray-700">
                        Regularization Details
                      </DialogTitle>
                      <DialogDescription>
                        <div className="inset-0 flex  z-50">
                          <div className=" rounded-2xl shadow-none w-[100%] max-w-md relative">
                            <RegularizationDetailTable
                              Date={row.Date}
                              UserName={row.User}
                              user={row.userId}
                            />
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className="w-full"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={10}
          sx={{
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                paddingX: '320px',
              }}
            >
              <TableContainer
                sx={{ borderRadius: 2 }}
                className="border border-gray-200"
              >
                <Table size="medium">
                  <TableHead
                    sx={{
                      backgroundColor: '#c1dde9',
                      border: 'black',
                    }}
                  >
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Time In</TableCell>
                      <TableCell>Coordinates</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.otherAttendances?.map((attendance, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          backgroundColor: 'white',
                          color: 'black',
                        }}
                      >
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {attendance.Image === '' ? (
                              <img
                                src="./download.png"
                                alt="Attendance"
                                className="w-8 h-8 object-cover rounded-3xl"
                              />
                            ) : (
                              <img
                                src={attendance.Image}
                                alt="Attendance"
                                className="w-8 h-8 object-cover rounded-3xl"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(attendance.AttendAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {attendance.Latitude !== null ||
                          attendance.Longitude !== null ? (
                            <Link
                              onClick={() => {
                                const url = `https://www.google.com/maps?q=${attendance.Latitude},${attendance.Longitude}`;
                                window.open(url, '_blank');
                              }}
                              className="bg-transparent text-[rgb(51,141,181)] text-[15px]"
                            >
                              {' '}
                              Map View
                            </Link>
                          ) : (
                            <p>No Coordinates</p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    Image: PropTypes.string,
    User: PropTypes.string,
    Date: PropTypes.string,
    AttendAt: PropTypes.string,
    TimeOut: PropTypes.string,
    formattedLogHours: PropTypes.string,
    Location: PropTypes.string,
    otherAttendances: PropTypes.array,
  }).isRequired,
};
export default function CollapsibleTable() {
  const dispatch = useDispatch();
  const [openFilterSheet, setOpenFilterSheet] = React.useState(false);
  const [isOpen, setisOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [attendances, setAttendances] = React.useState([]);
  const [sheetopen, setsheetopen] = React.useState(false);
  const filterValue = useSelector(
    (state) => state.filter.filterValue.Attendance
  );

  const { newattendance, loading, createdRegularization } = useSelector(
    (state) => state.markAttendance
  );
  React.useEffect(() => {
    dispatch(fetchAttendance());
    dispatch(GetRegularization());
    dispatch(
      setFilter({
        screen: 'Attendance',
        values: {
          User: null,
          StartDate: new Date().toISOString(),
          EndDate: new Date().toISOString(),
        },
      })
    );
  }, []);

  React.useEffect(() => {
    if (newattendance?.message) {
      setAttendances(newattendance.message);
    }
  }, [newattendance]);

  React.useEffect(() => {
    if (createdRegularization?.success) {
      toast.success('Regularization created Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setsheetopen(false);
      dispatch(resetRegularization());
    }
  }, [createdRegularization]);

  const now = new Date();
  const today = new Date().toISOString().split('T')[0];

  const formattedData = attendances?.map((date, index) => {
    const d = date?.attendances?.map((item) => item);
    const image = d.map((item) => item.Image);
    const attendAt = d.map((item) => item.AttendAt);
    const otherRecords = d.filter((item) => item);

    const sorted = otherRecords.sort(
      (a, b) => new Date(a.AttendAt) - new Date(b.AttendAt)
    );

    const sb = attendAt.map((item) => item);
    const sortedAttendAt = sb.sort((a, b) => new Date(a) - new Date(b));

    const lastTimeIn = sorted.findLast((e) => e);

    const latestEntry = sorted.slice(0, sorted.length - 1);
    const lastEntry = latestEntry.findLast((e) => e);

    const originalSeconds = convertTimeStringToSeconds(
      lastEntry?.LogHours || '00:00:00'
    );

    const secondsSincePunchIn = calculateTimeDifferenceInSeconds(
      new Date(lastTimeIn?.AttendAt),
      new Date()
    );

    const totalSeconds = originalSeconds + secondsSincePunchIn;

    const updatedLogTime = convertSecondsToTimeString(totalSeconds);

    const isOdd = d.length % 2 === 1;
    const userName = d.map((name) => name.userName);
    const userId = d.map((id) => id.User);

    const sevenPmIstInUtc = new Date(`${date.date}T13:30:00.000Z`);

    const isAfter7PMIST = now >= sevenPmIstInUtc;

    const formattedTime = formatInTimeZone(
      sortedAttendAt[0],
      'Asia/Kolkata',
      ' hh:mm:ss a'
    );

    const sevenPMFormatted = new Date(sevenPmIstInUtc).toLocaleTimeString();
    const punchedInAt = new Date(lastTimeIn?.AttendAt);
    const isPunchedInBefore7PM = punchedInAt < sevenPmIstInUtc;
    const isPunchedInAfter7PM = punchedInAt >= sevenPmIstInUtc;

    return {
      index: index + 1,
      Image:
        image[0] === '' ? (
          <img
            src="./download.png"
            alt="./download.png"
            className="w-8 h-8 object-cover rounded-3xl"
          />
        ) : (
          <img
            src={image[0] ? image[0] : './download.png'}
            alt=""
            className="w-8 h-8 object-cover rounded-3xl"
          />
        ),
      Date: date.date,
      User: userName[0],
      userId: userId[0],
      AttendAt: formattedTime,
      TimeOut:
        isOdd || isAfter7PMIST || (isPunchedInAfter7PM && isOdd)
          ? isOdd && isPunchedInBefore7PM
            ? sevenPMFormatted
            : isOdd && today === date.date
              ? new Date().toLocaleTimeString()
              : new Date(lastTimeIn?.AttendAt).toLocaleTimeString()
          : new Date(lastTimeIn?.AttendAt).toLocaleTimeString(),
      formattedLogHours:
        (isOdd && !isAfter7PMIST) ||
        (isPunchedInAfter7PM && today === date.date && isOdd)
          ? formatTime(updatedLogTime)
          : formatTime(lastTimeIn?.LogHours),
      otherAttendances: otherRecords,
      Latitude: lastTimeIn?.Latitude,
      Longitude: lastTimeIn?.Longitude,
    };
  });

  const filteredData = formattedData?.filter((item) => {
    const itemDate = new Date(item.Date);

    if (
      filterValue === undefined ||
      filterValue === null ||
      Object?.keys(filterValue).length === 0
    )
      return true;
    const userMatch = !filterValue.User || item.User === filterValue.User;
    const startDate = filterValue.StartDate
      ? new Date(filterValue.StartDate)
      : null;
    const endDate = filterValue.EndDate ? new Date(filterValue.EndDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const dateRangeMatch =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);
    return userMatch && dateRangeMatch;
  });

  const columns = [
    { field: 'expand', headerName: '', width: 50 },
    { field: 'index', headerName: '#' },
    { field: 'image', headerName: 'Image' },
    { field: 'date', headerName: 'Date' },
    { field: 'user', headerName: 'User' },
    { field: 'TimeIn', headerName: 'TimeIn' },
    { field: 'timeOut', headerName: 'Time Out' },
    { field: 'logHours', headerName: 'Log Hours' },
    { field: 'location', headerName: 'Location' },
    { field: 'regularization', headerName: 'Regularization' },
  ];

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Attendance
        </h5>
        <div className="flex items-center">
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger>
              <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[155px] justify-center text-[17px] h-9 mr-3 flex items-center  hover:bg-[#dbf4ff] transition-all duration-300">
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>create</title>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Regularization
              </div>
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="bg-white min-w-xl">
              <SheetHeader>
                <SheetDescription>
                  <RegularizationForm
                    onSubmit={(data) => {
                      dispatch(AddRegularization(data));
                      dispatch(fetchAttendance());
                    }}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <ExporttoExcel
            data={formattedData}
            fileName="Attendance"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          />
          <AttendanceFilterSheet screen="Attendance" />
          <button
            onClick={() => dispatch(openAttendanceSheet())}
            className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[150px] justify-center text-[17px] h-9 mr-8 flex items-center hover:bg-[#dbf4ff] transition-all duration-300"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              class="theme-btn-color"
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: 'var(--THEME-ICON-SIZE)' }}
            >
              <title>Attendace</title>
              <path d="M256 48C141.6 48 48 141.6 48 256s93.6 208 208 208 208-93.6 208-208S370.4 48 256 48zm-42.7 318.9L106.7 260.3l29.9-29.9 76.8 76.8 162.1-162.1 29.9 29.9-192.1 191.9z"></path>
            </svg>
            Attendance
          </button>
        </div>
      </div>
      <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
        <SheetContent className="min-w-2xl">
          <SheetHeader>
            <SheetTitle>Filter Attendance</SheetTitle>
            <div className="flex w-full justify-between mt-2">
              <h1 className="ml-30">From</h1>
              <h1 className="mr-30">To</h1>
            </div>
          </SheetHeader>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DemoContainer components={['DateRangeCalendar']}>
              <div className="flex flex-row gap-4 mt-4">
                <DateCalendar
                  label="From Date"
                  value={fromDate}
                  onChange={(value) => {
                    setFromDate(value);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DateCalendar
                  label="To Date"
                  minDate={fromDate}
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  slots={(params) => <TextField {...params} />}
                />
              </div>
            </DemoContainer>
          </LocalizationProvider>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                setFromDate(null);
                setToDate(null);
              }}
              className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 w-full ml-40 mr-40 "
            >
              Clear Filter
            </Button>
          </div>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>

      <ReusableTable
        width="full"
        columns={columns}
        data={filteredData}
        RowComponent={Row}
        pagination={true}
      />
    </>
  );
}
