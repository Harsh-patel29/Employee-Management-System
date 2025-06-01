import React from 'react';
import ReusableTable from '../Components/ReusableTable.jsx';
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
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { Button } from '../Components/components/ui/button';
import LeaveForm from './LeaveForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createLeave,
  getAllLeave,
  resetError,
  rejectLeave,
  approveLeave,
  resetApprovedLeave,
  resetRejectedLeave,
  deleteLeave,
} from '../feature/leavefetch/createleaveSlice';
import { Bounce, toast } from 'react-toastify';
import { AlignJustify } from 'lucide-react';
import LeaveFilterSheet from './LeaveFilterSheet.jsx';

function Row({ row, openDialog, navigate }) {
  const dispatch = useDispatch();

  const [dialogOpen, setdialogOpen] = React.useState(false);
  const [rejectDialogOpen, setrejectDialogOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <TableCell>{row.index}</TableCell>
        <TableCell>{row.EMPCODE}</TableCell>
        <TableCell>{row.userName}</TableCell>
        <TableCell>{row.Leave_Reason}</TableCell>
        <TableCell>{row.LEAVE_TYPE}</TableCell>
        <TableCell>{row.Start_Date}</TableCell>
        <TableCell>{row.End_Date}</TableCell>
        <TableCell>{row.Days}</TableCell>
        <TableCell>
          <div>
            <Dialog open={dialogOpen} onOpenChange={setdialogOpen}>
              <DialogTrigger
                onClick={() => {
                  openDialog(row._id);
                }}
                asChild
              >
                <Button className="px-4 mr-2 py-2 cursor-pointer bg-transparent hover:bg-emerald-600 hover:text-white border border-emerald-500 text-emerald-500 font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter]">
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone.Once approved, the leave can't
                    be rejected.
                    <Button
                      onClick={() => {
                        dispatch(approveLeave(row._id));
                        setdialogOpen(false);
                      }}
                      className=" flex mt-3 w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 hover:text-white border border-emerald-500 text-white font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter] cursor-pointer"
                    >
                      Approve
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog open={rejectDialogOpen} onOpenChange={setrejectDialogOpen}>
              <DialogTrigger
                onClick={() => {
                  openDialog(row._id);
                }}
                asChild
              >
                <Button className="px-4 py-2 cursor-pointer bg-transperant hover:bg-red-700 hover:text-white border border-red-500 text-red-600 font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter] ">
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone.Once rejected, the leave can't
                    be approved.
                    <Button
                      onClick={() => {
                        dispatch(rejectLeave(row._id));
                        setrejectDialogOpen(false);
                      }}
                      className="flex mt-3 w-full px-4 py-2 bg-red-500 hover:bg-red-600 hover:text-white border border-red-500 text-white font-medium rounded-md transition-colors duration-200 shadow-none font-[sans-serif,Inter] cursor-pointer"
                    >
                      Reject
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const LeaveApproveTable = () => {
  const { allLeave, error, approvedLeave, rejectedLeave } = useSelector(
    (state) => state.leave
  );
  const filterValue = useSelector(
    (state) => state.filter.filterValue.ApproveLeave
  );
  const [Leave, setLeave] = React.useState([]);
  const [sheetopen, setsheetopen] = React.useState(false);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getAllLeave());
  }, []);

  React.useEffect(() => {
    if (allLeave?.message) {
      setLeave(allLeave?.message);
    }
  }, [allLeave]);

  const LeavetoBeDisplayed = Leave.filter((leave) => {
    return leave.Status === 'Pending';
  });

  const openDialog = () => {
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  const filteredData = LeavetoBeDisplayed.filter((item) => {
    const itemDate = new Date(item.Start_Date);

    if (
      filterValue === undefined ||
      filterValue === null ||
      Object?.keys(filterValue).length === 0
    )
      return true;
    const UserMatch = !filterValue.User || item.userName === filterValue.User;
    const LeaveStatusMatch =
      !filterValue.Status || item.Status === filterValue.Status;
    const startDate = filterValue.Start_Date
      ? new Date(filterValue.Start_Date)
      : null;
    const endDate = filterValue.End_Date
      ? new Date(filterValue.End_Date)
      : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const dateRangeMatch =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);
    return UserMatch && LeaveStatusMatch && dateRangeMatch;
  });

  React.useEffect(() => {
    if (approvedLeave?.success) {
      toast.success('Leave approved Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getAllLeave());
      dispatch(resetApprovedLeave());
    }
  }, [approvedLeave]);

  React.useEffect(() => {
    if (rejectedLeave?.success) {
      toast.success('Leave rejected Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getAllLeave());
      dispatch(resetRejectedLeave());
    }
  }, [rejectedLeave]);

  React.useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message || error.message || error;
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      dispatch(resetError());
    }
  }, [error]);

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'EMPCODE', headerName: 'EMP CODE' },
    { field: 'userName', headerName: 'User Name' },
    { field: 'Leave_Reason', headerName: 'Leave Reason' },
    { field: 'LEAVE_TYPE', headerName: 'Leave Type' },
    { field: 'Start_Date', headerName: 'Start Date' },
    { field: 'End_Date', headerName: 'End Date' },
    { field: 'Days', headerName: 'Days' },
    { field: 'Action', headerName: 'Action' },
  ];

  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Pending Leave
        </h5>
        <div className="flex items-center">
          <LeaveFilterSheet screen="ApproveLeave" />
        </div>
      </div>
      <ReusableTable
        width="full"
        columns={columns}
        data={filteredData}
        RowComponent={Row}
        pagination={true}
        rowProps={{ openDialog, navigate }}
      />
    </>
  );
};

export default LeaveApproveTable;
