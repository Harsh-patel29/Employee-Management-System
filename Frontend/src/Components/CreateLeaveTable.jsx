import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from './components/ui/sheet.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog.tsx';
import { Button } from './components/ui/button.tsx';
import { useNavigate } from 'react-router';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { Bounce, toast } from 'react-toastify';
import ReusableTable from './ReusableTable.jsx';
import CreateLeaveForm from './CreateLeaveForm.jsx';
import {
  createNewLeave,
  getCreatedLeave,
  updateCreatedLeave,
  getCreatedLeaveById,
  resetNewLeave,
  resetUpdatedNewLeave,
  deleteCreatedLeave,
  resetDeletedCreatedLeave,
  resetError,
} from '../feature/leavefetch/createleaveSlice';
function Row({ row, openSheet, openDialog, navigate }) {
  const dispatch = useDispatch();
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.Leave_Reason}</TableCell>
        <TableCell>{row.Leave_Code}</TableCell>
        <TableCell>
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
              <SheetContent className="bg-white min-w-xl">
                <SheetHeader>
                  <SheetDescription>
                    <CreateLeaveForm
                      mode="update"
                      onSubmit={(data) => {
                        dispatch(updateCreatedLeave({ data, id: row._id }));
                        setupdatesheetopen(false);
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          }
        </TableCell>
        <TableCell>
          <Dialog>
            <DialogTrigger
              onClick={() => {
                openDialog(row._id);
              }}
              asChild
            >
              <MdDelete className="font-[200] text-lg text-[#ff3b30]" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  leave.
                  <Button
                    className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                    onClick={() => {
                      dispatch(deleteCreatedLeave({ data: row._id }));
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
    name: PropTypes.string,
    code: PropTypes.string,
  }).isRequired,
};

export default function CreateLeaveTable() {
  const dispatch = useDispatch();
  const {
    createdLeaves,
    newLeave,
    updatedNewLeave,
    deletedCreatedLeave,
    error,
  } = useSelector((state) => state.leave);
  const [sheetopen, setsheetopen] = React.useState(false);
  const [leave, setleave] = React.useState([]);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    dispatch(getCreatedLeave());
  }, [dispatch]);

  React.useEffect(() => {
    if (createdLeaves?.message) {
      setleave(createdLeaves?.message);
    }
  }, [createdLeaves]);

  React.useEffect(() => {
    if (newLeave?.success) {
      toast.success('Leave created Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setsheetopen(false);
      dispatch(getCreatedLeave());
      dispatch(resetNewLeave());
    }
  }, [newLeave]);

  React.useEffect(() => {
    if (updatedNewLeave?.success) {
      toast.success('Leave updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getCreatedLeave());
      dispatch(resetUpdatedNewLeave());
    }
  }, [updatedNewLeave]);

  React.useEffect(() => {
    if (deletedCreatedLeave?.success) {
      toast.success('Leave deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getCreatedLeave());
      dispatch(resetDeletedCreatedLeave());
    }
  }, [deletedCreatedLeave]);

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

  const openSheet = (id) => {
    setTimeout(() => {
      setupdatesheetopen(true);
    }, 0);
    dispatch(getCreatedLeaveById(id));
  };

  const openDialog = (id) => {
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  const columns = [
    { field: 'Leave_Reason', headerName: 'Leave Reason' },
    { field: 'Leave_Code', headerName: 'Leave Code' },
    { field: 'Action', headerName: 'Action' },
    { field: 'Delete', headerName: 'Delete' },
  ];

  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Leave Type
        </h5>
        <div className="flex items-center">
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger>
              <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[160px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
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
                New Leave
              </div>
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="bg-white min-w-xl">
              <SheetHeader>
                <SheetDescription>
                  <CreateLeaveForm
                    onSubmit={(data) => {
                      dispatch(createNewLeave(data));
                    }}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ReusableTable
        columns={columns}
        data={leave}
        RowComponent={Row}
        pagination={true}
        rowProps={{
          openSheet,
          openDialog,
          navigate,
        }}
      />
    </>
  );
}
