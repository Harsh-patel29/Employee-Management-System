import * as React from "react";
import axios from "axios";
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
import { useNavigate, useParams } from "react-router";
import { FaEdit } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../Components/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/components/ui/dialog";
import AdminForm from "./AdminForm";
import { MdDelete } from "react-icons/md";
import { Button } from "../Components/components/ui/button.tsx";
import { Bounce, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { deleteuser } from "../feature/createuserfetch/createuserSlice.js";
import { updateuser } from "../feature/createuserfetch/createuserSlice.js";
import TablePagination from "@mui/material/TablePagination";
import {
  createTask,
  getAllTasks,
} from "../feature/taskfetch/taskfetchSlice.js";
function Row({ row }) {
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);

  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: theme === "light" ? "white" : "#161b22",
          color: theme === "light" ? "black" : "#f8f9fa",
        }}
      >
        <TableCell component="th" scope="row" sx={{ color: "inherit" }}>
          {row.index}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "inherit" }}>
          {row.CODE}
        </TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.title}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.StartDate}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.EndDate}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Project}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Totatime}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.createdBy}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Status}</TableCell>
        <TableCell sx={{ color: "inherit" }}>{row.Asignee}</TableCell>
        <TableCell sx={{ color: "inherit" }}>
          {
            <Sheet open={updatesheetopen} onOpenChange={setupdatesheetopen}>
              <SheetTrigger
                onClick={() => {
                  openSheet(row._id);
                }}
                asChild
              >
                <FaEdit className="font-semibold text-lg" />
              </SheetTrigger>
              <SheetContent
                className={`${theme === "light" ? "bg-white " : "bg-[#121212]"} 
                min-w-6xl`}
              >
                <SheetHeader>
                  <SheetDescription>
                    <AdminForm
                      mode="update"
                      onSubmit={(data) => {
                        dispatch(updateuser({ data, userid: row._id }));
                        setupdatesheetopen(false);
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          }
        </TableCell>
        <TableCell sx={{ color: "#ff3b30" }} className="flex">
          <Dialog
            onOpenChange={(open) => {
              if (!open) navigate("/users");
            }}
          >
            <DialogTrigger
              onClick={() => {
                openDialog(row._id);
              }}
              asChild
            >
              <MdDelete className="font-semibold text-lg" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  user's account and remove their data from servers.
                  <Button
                    className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                    onClick={() => {
                      dispatch(deleteuser(row._id));
                      navigate("/users");
                    }}
                  >
                    Delete
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    Code: PropTypes.number,
    Task: PropTypes.string,
    StartDate: PropTypes.string,
    EndDate: PropTypes.string,
    Project: PropTypes.string,
    TotalTime: PropTypes.string,
    createdBy: PropTypes.string,
    Status: PropTypes.string,
    Asignee: PropTypes.string,
  }).isRequired,
};

export default function CollapsibleTable() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const [Tasks, setTasks] = React.useState([]);
  const [taskid, settaskid] = React.useState();
  const { tasks, createtask } = useSelector((state) => state.task);

  React.useEffect(() => {
    dispatch(getAllTasks());
  }, []);

  React.useEffect(() => {
    if (tasks?.message) {
      setTasks(tasks.message);
    } else {
      setTasks([]);
    }
  }, [tasks]);

  React.useEffect(() => {
    if (createtask?.message?.CODE) {
      setTimeout(() => {
        settaskid(createtask?.message?.CODE);
      }, 0);
    }
  }, [createtask?.message?.CODE]);

  React.useEffect(() => {
    if (createtask?.success === true && createtask?.message?.CODE) {
      navigate(`/productivity/tasks/${createtask.message.CODE}`);
      settaskid(createtask.message.CODE);
      dispatch(getAllTasks());
    }
  }, [createtask]);

  React.useEffect(() => {
    if (!id) {
      navigate("/productivity/tasks");
    }
  }, [id, navigate]);

  React.useEffect(() => {
    if (!id) {
      settaskid(null);
      dispatch(getAllTasks());
    }
  }, [id, dispatch]);

  const handleCreateTask = () => {
    dispatch(createTask());
  };

  console.log(createtask?.message?.CODE);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTasks = Tasks?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const theme = useSelector((state) => state.theme.theme);

  return (
    <>
      <div className="inline-flex justify-between w-full pb-3 mt-2 ">
        <div className="text-3xl flex ml-2">Tasks</div>
        <div className="text-3xl flex gap-10">
          <button
            className="bg-[#bfdbfe] cursor-pointer rounded-lg w-35 text-lg"
            onClick={() => handleCreateTask()}
          >
            + Tasks
          </button>
          {/* <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger
              className={`${
                theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-700"
              } 
              ${
                canAddUser
                  ? "h-10 w-10 rounded-3xl justify-center flex"
                  : "hidden"
              }
              `}
            >
              +
            </SheetTrigger>
            <SheetContent
              className={`${theme === "light" ? "bg-white " : "bg-[#121212]"} 
              min-w-6xl`}
            >
              <SheetHeader>
                <SheetDescription>
                  <AdminForm
                    mode="create"
                    onSubmit={(data) => dispatch(createuser(data))}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet> */}
        </div>
      </div>

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
        <Table aria-label="collapsible table"   sx={{
            "& .MuiTableCell-root": {
              padding: 0.5,
            },
          }}>
          <TableHead
           sx={{ backgroundColor: "#c1dde9" }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Code
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Task
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                End Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Project
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Total Time
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Created By
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Asignee
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Update
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "medium" }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTasks?.map((task, index) => (
              <Row
                key={task._id}
                row={{ ...task, index: page * rowsPerPage + index + 1 }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="flex w-full justify-center"
        component="div"
        count={Tasks?.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
