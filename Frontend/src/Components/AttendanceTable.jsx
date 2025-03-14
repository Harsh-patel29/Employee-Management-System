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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { markAttendance } from "../feature/attendancefetch/attendanceSlice.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "../Components/components/ui/sheet";
import { Button } from "../Components/components/ui/button";
import axios from "axios";

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hours, minutes, seconds] = timeString.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(
    2,
    "0"
  )}:${seconds.padStart(2, "0")}`;
};

function Row({ row }) {
  const [open, setOpen] = React.useState(false);
  const theme = useSelector((state) => state.theme.theme);
  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: theme === "light" ? "white" : "#161b22",
          color: theme === "light" ? "black" : "#f8f9fa",
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowUpIcon
                sx={{ color: theme === "light" ? "black" : "#f8f9fa" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ color: theme === "light" ? "black" : "#f8f9fa" }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "inherit" }}>
          {row.index}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "inherit" }}>
          {row.Image}
        </TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.User}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Date}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.AttendAt}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.TimeOut}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.formattedLogHours}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Location}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={10}
          sx={{
            backgroundColor: theme === "light" ? "white" : "#161b22",
            color: theme === "light" ? "black" : "#f8f9fa",
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  paddingLeft: "0.5rem",
                }}
              >
                Additional Attendances
              </Typography>
              <Table size="medium">
                <TableHead
                  sx={{
                    backgroundColor: theme === "light" ? "#bfdbfe" : "#374151",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      Image
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      User
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      Time In
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      Time Out
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      Log Hours
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                      Regularization
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.otherAttendances?.map((attendance, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          theme === "light" ? "white" : "#161b22",
                        color: theme === "light" ? "black" : "#f8f9fa",
                      }}
                    >
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        <img
                          src={attendance.Image}
                          alt="Attendance"
                          className="w-12 h-12 object-cover rounded-3xl"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        {attendance.User}
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        {new Date(attendance.AttendAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        {new Date(attendance.AttendAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        {attendance.TimeOut
                          ? new Date(attendance.TimeOut).toLocaleTimeString()
                          : new Date(attendance.AttendAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        {formatTime(attendance.LogHours)}
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        {attendance.Location || "N/A"}
                      </TableCell>
                      <TableCell sx={{ color: "inherit", padding: "16px" }}>
                        N/A
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
  const [openSheet, setOpenSheet] = React.useState(false);
  const [attendances, setattendances] = React.useState([]);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const { attendance, loading, error } = useSelector(
    (state) => state.markAttendance
  );

  const theme = useSelector((state) => state.theme.theme);

  React.useEffect(() => {
    if (openSheet) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing camera:", error));
    } else {
      if (videoRef.current?.srcObject) {
        let stream = videoRef.current.srcObject;
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  }, [openSheet]);

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

    const file = new File([blob], "attendance.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("attendance", file);

    dispatch(markAttendance(formData));
  };

  React.useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v2/attendance/attendanceDetail",
          { withCredentials: true }
        );
        setattendances(res.data.message);

        return res.data;
      } catch (error) {
        console.log(error);
      }
    }
    fetchAttendance();
  }, []);

  return loading ? (
    <div>Loading....</div>
  ) : (
    <>
      <div className="inline-flex justify-between w-full pb-3 mt-2 ">
        <div className="text-3xl flex ml-2">Attendance</div>
        <div className="text-3xl flex gap-10">
          <button
            className="bg-[#bfdbfe] cursor-pointer rounded-lg w-35 text-xl mr-8"
            onClick={() => setOpenSheet(true)}
          >
            Attendance
          </button>
        </div>
      </div>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="min-w-xl">
          <SheetHeader>
            <SheetTitle>Attendance</SheetTitle>
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
          backgroundColor: theme === "light" ? "white" : "#111827",
          color: theme === "light" ? "black" : "#8a94a7",
          maxHeight: 400,
        }}
      >
        <Table aria-label="collapsible table ">
          <TableHead
            sx={{ backgroundColor: theme === "light" ? "#bfdbfe" : "#374151" }}
          >
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Image
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                User
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Time In
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Time Out
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Log Hours
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Location
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Regularization
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(
              attendances.reduce((acc, attendance) => {
                if (!acc[attendance.User]) {
                  acc[attendance.User] = {
                    first: attendance,
                    others: [],
                  };
                } else {
                  acc[attendance.User].others.push(attendance);
                }
                return acc;
              }, {})
            ).map(({ first, others }, index) => (
              <Row
                key={first._id}
                row={{
                  index: index + 1,
                  Image: (
                    <img
                      src={first.Image}
                      alt="Attendance"
                      className="w-12 h-12 object-cover rounded-3xl"
                    />
                  ),
                  User: first.User,
                  Date: new Date(first.AttendAt).toLocaleDateString(),
                  AttendAt: new Date(first.AttendAt).toLocaleTimeString(),
                  TimeOut: first.TimeOut
                    ? new Date(first.TimeOut).toLocaleTimeString()
                    : new Date(first.AttendAt).toLocaleTimeString(),
                  formattedLogHours: formatTime(first.LogHours),
                  Location: first.Location || "N/A",
                  otherAttendances: others,
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
