import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from '../Components/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../Components/components/ui/dialog';
import { Button } from '../Components/components/ui/button.tsx';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Loader from '../Components/Loader.jsx';
import { toast } from 'react-toastify';
import ExporttoExcel from './Export.jsx';
import ReusableTable from './ReusableTable.jsx';
import SalaryForm from './SalaryForm.jsx';
import {
  addSalary,
  getSalary,
  updateSalary,
  resetAddedSalary,
  resetUpdatedSalary,
  deletesalary,
  resetDeletedSalary,
  resetError,
} from '../feature/salaryfetch/addsalaryslice.js';
import { Play, StopCircle, X } from 'lucide-react';
import SalaryFilterSheet from './SalaryFilter.jsx';

function Row({ row, openDialog, navigate, openSheet }) {
  const [updatesheetopen, setupdatesheetopen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { updatedSalary } = useSelector((state) => state.salarySlice);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (updatedSalary?.success) {
      setupdatesheetopen(false);
    }
  }, [updatedSalary]);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <TableCell className="">{row.index}</TableCell>
        <TableCell className="">{row.User}</TableCell>
        <TableCell className="">{row.WeekOff}</TableCell>
        <TableCell className="">{row.Effective_Date}</TableCell>
        <TableCell className="">{row.Salary}</TableCell>

        <TableCell className="flex w-22">
          <div className="flex justify-end mr-4">
            <Sheet open={updatesheetopen} onOpenChange={setupdatesheetopen}>
              <SheetTrigger asChild>
                <FaEdit className="font-[200] text-lg cursor-pointer" />
              </SheetTrigger>
              <SheetContent className="min-w-2xl">
                <SheetHeader>
                  <SheetDescription>
                    <SalaryForm
                      mode="update"
                      onSubmit={(data) => {
                        dispatch(updateSalary({ id: row._id, data: data }));
                      }}
                      id={row._id}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <MdDelete className="font-[200] text-lg text-[#ff3b30] cursor-pointer" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <div className="flex w-full items-center justify-between">
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogClose>
                      <X className="h-4 w-4  cursor-pointer" />
                    </DialogClose>
                  </div>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the salary detail's from our servers.
                    <Button
                      className="flex w-full mt-4 cursor-pointer bg-red-600 hover:bg-red-800"
                      onClick={() => {
                        dispatch(deletesalary(row._id));
                        setTimeout(() => {
                          setDialogOpen(false);
                        }, 200);
                      }}
                    >
                      Delete
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

Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    User: PropTypes.string,
    WeekOff: PropTypes.string,
    Effective_Date: PropTypes.string,
    Salary: PropTypes.string,
  }).isRequired,
};

export default function SalaryTable() {
  const [sheetopen, setsheetopen] = React.useState(false);
  const [SalaryDetail, setSalaryDetail] = React.useState();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const dispatch = useDispatch();
  const {
    addedSalary,
    fetchedSalary,
    updatedSalary,
    deletedSalary,
    loading,
    error,
  } = useSelector((state) => state.salarySlice);

  const filterValue = useSelector(
    (state) => state.filter.filterValue.SalaryDetail
  );

  React.useEffect(() => {
    dispatch(getSalary());
  }, []);

  const openDialog = () => {
    setTimeout(() => {
      setDialogOpen(true);
    }, 0);
  };

  React.useEffect(() => {
    if (fetchedSalary?.success) {
      const formattedData = fetchedSalary?.message.filter(
        (item) => item.is_Deleted === false
      );
      setSalaryDetail(formattedData);
    }
  }, [fetchedSalary]);

  React.useEffect(() => {
    if (addedSalary?.success) {
      toast.success('Salary Assigned Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getSalary());
      setsheetopen(false);
      dispatch(resetAddedSalary());
    }
  }, [addedSalary]);

  React.useEffect(() => {
    if (updatedSalary?.success) {
      toast.success('Salary Details Updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getSalary());
      dispatch(resetUpdatedSalary());
    }
  }, [updatedSalary]);

  React.useEffect(() => {
    if (deletedSalary?.success) {
      toast.success('Salary Detail Deleted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getSalary());
      setDialogOpen(false);
      dispatch(resetDeletedSalary());
    }
  }, [deletedSalary]);

  const filteredData = SalaryDetail?.filter((item) => {
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
    const endDate = filterValue.todate ? new Date(filterValue.todate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const dateRangeMatch =
      (!startDate || itemDate >= startDate) &&
      (!endDate || itemDate <= endDate);
    const UserMatch = !filterValue.User || item.User === filterValue.User;
    const WeekOffMatch =
      !filterValue.WeekOff || item.WeekOff === filterValue.WeekOff;
    return dateRangeMatch && UserMatch && WeekOffMatch;
  });

  React.useEffect(() => {
    if (error) {
      toast.error(error?.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    resetError();
  }, [error]);

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'User', headerName: 'User' },
    { field: 'WeekOff', headerName: 'WeekOff' },
    { field: 'Effective_Date', headerName: 'Effective Date' },
    { field: 'Salary', headerName: 'Salary' },
    { field: 'Action', headerName: 'Action' },
  ];

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Salary Data
        </h5>
        <div className="flex items-center">
          <Sheet open={sheetopen} onOpenChange={setsheetopen}>
            <SheetTrigger className="focus:outline-none focus:ring-1 focus:ring-[#338DB5] mr-3  w-[160px] border-[rgb(51,141,181)] rounded-lg">
              <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-full justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
                <svg
                  class="w-6 h-6 text-[#338DB5]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>Assign Salary</title>

                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  ></path>
                </svg>
                Assign Salary
              </div>
            </SheetTrigger>
            <SheetContent
              showCloseButton={false}
              className="bg-white xl:min-w-2xl lg:min-w-xl md:w-lg sm:min-w-md max-xs:min-w-screen"
            >
              <SheetHeader>
                <SheetDescription>
                  <SalaryForm
                    onSubmit={(data) => {
                      dispatch(addSalary(data));
                    }}
                  />
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <div className="max-[400px]:hidden">
            <SalaryFilterSheet screen="SalaryDetail" />
          </div>
          <div className="max-[520px]:hidden">
            <ExporttoExcel
              data={SalaryDetail}
              fileName="Projects"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="min-[400px]:hidden max-[400px]:flex">
          <SalaryFilterSheet screen="SalaryDetail" />
        </div>
        <div className="max-[520px]:flex min-[520px]:hidden">
          <ExporttoExcel
            data={SalaryDetail}
            fileName="Projects"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          />
        </div>
      </div>
      <ReusableTable
        width="full"
        columns={columns}
        data={filteredData}
        RowComponent={Row}
        rowProps={openDialog}
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
