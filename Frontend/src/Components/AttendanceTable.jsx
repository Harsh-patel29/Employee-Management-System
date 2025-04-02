import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { markAttendance } from "../feature/attendancefetch/attendanceSlice.js";
import { fetchAttendance } from "../feature/attendancefetch/attendanceSlice.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "../Components/components/ui/sheet";
import { Button } from "../Components/components/ui/button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Link, useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import Loader from "./Loader.jsx";

function convertDateFormat(dateStr) {
  const [month, day, year] = dateStr.split("/");
  return `${day}/${month}/${year}`;
}

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hours, minutes, seconds] = timeString.split(":");
  return `${hours.padStart(2, "0")}:${minutes}:${seconds.padStart(2, "0")}`;
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

function Row({ row, openMap }) {
  const [open, setOpen] = React.useState(false);
  const theme = useSelector((state) => state.theme.theme);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: "white",
          color: "black",
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
                sx={{ color: theme === "light" ? "black" : "#f8f9fa" }}
              />
            ) : (
              <KeyboardArrowRightIcon
                sx={{ color: theme === "light" ? "black" : "#f8f9fa" }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{row.index}</TableCell>
        <TableCell>{row.Image}</TableCell>
        <TableCell>{row.Date}</TableCell>
        <TableCell>{row.User}</TableCell>
        <TableCell>{row.AttendAt}</TableCell>
        <TableCell>{row.TimeOut}</TableCell>
        <TableCell>{row.formattedLogHours}</TableCell>
        <TableCell>
          <Link
            onClick={() => openMap()}
            className="bg-transparent text-[rgb(51,141,181)] text-[15px]"
          >
            View
          </Link>
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={8}
          sx={{
            backgroundColor: "white",
            color: "black",
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
              }}
            >
              <Table size="medium" className="ml-36">
                <TableHead
                  sx={{
                    backgroundColor: "#c1dde9",
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
                  {row.otherAttendances.map((attendance, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                      }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <img
                          src={attendance.Image}
                          alt="Attendance"
                          className="w-12 h-12 object-cover rounded-3xl"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(attendance.AttendAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Link
                          onClick={() => openMap()}
                          className="bg-transparent text-[rgb(51,141,181)] text-[15px]"
                        >
                          {" "}
                          Map View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
  const [openAttendanceSheet, setOpenAttendanceSheet] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [attendances, setAttendances] = React.useState([]);
  const [filteredAttendances, setFilteredAttendances] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const navigate = useNavigate();

  const { attendance, newattendance, loading, error } = useSelector(
    (state) => state.markAttendance
  );

  const { user } = useSelector((state) => state.auth);

  const theme = useSelector((state) => state.theme.theme);

  React.useEffect(() => {
    dispatch(fetchAttendance());
  }, []);

  React.useEffect(() => {
    if (newattendance?.message) {
      setAttendances(newattendance.message);
      setFilteredAttendances(newattendance.message);
    }
  }, [newattendance]);

  React.useEffect(() => {
    if (openAttendanceSheet) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing camera:", error));
    }
    if (!openAttendanceSheet) {
      stopCamera();
    }
  }, [openAttendanceSheet]);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  };

  React.useEffect(() => {
    if (attendance?.success === true) {
      dispatch(fetchAttendance());
      navigate("/attendance");
      stopCamera();
      setOpenAttendanceSheet(false);
    }
  }, [attendance?.success, navigate]);

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/png");
    const response = await fetch(base64);
    const blob = await response.blob();

    const file = new File([blob], "attendance.png", {
      type: "image/png",
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const formData = new FormData();
          formData.append("attendance", file);
          formData.append("Latitude", latitude);
          formData.append("Longitude", longitude);

          dispatch(markAttendance({ attendance: file, latitude, longitude }));
          setOpenAttendanceSheet(false);
          stopCamera();
        },
        (error) => console.log("Error in getting location", error.message)
      );
    } else {
      alert("GeoLocation is not supported");
    }
  };

  React.useEffect(() => {
    if (!fromDate && !toDate) {
      setFilteredAttendances(attendances);
    } else {
      const currentDate = new Date();
      const from = fromDate ? new Date(fromDate) : currentDate;
      const to = toDate ? new Date(toDate) : currentDate;

      const filtered = attendances.filter((attendance) => {
        const attendanceDate = new Date(attendance.AttendAt);
        return attendanceDate >= from && attendanceDate <= to;
      });

      setFilteredAttendances(filtered);
    }
  }, [fromDate, toDate, attendances]);

  const groupedAttendances = React.useMemo(() => {
    return filteredAttendances?.reduce((acc, attendance) => {
      const date = new Date(attendance.AttendAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(attendance);
      return acc;
    }, {});
  }, [filteredAttendances]);

  const sortedDates = Object.keys(groupedAttendances).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedDates = sortedDates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Attendance
        </h5>
        <div className="flex items-center">
          <button
            className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[120px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff]  transition-all duration-300"
            onClick={() => setOpenFilterSheet(true)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "var(--THEME-ICON-SIZE)" }}
            >
              <title>filters</title>
              <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z"></path>
            </svg>
            Filters
          </button>
          <button
            className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[150px] justify-center text-[17px] h-9 mr-8 flex items-center hover:bg-[#dbf4ff]  transition-all duration-300"
            onClick={() => setOpenAttendanceSheet(!openAttendanceSheet)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              class="theme-btn-color"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "var(--THEME-ICON-SIZE)" }}
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
            <DemoContainer components={["DateRangeCalendar"]}>
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

      <Sheet open={openAttendanceSheet} onOpenChange={setOpenAttendanceSheet}>
        <SheetContent className="min-w-xl">
          <SheetHeader>
            <SheetTitle>Mark Attendance</SheetTitle>
          </SheetHeader>
          <div className="w-full flex justify-center mt-4">
            <video
              ref={videoRef}
              autoPlay
              className="w-full max-w-md rounded-lg border shadow-lg"
            ></video>
          </div>
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="flex justify-center mt-4">
            <Button
              onClick={captureImage}
              className="px-6 py-2 mt-6 bg-white text-black hover:bg-gray-50 border-black border"
            >
              Mark Attendance
            </Button>
          </div>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "white",
          marginTop: 0.5,
          color: "black",
          maxHeight: 500,
          width: "98%",
          marginLeft: 1.7,
          borderRadius: 2,
        }}
      >
        <Table
          aria-label="collapsible table"
          sx={{
            "& .MuiTableCell-root": {
              padding: 0.4,
            },
          }}
        >
          <TableHead sx={{ backgroundColor: "#c1dde9" }}>
            <TableRow className="h-2">
              <TableCell />
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Image
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                User
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Time In
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Time Out
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Log Hours
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Location
              </TableCell>
              <TableCell sx={{ fontWeight: "200", fontSize: "medium" }}>
                Regularization
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDates.map((date, index) => {
              const records = groupedAttendances[date];
              const firstRecord = records[0];
              const otherRecords = records.slice(0);
              const lastTimeIn = otherRecords.findLast((e) => {
                return e;
              });
              const isOdd = records.length % 2 === 1;

              return (
                <Row
                  key={date}
                  row={{
                    index: page * rowsPerPage + index + 1,
                    Image: (
                      <img
                        src={firstRecord.Image}
                        alt="Attendance"
                        className="w-8 h-8 object-cover rounded-3xl"
                      />
                    ),
                    Date: convertDateFormat(date),
                    User: user.user.Name,
                    AttendAt: new Date(
                      lastTimeIn?.AttendAt
                    ).toLocaleTimeString(),
                    TimeOut: isOdd
                      ? new Date().toLocaleTimeString()
                      : new Date(firstRecord.AttendAt).toLocaleTimeString(),
                    formattedLogHours: isOdd
                      ? formatTime(
                          convertSecondsToTimeString(
                            calculateTimeDifferenceInSeconds(
                              new Date(firstRecord.AttendAt),
                              new Date()
                            )
                          )
                        )
                      : formatTime(firstRecord.LogHours),
                    otherAttendances: otherRecords,
                  }}
                  openMap={() => {
                    const url = `https://www.google.com/maps?q=${firstRecord.Latitude},${firstRecord.Longitude}`;
                    window.open(url, "_blank");
                  }}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="flex w-full justify-center"
        component="div"
        count={sortedDates.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
