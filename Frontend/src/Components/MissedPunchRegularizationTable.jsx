import * as React from 'react';
import PropTypes from 'prop-types';
import ReusableTable from '../Components/ReusableTable.jsx';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '../Components/components/ui/sheet';
import RegularizationForm from './RegularizationForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAttendance,
  resetRegularization,
} from '../feature/attendancefetch/attendanceSlice.js';
import { FaEdit } from 'react-icons/fa';
import Loader from './Loader.jsx';
import { Link } from 'react-router-dom';
import { AddRegularization } from '../feature/attendancefetch/attendanceSlice.js';
import { Bounce, toast } from 'react-toastify';
import { TableContainer } from '@mui/material';
import AttendanceFilterSheet from './AttendanceFilterSheet.jsx';
import { setFilter } from '../feature/filterSlice/filterSlice';

function Row({ row }) {
  const [open, setOpen] = React.useState(false);
  const [DirectSheet, setDirectSheet] = React.useState(false);
  const dispatch = useDispatch();

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
              <KeyboardArrowDownIcon sx={{ color: 'black' }} />
            ) : (
              <KeyboardArrowRightIcon sx={{ color: 'black' }} />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{row.index}</TableCell>
        <TableCell>
          <div className="flex justify-center">{row.Image}</div>
        </TableCell>
        <TableCell>{row.Date}</TableCell>
        <TableCell>{row.User}</TableCell>
        <TableCell>{row.AttendAt}</TableCell>
        <TableCell>{row.TimeOut}</TableCell>
        <TableCell>{row.Count}</TableCell>
        <TableCell className="">
          <div className="flex justify-center">
            <Sheet open={DirectSheet} onOpenChange={setDirectSheet}>
              <SheetTrigger asChild>
                <FaEdit className="cursor-pointer font-semibold text-xl text-[#d7d869]" />
              </SheetTrigger>
              <SheetContent className="bg-white min-w-xl">
                <SheetHeader>
                  <SheetDescription>
                    <RegularizationForm
                      mode="Direct"
                      Name={row.User}
                      id={row.Date}
                      Login={row.AttendAt}
                      LastLogin={row.TimeOut}
                      onSubmit={(data) => {
                        dispatch(AddRegularization(data));
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className="w-full"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={9}
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
                <Table size="medium" className="">
                  <TableHead
                    sx={{
                      backgroundColor: '#c1dde9',
                    }}
                  >
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Time In</TableCell>
                      <TableCell>Location</TableCell>
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
    Count: PropTypes.string,
  }).isRequired,
};

export default function MissedPunchRegularizationTable() {
  const [attendances, setAttendances] = React.useState([]);
  const [sheetopen, setsheetopen] = React.useState(false);
  const filterValue = useSelector(
    (state) => state.filter.filterValue.MissedPunchRegularization
  );
  const { newattendance, loading, createdRegularization } = useSelector(
    (state) => state.markAttendance
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAttendance());
    dispatch(
      setFilter({
        screen: 'MissedPunchRegularization',
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

  const oddPunch = attendances?.map((item) => item.attendances);
  const isToday = new Date().toISOString().split('T')[0];
  const isOdd = oddPunch.filter((item) => {
    return (
      item.length % 2 == 1 &&
      item.some((entry) => entry.attendDateOnly !== isToday)
    );
  });

  const formattedData = isOdd?.map((date, index) => {
    const d = date?.map((item) => item);
    const image = d?.map((item) => item?.Image);
    const Date2 = d.map((item) => item.attendDateOnly);
    const attendAt = d?.map((item) => item?.AttendAt);
    const otherRecords = d?.filter((item) => item);
    const sorted = otherRecords?.sort(
      (a, b) => new Date(a.AttendAt) - new Date(b.AttendAt)
    );
    const sb = attendAt?.map((item) => item);
    const sortedAttendAt = sb?.sort((a, b) => new Date(a) - new Date(b));
    const lastTimeIn = sorted?.findLast((e) => e);
    const isOdd = d?.length % 2 === 1;
    const userName = d?.map((name) => name.userName);
    const count = d.length;

    return {
      index: index + 1,
      Image:
        image?.[0] === '' ? (
          <img
            src="https://res.cloudinary.com/dwv1dc72r/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1747976180/attendance/attendance2025-05-2310:26:19%20am.png.png"
            alt="./download.png"
            className="w-8 h-8 object-cover rounded-3xl"
          />
        ) : (
          <img
            src={image?.[0] !== '' ? image[0] : './download.png'}
            alt=""
            className="w-8 h-8 object-cover rounded-3xl"
          />
        ),
      Date: Date2[0],
      User: userName?.[0],
      AttendAt: new Date(sortedAttendAt?.[0]).toLocaleTimeString(),
      TimeOut: isOdd
        ? new Date()?.toLocaleTimeString()
        : new Date(lastTimeIn?.AttendAt)?.toLocaleTimeString(),
      Count: count,
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
    { field: 'Count', headerName: 'Count' },
    { field: 'regularization', headerName: 'Regularization' },
  ];
  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Missing Punch Regularization
        </h5>
        <div className="flex items-center">
          <AttendanceFilterSheet screen="MissedPunchRegularization" />
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger>
              <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[155px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
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
                    }}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ReusableTable
        width="full"
        columns={columns}
        data={filteredData}
        RowComponent={Row}
        pagination={true}
        tableStyle={{
          '& .MuiTableCell-root': {
            padding: 0.6,
            textAlign: 'center',
          },
        }}
      />
    </>
  );
}
