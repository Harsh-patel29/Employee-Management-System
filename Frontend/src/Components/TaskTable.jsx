import * as React from "react";
import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
import { useSelector, useDispatch } from "react-redux";
import {
  createTask,
  getAllTasks,
} from "../feature/taskfetch/taskfetchSlice.js";
import ReusableTable from "./ReusableTable";

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
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    CODE: PropTypes.string,
    title: PropTypes.string,
    StartDate: PropTypes.string,
    EndDate: PropTypes.string,
    Project: PropTypes.string,
    Totatime: PropTypes.string,
    createdBy: PropTypes.string,
    Status: PropTypes.string,
    Asignee: PropTypes.string,
  }).isRequired,
};

export default function TaskTable() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const columns = [
    { field: "index", headerName: "#" },
    { field: "CODE", headerName: "Code" },
    { field: "title", headerName: "Task" },
    { field: "StartDate", headerName: "Start Date" },
    { field: "EndDate", headerName: "End Date" },
    { field: "Project", headerName: "Project" },
    { field: "Totatime", headerName: "Total Time" },
    { field: "createdBy", headerName: "Created By" },
    { field: "Status", headerName: "Status" },
    { field: "Asignee", headerName: "Asignee" },
    { field: "action", headerName: "Update" },
  ];

  return (
  <>
  <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Tasks
        </h5>
        <div className="flex items-center">
          <button
            className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[160px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff]  transition-all duration-300"
            onClick={() => navigate("/users/roles")}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#338DB5"
              viewBox="0 0 24 24"
              style={{ fontSize: "var(--THEME-ICON-SIZE)" }}
            >
              <title>Manage User</title>
              <path
                fill-rule="evenodd"
                d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Zm.406 3.578.016.016c.354.358.574.85.578 1.392v.028a2 2 0 0 1-3.409 1.406l-.01-.012a2 2 0 0 1 2.826-2.83ZM5 8a4 4 0 1 1 7.938.703 7.029 7.029 0 0 0-3.235 3.235A4 4 0 0 1 5 8Zm4.29 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h6.101A6.979 6.979 0 0 1 9 15c0-.695.101-1.366.29-2Z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Manage Users
          </button>
        </div>
      </div>
      <ReusableTable
        columns={columns}
        data={Tasks}
        RowComponent={Row}
        pagination={true}
      />
    </>
  );
}
