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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../Components/components/ui/dialog';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button } from '../Components/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import {
  createWeekOff,
  getAllWeekOff,
  resetWeekOff,
  deleteWeekOff,
  getWeekOffById,
  updateWeekOff,
} from '../feature/weekofffetch/weekoffslice.js';
import WeekOffForm from './WeekOffForm.jsx';
import WeekOffFilterSheet from './WeekOffFilterSheet.jsx';
import { X } from 'lucide-react';
function Row({ row, openDialog, openSheet }) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const { updatedWeekOff } = useSelector((state) => state.weekoff);
  const { user } = useSelector((state) => state.auth);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell className="w-10">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <KeyboardArrowDownIcon sx={{ color: 'black' }} />
            ) : (
              <KeyboardArrowRightIcon sx={{ color: 'black' }} />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{row.index}</TableCell>
        <TableCell>{row.WeekOffName}</TableCell>
        <TableCell>{row.Effective_Date}</TableCell>
        <TableCell className="w-10">
          <div className="flex items-center gap-2 justify-center">
            {user?.permission.weekOff.canUpdateWeekoff && (
              <Sheet open={updatesheetopen} onOpenChange={setupdatesheetopen}>
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
                      <WeekOffForm
                        onSubmit={(data) => {
                          dispatch(updateWeekOff({ data, id: row._id }));
                          setupdatesheetopen(false);
                        }}
                        mode="update"
                      />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}
            {user.permission.weekOff.canDeleteWeekoff && (
              <div className="text-[#ff3b30] cursor-pointer">
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
                      <DialogTitle className="flex items-center justify-between">
                        Are you absolutely sure?
                        <DialogClose className="cursor-pointer">
                          {' '}
                          <X size={16} />
                        </DialogClose>
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the WeekOff.
                        <Button
                          className="flex w-full mt-4 bg-red-600 hover:bg-red-800 cursor-pointer"
                          onClick={() => {
                            dispatch(deleteWeekOff({ data: row._id }));
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
            )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={5}
          sx={{
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 2,
              }}
            >
              <TableContainer sx={{ borderRadius: 3 }} className="border ">
                <Table>
                  <TableHead
                    sx={{
                      backgroundColor: '#c1dde9',
                    }}
                  >
                    <TableRow
                      sx={{ borderRadius: 2 }}
                      className=" border-gray-200 border-2"
                    >
                      <TableCell className="border-2 border-gray-200">
                        Monday
                      </TableCell>
                      <TableCell className="border-2 border-gray-200">
                        TuesDay
                      </TableCell>
                      <TableCell className="border-2 border-gray-200">
                        WednesDay
                      </TableCell>
                      <TableCell className="border-2 border-gray-200">
                        ThursDay
                      </TableCell>
                      <TableCell className="border-2 border-gray-200">
                        Friday
                      </TableCell>
                      <TableCell className="border-2 border-gray-200">
                        Saturday
                      </TableCell>
                      <TableCell className="border-2 border-gray-200">
                        Sunday
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow className="border-2 border-gray-200">
                      {row?.days?.map((day, idx) => (
                        <TableCell
                          key={idx}
                          className="border-2 border-gray-200"
                        >
                          {day.type}
                          {day.weeks?.length > 0 && day.weeks.length !== 5 && (
                            <div
                              style={{ fontSize: '0.85rem', color: 'black' }}
                            >
                              ({day.weeks.join(', ')})
                            </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.prototype = {
  row: PropTypes.shape({
    WeekOffName: PropTypes.string,
    Effective_Date: PropTypes.string,
    days: PropTypes.array,
  }).isRequired,
};

export default function WeekOffTable() {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = React.useState(false);
  const [weekoff, setweekoff] = React.useState([]);
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { allWeekOff, createdWeekOff, deletedWeekOff, updatedWeekOff, error } =
    useSelector((state) => state.weekoff);
  const { user } = useSelector((state) => state.auth);
  const filterValue = useSelector((state) => state.filter.filterValue.WeekOff);

  React.useEffect(() => {
    dispatch(getAllWeekOff());
  }, []);

  React.useEffect(() => {
    if (allWeekOff?.message) {
      setweekoff(allWeekOff.message);
    }
  }, [allWeekOff]);

  const filteredData = weekoff.filter((item) => {
    const itemDate = new Date(item.Effective_Date);
    if (
      filterValue === undefined ||
      filterValue === null ||
      Object?.keys(filterValue).length === 0
    )
      return true;

    const startDate = filterValue.Effective_Date
      ? new Date(filterValue.Effective_Date)
      : null;
    const endDate = filterValue.toDate ? new Date(filterValue.toDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const dateRangeMatch =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);
    return dateRangeMatch;
  });

  const openSheet = (id) => {
    dispatch(getWeekOffById(id));
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
    if (createdWeekOff?.success) {
      toast.success('WeekOff created Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setsheetopen(false);
      dispatch(getAllWeekOff());
      dispatch(resetWeekOff());
    }
  }, [createdWeekOff]);

  React.useEffect(() => {
    if (updatedWeekOff?.success) {
      toast.success('WeekOff updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setupdatesheetopen(false);
      dispatch(getAllWeekOff());
      dispatch(resetWeekOff());
    }
  }, [updatedWeekOff]);

  React.useEffect(() => {
    if (deletedWeekOff?.success) {
      toast.success('WeekOff deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getAllWeekOff());
      dispatch(resetWeekOff());
    }
  }, [deletedWeekOff]);

  React.useEffect(() => {
    if (error) {
      toast.error(error?.message, {
        position: 'top-right',
        autoClose: 3000,
      });
      setDialogOpen(false);
      dispatch(resetWeekOff);
    }
  }, [error]);

  const columns = [
    { field: 'expand', headerName: '', width: 50 },
    { field: 'index', headerName: '#' },
    { field: 'WeekOffName', headerName: 'WeekOff' },
    { field: 'Effective_Date', headerName: 'Effective Date' },
    { field: 'Action', headerName: 'Action' },
  ];

  return (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif] flex items-center ml-2">
          Week Off
        </h5>
        <div className="flex items-center">
          {user?.permission.weekOff.canAddWeekoff && (
            <Sheet open={sheetopen} onOpenChange={setsheetopen}>
              <SheetTrigger className="focus:outline-none focus:ring-1 focus:ring-[#338DB5] mr-3 w-[160px]  border-[rgb(51,141,181)] rounded-lg">
                <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-full justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
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
                  New WeekOff
                </div>
              </SheetTrigger>
              <SheetContent
                showCloseButton={false}
                className="bg-white min-w-xl max-xs:min-w-screen"
              >
                <SheetHeader>
                  <SheetDescription>
                    <WeekOffForm
                      onSubmit={(data) => {
                        dispatch(createWeekOff(data));
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          )}
          <div className="max-[417px]:hidden">
            <WeekOffFilterSheet screen="WeekOff" />
          </div>
        </div>
      </div>
      <div className="min-[417px]:hidden max-[417px]:flex flex justify-end">
        <WeekOffFilterSheet screen="WeekOff" />
      </div>
      <ReusableTable
        columns={columns}
        data={filteredData}
        RowComponent={Row}
        pagination={true}
        rowProps={{ openSheet, openDialog }}
        tableStyle={{
          '& .MuiTableCell-root': {
            padding: 0.6,
            textAlign: 'center',
          },
        }}
      />
    </>
  );
}
