import * as React from 'react';
import PropTypes, { number } from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate, useParams } from 'react-router';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Button } from '../Components/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '../Components/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Components/components/ui/dialog';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  createTask,
  getAllTasks,
  deleteTask,
} from '../feature/taskfetch/taskfetchSlice.js';
import ReusableTable from './ReusableTable';
import KanbanView from './KanbanView';
import TaskUpdateForm from './TaskForm.jsx';
import TasksFilterSheet from './TasksFilterSheet.jsx';

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    '0'
  );
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function Row({ row, openDialog, navigate }) {
  const { id } = useParams();
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const theme = useSelector((state) => state.theme.theme);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: theme === 'light' ? 'white' : '#161b22',
          color: theme === 'light' ? 'black' : '#f8f9fa',
        }}
      >
        <TableCell component="th" scope="row" sx={{ color: 'inherit' }}>
          {row.index}
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: 'inherit' }}>
          {user?.permission.task.canUpdateTask}
          <p
            className="text-[rgb(64,140,182)] cursor-pointer"
            onClick={() => {
              {
                user?.permission.task.canUpdateTask
                  ? navigate(`/productivity/tasks/${row.CODE}`)
                  : '';
              }
            }}
          >
            {row.CODE}
          </p>
        </TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.title}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.StartDate}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.EndDate}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.Project}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>
          {row.Totaltime === '00:00:00'
            ? formatDuration(0)
            : formatDuration(row.Totaltime)}
        </TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.createdBy}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.Status}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>{row.Asignee}</TableCell>
        <TableCell sx={{ color: 'inherit' }}>
          <div className="flex justify-center">
            {user?.permission.task.canUpdateTask && (
              <Sheet open={updatesheetopen} onOpenChange={setupdatesheetopen}>
                <SheetTrigger
                  onClick={() => {
                    openSheet(row._id);
                  }}
                  asChild
                >
                  <FaEdit
                    className="font-semibold text-lg cursor-pointer"
                    onClick={() => {
                      navigate(`/productivity/tasks/${row.CODE}`);
                    }}
                  />
                </SheetTrigger>
                <SheetContent
                  className={`${theme === 'light' ? 'bg-white ' : 'bg-[#121212]'} 
                  min-w-6xl`}
                >
                  <SheetHeader>
                    <SheetDescription>
                      <TaskUpdateForm
                        mode="update"
                        onSubmit={(data) => {
                          dispatch(updateTask(data));
                        }}
                      />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}
            {user?.permission.task.canDeleteTask && (
              <Dialog
                onOpenChange={(open) => {
                  if (!open) navigate('/productivity/tasks');
                }}
              >
                <DialogTrigger
                  onClick={() => {
                    openDialog(row.CODE);
                  }}
                  asChild
                >
                  <MdDelete className="font-semibold text-lg text-[#ff3b30] cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the task.
                      <Button
                        className="flex w-full mt-4 bg-red-600 hover:bg-red-800  cursor-pointer"
                        onClick={() => {
                          navigate('/productivity/tasks');
                          dispatch(deleteTask(row.CODE));
                        }}
                      >
                        Delete
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
    Totaltime: PropTypes.string,
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
  const [viewMode, setViewMode] = React.useState(() => {
    return localStorage.getItem('viewMode') || 'list';
  });
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const { user } = useSelector((state) => state.auth);
  const { tasks, createtask, deletedTask } = useSelector((state) => state.task);
  const filterValue = useSelector((state) => state.filter.filterValue.Task);

  React.useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const openDialog = (id) => {
    navigate(`/productivity/tasks/delete/${id}`);
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

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

  const filteredData = tasks?.message?.filter((item) => {
    const itemDate = new Date(item.StartDate);
    if (
      filterValue === undefined ||
      filterValue === null ||
      Object?.keys(filterValue).length === 0
    )
      return true;
    const asigneeMatch =
      !filterValue.Asignee || item.Asignee === filterValue.Asignee;
    const projectMatch =
      !filterValue.Project || item.Project === filterValue.Project;
    const taskMatch = !filterValue.Task || item.CODE === filterValue.Task;
    const startDate = filterValue.StartDate
      ? new Date(filterValue.StartDate)
      : null;
    const endDate = filterValue.EndDate ? new Date(filterValue.EndDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const dateRangeMatch =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);
    const statusMatch =
      !filterValue.Status || item.Status === filterValue.Status;
    return (
      asigneeMatch && projectMatch && taskMatch && dateRangeMatch && statusMatch
    );
  });

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
      navigate('/productivity/tasks');
    }
  }, [id, navigate]);

  React.useEffect(() => {
    if (deletedTask?.success === true) {
      setdialogOpen(false);
      toast.success('Task Deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate(`/productivity/tasks`, { replace: true });
      dispatch(getAllTasks());
    }
  }, [deletedTask, dispatch]);

  const handleCreateTask = () => {
    dispatch(createTask());
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'CODE', headerName: 'Code' },
    { field: 'title', headerName: 'Task' },
    { field: 'StartDate', headerName: 'Start Date' },
    { field: 'EndDate', headerName: 'End Date' },
    { field: 'Project', headerName: 'Project' },
    { field: 'Totaltime', headerName: 'Total Time' },
    { field: 'createdBy', headerName: 'Created By' },
    { field: 'Status', headerName: 'Status' },
    { field: 'Asignee', headerName: 'Asignee' },
    { field: 'Action', headerName: 'Action' },
  ];

  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif] flex items-center ml-2">
          Tasks
        </h5>
        <div className="flex items-center">
          {user?.permission.task.canAddTask && (
            <button
              className="bg-[#ffffff] text-[#338DB5] max-xs:ml-1 font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[100px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#338DB5] "
              onClick={() => handleCreateTask()}
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>New Task</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                ></path>
              </svg>
              Task
            </button>
          )}
          <TasksFilterSheet screen="Task" />
          <div className="flex max-xs:hidden">
            <button
              className={`${viewMode == 'list' ? 'bg-blue-100' : ''} bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[70px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#338DB5]  `}
              onClick={() => {
                handleViewChange('list');
                dispatch(getAllTasks());
              }}
            >
              <svg
                className="w-6 h-6 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>List View</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                ></path>
              </svg>
            </button>
            <button
              className={`${viewMode == 'board' ? 'bg-blue-100' : ''} bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[70px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#338DB5] `}
              onClick={() => handleViewChange('board')}
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>Board View</title>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                ></path>
              </svg>
            </button>
            <button
              className={`${viewMode == 'kanban' ? 'bg-blue-100' : ''} bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[70px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#338DB5] `}
              onClick={() => handleViewChange('kanban')}
            >
              <svg
                className="w-6 h-6"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Kanban View</title>
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h6v14H5zm14 0h-6v-7h6v7zm0-9h-6V5h6v5z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end min-xs:hidden">
        <button
          className={`${viewMode == 'list' ? 'bg-blue-100' : ''} bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[70px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#338DB5]  `}
          onClick={() => {
            handleViewChange('list');
            dispatch(getAllTasks());
          }}
        >
          <svg
            className="w-6 h-6 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>List View</title>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
            ></path>
          </svg>
        </button>
        <button
          className={`${viewMode == 'board' ? 'bg-blue-100' : ''} bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[70px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#338DB5] `}
          onClick={() => handleViewChange('board')}
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <title>Board View</title>
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
            ></path>
          </svg>
        </button>
        <button
          className={`${viewMode == 'kanban' ? 'bg-blue-100' : ''} bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[70px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#338DB5] `}
          onClick={() => handleViewChange('kanban')}
        >
          <svg
            className="w-6 h-6"
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Kanban View</title>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h6v14H5zm14 0h-6v-7h6v7zm0-9h-6V5h6v5z"></path>
          </svg>
        </button>
      </div>
      {viewMode === 'list' && (
        <ReusableTable
          width="full"
          columns={columns}
          data={filteredData}
          RowComponent={Row}
          rowProps={{ openDialog, navigate }}
          pagination={true}
          tableStyle={{
            '& .MuiTableCell-root': {
              padding: 0.9,
              textAlign: 'center',
            },
          }}
        />
      )}
      {viewMode === 'kanban' && <KanbanView viewType="kanban" />}
      {viewMode === 'board' && <KanbanView viewType="board" />}
    </>
  );
}
