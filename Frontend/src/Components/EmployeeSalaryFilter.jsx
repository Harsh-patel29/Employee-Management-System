import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '../Components/components/ui/sheet';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilter } from '../feature/filterSlice/filterSlice';
import { fetchuser } from '../feature/createuserfetch/createuserSlice';
import { Button } from '../Components/components/ui/button';
import Select from 'react-select';

const currentYear = new Date().getFullYear();

const YearDropdown = () => {
  const startYear = 2000;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => {
      const year = startYear + index;
      return { value: year, label: year.toString() };
    }
  ).reverse();
  return years;
};

const monthOptions = [
  { value: '01', label: 'Januaray' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const monthName = monthOptions.map((item) => item.label);

const getMonthByName = (monthNumber) => {
  if (monthNumber >= 1 && monthNumber <= 12) {
    return monthName[monthNumber - 1];
  } else {
    return 'Invalid month number';
  }
};

export default function EmployeeSalaryFilterSheet({ screen }) {
  const [sheetopen, setsheetopen] = useState(false);
  const [isFilterApplied, setisFilterApplied] = useState(false);
  const [User, setUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const { fetchusers, loading } = useSelector((state) => state.createuser);
  const dispatch = useDispatch();

  const handleFilter = (UserName, month, year) => {
    dispatch(
      setFilter({
        screen,
        values: {
          User: UserName?.label,
          month: month?.value,
          year: year?.label,
        },
      })
    );
  };

  const UserOptions = fetchusers?.message
    ? fetchusers.message.map((user) => ({
        value: user._id,
        label: user.Name,
      }))
    : [];

  useEffect(() => {
    setisFilterApplied(!!User || !!selectedMonth || !!selectedYear);
  }, [User, selectedMonth, selectedYear]);

  useEffect(() => {
    if (sheetopen) {
      dispatch(fetchuser());
    }
  }, [sheetopen]);

  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger className="focus:outline-none focus:ring-1 focus:ring-[#338DB5] focus:ring-offset-0 w-[120px] border-[rgb(51,141,181)] rounded-lg">
        <div
          className={`${isFilterApplied ? 'bg-[#dbf4ff]' : 'bg-[#ffffff]'}  text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-full justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300`}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fontSize: 'var(--THEME-ICON-SIZE)' }}
          >
            <title>Filters</title>
            <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z"></path>
          </svg>
          Filters
        </div>
      </SheetTrigger>
      <SheetContent className="min-w-lg" showCloseButton={false}>
        <SheetHeader>
          <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
            <h1 className="text-2xl w-full">Filter Task</h1>
            <Button
              id="clear-filter"
              className="bg-[#338DB5] cursor-pointer text-white mr-6 hover:bg-[#338DB5]"
              onClick={() => {
                dispatch(clearFilter({ screen }));
                setUser('');
                setSelectedMonth(null);
                setSelectedYear(null);
              }}
            >
              Clear All
            </Button>
          </div>
          <SheetClose>
            <Button className="absolute cursor-pointer -right-2 top-4 bg-transparent text-black shadow-none border-none text-4xl hover:bg-transparent hover:text-black transition-all duration-300">
              &times;
            </Button>
          </SheetClose>
          <div className="font-[Inter,sans-serif]">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-[500]">User</label>
              <Select
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '15px',
                    backgroundColor: 'transparent',
                    width: 'auto',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '15px',
                    width: 'auto',
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isFocused
                      ? 'rgb(51,141,181)'
                      : 'white',
                    color: state.isFocused ? 'white' : 'rgb(120, 122, 126)',
                    ':hover': {
                      backgroundColor: 'rgb(51,141,181)',
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'white',
                    minWidth: '120px',
                  }),
                }}
                value={User}
                id="User-filter"
                isClearable={true}
                options={UserOptions}
                onChange={(value) => {
                  handleFilter(value, selectedMonth, selectedYear);
                  setUser(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />

              <label className="text-[16px] font-[500]">Month</label>
              <Select
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '15px',
                    backgroundColor: 'transparent',
                    width: 'auto',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '15px',
                    width: 'auto',
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isFocused
                      ? 'rgb(51,141,181)'
                      : 'white',
                    color: state.isFocused ? 'white' : 'rgb(120, 122, 126)',
                    ':hover': {
                      backgroundColor: 'rgb(51,141,181)',
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'white',
                    minWidth: '120px',
                  }),
                }}
                isClearable={!!selectedMonth}
                placeholder={'Select Month'}
                value={selectedMonth}
                onChange={(value) => {
                  setSelectedMonth(value);
                  handleFilter(User, value, selectedYear);
                }}
                options={monthOptions}
              />
              <label>Year</label>
              <Select
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '15px',
                    backgroundColor: 'transparent',
                    width: 'auto',
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '15px',
                    width: 'auto',
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isFocused
                      ? 'rgb(51,141,181)'
                      : 'white',
                    color: state.isFocused ? 'white' : 'rgb(120, 122, 126)',
                    ':hover': {
                      backgroundColor: 'rgb(51,141,181)',
                    },
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: 'white',
                    minWidth: '120px',
                  }),
                }}
                isClearable={!!selectedYear}
                placeholder={'Select Year'}
                value={selectedYear}
                onChange={(value) => {
                  setSelectedYear(value);
                  handleFilter(User, selectedMonth, value);
                }}
                options={YearDropdown()}
              />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
