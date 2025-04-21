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
function Row({ row, openDialog }) {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.TaskId}</TableCell>
        <TableCell>{row.User}</TableCell>
        <TableCell>{row.StartTime}</TableCell>
        <TableCell>{row.EndTime}</TableCell>
        <TableCell>{row.Duration}</TableCell>
        <TableCell>{row.Message}</TableCell>
        <TableCell>
          <Dialog>
            <DialogTrigger
              onClick={() => {
                openDialog(row._id);
              }}
              asChild
            >
              <MdDelete className="font-semibold text-lg text-[#ff3b30]" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  task timer.
                  <Button
                    className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
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
        </TableCell>
      </TableRow>
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

  React.useEffect(() => {
    if (createdTaskTimer?.success) {
      console.log('skjdf');

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
      </div>
      <ReusableTable
        columns={columns}
        RowComponent={Row}
        data={taskTimer}
        pagination={true}
        rowProps={{ openDialog }}
      />
    </>
  );
}
