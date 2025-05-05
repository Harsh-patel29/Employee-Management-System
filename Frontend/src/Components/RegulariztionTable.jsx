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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  GetRegularization,
  ApprovedRegularization,
  RejectRegularization,
  resetRegularization,
} from '../feature/attendancefetch/attendanceSlice.js';

import { Bounce, toast } from 'react-toastify';

function Row({ row, openDialog }) {
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
        <TableCell>{row.User.Name}</TableCell>
        <TableCell>{row.Date}</TableCell>
        <TableCell>{row.MissingPunch}</TableCell>
        <TableCell>{row.Reason}</TableCell>
        <TableCell>{row.Remarks}</TableCell>

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
                    Are you sure? You want to approve this Regularization
                    <Button
                      onClick={(id) => {
                        dispatch(ApprovedRegularization(row._id));
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
                    Are you sure? You want to Reject this Regularization
                    <Button
                      onClick={() => {
                        dispatch(RejectRegularization(row._id));
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

const RegularizationTable = () => {
  const {
    fetchedRegularization,
    error,
    approvedRegularization,
    rejectedRegularization,
  } = useSelector((state) => state.markAttendance);
  const [Regularization, setRegularization] = React.useState([]);
  const [dialogOpen, setdialogOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(GetRegularization());
  }, []);

  React.useEffect(() => {
    if (fetchedRegularization?.message) {
      setRegularization(fetchedRegularization?.message);
    }
  }, [fetchedRegularization]);

  const filteredRegularization = Regularization.filter(
    (item) => item.Status === 'Pending'
  );

  const openDialog = () => {
    setTimeout(() => {
      setdialogOpen(true);
    }, 0);
  };

  React.useEffect(() => {
    if (approvedRegularization?.success) {
      toast.success('Regularization approved Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(GetRegularization());
      dispatch(resetRegularization());
    }
  }, [approvedRegularization]);

  React.useEffect(() => {
    if (rejectedRegularization?.success) {
      toast.success('Regularization rejected Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(GetRegularization());
      dispatch(resetRegularization());
    }
  }, [rejectedRegularization]);

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
    }
  }, [error]);

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'User', headerName: 'User' },
    { field: 'Date', headerName: 'Date' },
    { field: 'PunchTime', headerName: 'Punch Time' },
    { field: 'Reason', headerName: 'Reason' },
    { field: 'Remarks', headerName: 'Remarks' },
    { field: 'Action', headerName: 'Action' },
  ];

  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Regularization
        </h5>
      </div>
      <ReusableTable
        width="full"
        columns={columns}
        data={filteredRegularization}
        RowComponent={Row}
        pagination={true}
        rowProps={{ openDialog, navigate }}
      />
    </>
  );
};

export default RegularizationTable;
