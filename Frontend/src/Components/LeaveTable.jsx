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
import { Button } from '../Components/components/ui/button';
import LeaveForm from './LeaveForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createLeave,
  getAllLeave,
  resetError,
  resetLeave,
  deleteLeave,
  getLeaveById,
  updateLeave,
} from '../feature/leavefetch/createleaveSlice';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { Bounce, toast } from 'react-toastify';
import LeaveFilterSheet from './LeaveFilterSheet.jsx';

function Row({ row, openDialog, navigate, openSheet }) {
  const { updatedLeave } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  React.useEffect(() => {
    if (updatedLeave?.success) {
      setupdatesheetopen(false);
    }
  }, [updatedLeave]);
  const dispatch = useDispatch();
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
        <TableCell>{row.Status}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2 justify-center">
            {user?.permission.leave.canUpdateLeave && (
              <Sheet
                open={updatesheetopen}
                onOpenChange={(open) => {
                  setupdatesheetopen(open);
                  if (!open) {
                    navigate('/leave');
                  }
                }}
              >
                <SheetTrigger
                  onClick={() => {
                    openSheet(row._id);
                  }}
                  asChild
                >
                  <FaEdit className="font-[200] text-lg cursor-pointer" />
                </SheetTrigger>
                <SheetContent className="min-w-2xl">
                  <SheetHeader>
                    <SheetDescription>
                      <LeaveForm
                        onSubmit={(data) => {
                          dispatch(updateLeave({ data, id: row._id }));
                        }}
                        mode="update"
                        id={row._id}
                      />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}
            {user?.permission.leave.canDeleteLeave && (
              <Dialog
                onOpenChange={(open) => {
                  if (!open) navigate('/leave');
                }}
              >
                <DialogTrigger
                  onClick={() => {
                    openDialog(row._id);
                  }}
                  asChild
                >
                  <MdDelete className="font-[200] text-lg text-[#ff3b30] cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the leave.
                      <Button
                        className="flex w-full mt-4 bg-red-600 hover:bg-red-800 cursor-pointer"
                        onClick={() => {
                          dispatch(deleteLeave({ data: row._id }));
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

const LeaveTable = () => {
  const { allLeave, error, leave, deletedLeave, updatedLeave } = useSelector(
    (state) => state.leave
  );
  const { user } = useSelector((state) => state.auth);

  const filterValue = useSelector((state) => state.filter.filterValue.Leave);
  const [Leave, setLeave] = React.useState([]);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [sheetopen, setsheetopen] = React.useState(false);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getAllLeave());
  }, [dispatch]);

  React.useEffect(() => {
    if (allLeave?.message) {
      setLeave(allLeave?.message);
    }
  }, [allLeave]);

  const filteredData = Leave.filter((item) => {
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

  const openSheet = (id) => {
    navigate(`/leave`);
    dispatch(getLeaveById(id));
    setTimeout(() => {
      setupdatesheetopen(true);
    }, 0);
  };

  const openDialog = () => {
    navigate(`/leave`);
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  React.useEffect(() => {
    if (leave?.success) {
      toast.success('Leave created Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setsheetopen(false);
      dispatch(getAllLeave());
      dispatch(resetLeave());
    }
  }, [leave]);

  React.useEffect(() => {
    if (updatedLeave?.success) {
      toast.success('Leave updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getAllLeave());
      dispatch(resetLeave());
    }
  }, [updatedLeave]);

  React.useEffect(() => {
    if (deletedLeave?.success) {
      toast.success('Leave deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getAllLeave());
      dispatch(resetLeave());
    }
  }, [deletedLeave]);

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
    { field: 'EMP_CODE', headerName: 'EMP CODE' },
    { field: 'Name', headerName: 'User Name' },
    { field: 'Leave_Reason', headerName: 'Leave Reason' },
    { field: 'LEAVE_TYPE', headerName: 'Leave Type' },
    { field: 'Start_Date', headerName: 'Start Date' },
    { field: 'End_Date', headerName: 'End Date' },
    { field: 'Days', headerName: 'Days' },
    { field: 'Status', headerName: 'Status' },
    { field: 'Action', headerName: 'Action' },
  ];

  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Leave
        </h5>
        <div className="flex items-center">
          {user?.permission.leave.canAddLeave && (
            <Sheet open={sheetopen} onOpenChange={setsheetopen}>
              <SheetTrigger>
                <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[130px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
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
                  Leave
                </div>
              </SheetTrigger>
              <SheetContent
                showCloseButton={false}
                className="bg-white min-w-xl"
              >
                <SheetHeader>
                  <SheetDescription>
                    <LeaveForm
                      onSubmit={(data) => {
                        dispatch(createLeave(data));
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          )}
          <button>
            <LeaveFilterSheet screen="Leave" />
          </button>
        </div>
      </div>
      <ReusableTable
        width="full"
        columns={columns}
        data={filteredData}
        RowComponent={Row}
        pagination={true}
        rowProps={{ openDialog, openSheet, navigate }}
        tableStyle={{
          '& .MuiTableCell-root': {
            padding: 1,
            textAlign: 'center',
          },
        }}
      />
    </>
  );
};

export default LeaveTable;
