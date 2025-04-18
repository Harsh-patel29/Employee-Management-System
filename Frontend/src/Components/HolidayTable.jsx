import React from 'react';
import PropTypes from 'prop-types';
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import {
  fetchHoliday,
  createHoliday,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
  resetDeletedHoliday,
  resetHoliday,
  resetHolidayById,
} from '../feature/hoildayfetch/hoildaySlice.js';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import HolidayForm from './HolidayForm.jsx';
function Row({ row, openDialog, openSheet }) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.index}</TableCell>
        <TableCell>{row.holiday_name}</TableCell>
        <TableCell>{row.Start_Date}</TableCell>
        <TableCell>{row.End_Date}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Sheet open={updatesheetopen} onOpenChange={setupdatesheetopen}>
              <SheetTrigger
                onClick={() => {
                  openSheet(row._id);
                }}
                asChild
              >
                <FaEdit className="font-[200] text-lg" />
              </SheetTrigger>
              <SheetContent className="min-w-2xl">
                <SheetHeader>
                  <SheetDescription>
                    <HolidayForm
                      onSubmit={(data) => {
                        dispatch(updateHoliday({ data, id: row._id }));
                        setupdatesheetopen(false);
                      }}
                      mode="update"
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <div className="text-[#ff3b30]">
              <Dialog>
                <DialogTrigger
                  onClick={() => {
                    openDialog(row._id);
                  }}
                  asChild
                >
                  <MdDelete className="font-[200] text-lg" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      the holiday.
                      <Button
                        className="flex w-full mt-4 bg-red-600 hover:bg-red-800"
                        onClick={() => {
                          dispatch(deleteHoliday({ data: row._id }));
                          setDialogOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.prototype = {
  row: PropTypes.shape({
    index: PropTypes.number,
    holiday_name: PropTypes.string,
    Start_Date: PropTypes.string,
    End_Date: PropTypes.string,
  }).isRequired,
};

const HolidayTable = () => {
  const { allHoliday, createdholiday, updatedHoliday, deletedHoliday, error } =
    useSelector((state) => state.holiday);
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = React.useState(false);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [holiday, setholiday] = React.useState([]);

  React.useEffect(() => {
    dispatch(fetchHoliday());
  }, []);

  React.useEffect(() => {
    if (allHoliday?.message) {
      setholiday(allHoliday.message);
    }
  }, [allHoliday]);

  const openSheet = (id) => {
    dispatch(getHolidayById(id));
    setTimeout(() => {
      setupdatesheetopen(true);
    }, 0);
  };

  const openDialog = () => {
    setTimeout(() => {
      setDialogOpen(true);
    }, 0);
  };

  React.useEffect(() => {
    if (createdholiday?.success) {
      toast.success('Holiday created Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setsheetopen(false);
      dispatch(fetchHoliday());
      dispatch(resetHoliday());
    }
  }, [createdholiday]);

  React.useEffect(() => {
    if (updatedHoliday?.success) {
      toast.success('Holiday updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(fetchHoliday());
      dispatch(resetHoliday());
    }
  }, [updatedHoliday]);

  React.useEffect(() => {
    if (deletedHoliday?.success) {
      toast.success('Holiday deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(fetchHoliday());
      dispatch(resetDeletedHoliday());
    }
  }, [deletedHoliday]);

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'holiday_name', headerName: 'Holiday Name' },
    { field: 'Start_Date', headerName: 'Start Date' },
    { field: 'End_Date', headerName: 'End Date' },
    { field: 'Action', headerName: 'Action' },
  ];
  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Holiday
        </h5>
        <div className="flex items-center">
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
                Holiday
              </div>
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="bg-white min-w-xl">
              <SheetHeader>
                <SheetDescription>
                  <HolidayForm
                    onSubmit={(data) => {
                      dispatch(createHoliday(data));
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
        RowComponent={Row}
        data={holiday}
        rowProps={{ openSheet, openDialog }}
      />
    </>
  );
};

export default HolidayTable;
