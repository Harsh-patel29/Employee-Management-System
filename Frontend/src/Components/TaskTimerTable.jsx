import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog.tsx';
import { Button } from './components/ui/button.tsx';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import ReusableTable from './ReusableTable.jsx';
import {
  getAllTaskTimer,
  deleteTaskTimer,
  resetAllTaskTimer,
} from '../feature/tasktimerfetch/tasktimerslice.js';
import TaskTimerFilterSheet from './TaskTimerFilter.jsx';

function Row({ row, openDialog }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <React.Fragment>
      {row.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length}>
            there are no records to display
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell>{row.index}</TableCell>
          <TableCell>{row.TaskId}</TableCell>
          <TableCell>{row.User}</TableCell>
          <TableCell>{row.StartTime}</TableCell>
          <TableCell>{row.EndTime}</TableCell>
          <TableCell>{row.Duration}</TableCell>
          <TableCell>{row.Message}</TableCell>
          <TableCell>
            <div className="flex justify-center">
              {user.permission.taskTimer.canDeleteTaskTimer && (
                <Dialog>
                  <DialogTrigger
                    onClick={() => {
                      openDialog(row._id);
                    }}
                    asChild
                  >
                    <MdDelete className="font-semibold text-lg text-[#ff3b30] cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the task timer.
                        <Button
                          className="flex w-full mt-4 bg-red-600 hover:bg-red-800 cursor-pointer"
                          onClick={() => {
                            dispatch(deleteTaskTimer({ data: row._id }));
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
      )}
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    TaskId: PropTypes.string,
    User: PropTypes.string,
    StartTime: PropTypes.string,
    EndTime: PropTypes.string,
    Duration: PropTypes.string,
    Message: PropTypes.string,
    Action: PropTypes.string,
  }).isRequired,
};

export default function TaskTimerTable() {
  const dispatch = useDispatch();
  const { allTaskTimer, createdTaskTimer, updatedTaskTimer, deletedTaskTimer } =
    useSelector((state) => state.tasktimer);
  const [taskTimer, setTaskTimer] = React.useState([]);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const filterValue = useSelector(
    (state) => state.filter.filterValue.TaskTimerTable
  );

  React.useEffect(() => {
    dispatch(getAllTaskTimer());
  }, [dispatch]);

  React.useEffect(() => {
    if (allTaskTimer?.message) {
      setTaskTimer(allTaskTimer.message);
    }
  }, [allTaskTimer]);

  const openDialog = (id) => {
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  const extractDateFromDisplay = (displayDateStr) => {
    if (displayDateStr === null) return;
    const [datePart] = displayDateStr.split(',');
    const [day, month, year] = datePart.split('/');
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return isoDate;
  };

  const filteredData = allTaskTimer?.message?.filter((item) => {
    const itemDate = new Date(extractDateFromDisplay(item.StartTime));
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

  React.useEffect(() => {
    if (createdTaskTimer?.success) {
      dispatch(getAllTaskTimer());
      dispatch(resetAllTaskTimer());
    }
  }, [createdTaskTimer]);

  React.useEffect(() => {
    if (updatedTaskTimer?.success) {
      dispatch(getAllTaskTimer());
      dispatch(resetAllTaskTimer());
    }
  }, [updatedTaskTimer]);

  React.useEffect(() => {
    if (deletedTaskTimer?.success) {
      toast.success('Task Timer Deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getAllTaskTimer());
    }
  }, [deletedTaskTimer]);

  const columns = [
    { field: 'Index', headerName: '#' },
    { field: 'Task', headerName: 'Task' },
    { field: 'User', headerName: 'User' },
    { field: 'StartTime', headerName: 'StartTime' },
    { field: 'EndTime', headerName: 'EndTime' },
    { field: 'Duration', headerName: 'Duration' },
    { field: 'Message', headerName: 'Message' },
    { field: 'Action', headerName: 'Action' },
  ];
  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 ">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Task Timer
        </h5>
        <TaskTimerFilterSheet screen="TaskTimerTable" />
      </div>
      <ReusableTable
        width="full"
        columns={columns}
        RowComponent={Row}
        data={filteredData}
        pagination={true}
        rowProps={{ openDialog }}
        tableStyle={{
          '& .MuiTableCell-root': {
            padding: 1,
            textAlign: 'center',
          },
        }}
      />
    </>
  );
}
