import React from 'react';
import PropTypes, { resetWarningCache } from 'prop-types';
import ReusableTable from '../Components/ReusableTable.jsx';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {
  getemployeeSalary,
  updateEmployeeSalary,
  resetcreatemployeeSalaryData,
} from '../feature/employeeSalaryfetch/employeeSalarySlice.js';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader.jsx';
import EmployeeSalaryFilterSheet from './EmployeeSalaryFilter.jsx';
import ExporttoExcel from '../Components/Export.jsx';

function Row({ row }) {
  const UserName = row?.UserId?.Name;
  return (
    <React.Fragment>
      <TableRow>
        <TableCell className="w-10">
          <div className="flex text-start">{row?.index}</div>
        </TableCell>
        <TableCell className="text-left">
          <div className="text-left">{UserName}</div>
        </TableCell>
        <TableCell className="">
          <div className="text-left">{row?.Salary}</div>
        </TableCell>
        <TableCell>{row?.totaldays}</TableCell>
        <TableCell>
          <div className="text-center">{row?.holidayDays}</div>
        </TableCell>
        <TableCell>{row?.actualWorkingDays}</TableCell>
        <TableCell>{row?.absentDays}</TableCell>
        <TableCell>{row?.leaveDays}</TableCell>
        <TableCell>{row?.presentDays}</TableCell>
        <TableCell>{row?.halfDays}</TableCell>
        <TableCell>{row?.year}</TableCell>
        <TableCell>{row?.month}</TableCell>
        <TableCell>{row?.calculatedSalary}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number,
    User: PropTypes.string,
    salary: PropTypes.string,
    totaldays: PropTypes.string,
    actualWorkingDays: PropTypes.string,
    holidayDays: PropTypes.string,
    absentdays: PropTypes.string,
    presentDays: PropTypes.string,
    year: PropTypes.string,
    month: PropTypes.string,
    calculatedSalary: PropTypes.string,
  }).isRequired,
};

const EmployeeSalaryTable = () => {
  const [data, setdata] = React.useState([]);
  const { fetchedEmployeeSalary, createEmployeeSalary, loading } = useSelector(
    (state) => state.employeeSalary
  );

  const filterValue = useSelector(
    (state) => state.filter.filterValue.EmpSalary
  );

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateEmployeeSalary());
  }, []);

  React.useEffect(() => {
    if (createEmployeeSalary?.success) {
      dispatch(getemployeeSalary());
      dispatch(resetcreatemployeeSalaryData());
    }
  }, [createEmployeeSalary?.success]);

  React.useEffect(() => {
    if (fetchedEmployeeSalary?.success) {
      setdata(fetchedEmployeeSalary?.message);
    }
  }, [fetchedEmployeeSalary]);

  const filteredData = data.filter((item) => {
    if (
      filterValue === undefined ||
      filterValue === null ||
      Object?.keys(filterValue).length === 0
    )
      return true;
    const UserMatch =
      !filterValue.User || item.UserId.Name === filterValue.User;
    const MonthMatch = !filterValue.month || item.month === filterValue.month;
    const YearMatch = !filterValue.year || item.year === filterValue.year;

    return UserMatch && MonthMatch && YearMatch;
  });

  const dataforExcel = data.map((item) => {
    return {
      _id: item._id,
      UserName: item?.UserId?.Name,
      Salary: item.Salary,
      TotalDays: item.totaldays,
      HolidayDays: item.holidayDays,
      ActualWorkingDays: item.actualWorkingDays,
      AbsentDays: item.absentDays,
      LeaveDays: item.leaveDays,
      PresentDays: item.presentDays,
      HalfDays: item.halfDays,
      Year: item.year,
      Month: item.month,
      CalculatedSalary: item.calculatedSalary,
    };
  });

  const columns = [
    { field: 'index', headerName: '#' },
    { field: 'UserName', headerName: 'UserName' },
    { field: 'Salary', headerName: 'Salary' },
    { field: 'totaldays', headerName: 'TotalDays' },
    { field: 'holidayDays', headerName: 'HolidayDays' },
    { field: 'actualWorkingDays', headerName: 'Actual WorkingDays' },
    { field: 'absentDays', headerName: 'AbsentDays' },
    { field: 'leaveDays', headerName: 'LeaveDays' },
    { field: 'presentDays', headerName: 'PresentDays' },
    { field: 'halfDays', headerName: 'HalfDays' },
    { field: 'year', headerName: 'Year' },
    { field: 'month', headerName: 'Month' },
    { field: 'calculatedSalary', headerName: 'Calculated Salary' },
  ];

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="inline-flex justify-between w-full bg-white h-15 rounded-md mt-1 mb-2">
        <h5 className="text-[22px] font-[450] font-[Inter,sans-serif]  flex items-center ml-2">
          Employee Salary Data
        </h5>
        <div className="flex gap-2 items-center">
          <EmployeeSalaryFilterSheet screen="EmpSalary" />
          <ExporttoExcel data={dataforExcel} fileName="EmpSalary" />
        </div>
      </div>
      <ReusableTable
        data={filteredData}
        columns={columns}
        RowComponent={Row}
        padding="1"
        width="100%"
        tableStyle={{
          '& .MuiTableCell-root': {
            padding: 1.3,
            textAlign: 'center',
          },
        }}
      />
    </>
  );
};

export default EmployeeSalaryTable;
