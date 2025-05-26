import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from '../Components/components/ui/sheet';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilter } from '../feature/filterSlice/filterSlice';
import { Button } from '../Components/components/ui/button';
import { fetchuser } from '../feature/createuserfetch/createuserSlice.js';
import { getAllWeekOff } from '../feature/weekofffetch/weekoffslice.js';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

export default function SalaryFilterSheet({ screen }) {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = useState(false);
  const [effectiveDate, seteffectiveDate] = useState(null);
  const [todate, settodate] = useState(null);
  const [User, setUser] = useState(null);
  const [WeekOff, setWeekOff] = useState(null);
  const [isFilterApplied, setisFilterApplied] = useState(false);
  const { fetchusers, loading } = useSelector((state) => state.createuser);
  const { allWeekOff } = useSelector((state) => state.weekoff);

  const handleFilter = (user, weekOff, effectiveDate, todate) => {
    dispatch(
      setFilter({
        screen,
        values: {
          User: user?.label,
          WeekOff: weekOff?.label,
          Effective_Date: effectiveDate,
          todate: todate,
        },
      })
    );
  };

  useEffect(() => {
    if (sheetopen) {
      dispatch(fetchuser());
      dispatch(getAllWeekOff());
    }
  }, [dispatch, sheetopen]);

  const UserOptions = fetchusers?.message
    ? fetchusers.message.map((user) => ({
        value: user._id,
        label: user.Name,
      }))
    : [];

  const weekOffOptions = allWeekOff?.message
    ? allWeekOff?.message?.map((weekoff) => ({
        label: weekoff.WeekOffName,
        value: weekoff._id,
      }))
    : [];

  useEffect(() => {
    if (todate < effectiveDate) {
      settodate(null);
    }
  }, [effectiveDate, todate]);

  useEffect(() => {
    setisFilterApplied(!!effectiveDate || !!User || !!WeekOff || !!todate);
  }, [effectiveDate, User, WeekOff]);

  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger>
        <button
          className={`${isFilterApplied ? 'bg-[#dbf4ff]' : 'bg-[#ffffff]'} text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[120px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300`}
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
        </button>
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
                setWeekOff(null);
                setUser(null);
                seteffectiveDate(null);
                settodate(null);
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
          <SheetDescription></SheetDescription>
          <div className="font-[Inter,sans-serif]">
            <div className="">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-[500]">UserName</label>
                <Select
                  value={User}
                  id="UserName-filter"
                  isClearable={true}
                  options={UserOptions}
                  onChange={(value) => {
                    handleFilter(value, WeekOff, effectiveDate);
                    setUser(value);
                  }}
                  isLoading={loading}
                  isDisabled={loading}
                />
                <label className="text-[16px] font-[500]">WeekOff</label>
                <Select
                  value={WeekOff}
                  isClearable={true}
                  options={weekOffOptions}
                  onChange={(value) => {
                    handleFilter(User, value, effectiveDate);
                    setWeekOff(value);
                  }}
                  isLoading={loading}
                  isDisabled={loading}
                />
                <label>Effective Date</label>
                <DatePicker
                  className="w-full border-2 border-gray-300 h-10 rounded-sm p-2"
                  placeholderText="DD-MM-YYYY"
                  selected={effectiveDate}
                  onChange={(date) => {
                    seteffectiveDate(date);
                    if (!date) {
                      handleFilter(User, WeekOff, null);
                      return;
                    }
                    const localDate = new Date(
                      date?.getTime() - date?.getTimezoneOffset() * 60000
                    )
                      ?.toISOString()
                      .split('T')[0];
                    handleFilter(User, WeekOff, localDate);
                  }}
                  dateFormat="dd-MM-yyyy"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  isClearable={!!effectiveDate}
                />
                <label>To</label>
                <DatePicker
                  minDate={effectiveDate}
                  className="w-full border-2 border-gray-300 h-10 rounded-sm p-2"
                  placeholderText="DD-MM-YYYY"
                  selected={todate}
                  value={todate}
                  onChange={(date) => {
                    settodate(date);
                    if (!date) {
                      handleFilter(
                        User,
                        WeekOff,
                        effectiveDate !== ''
                          ? effectiveDate?.toLocaleDateString('en-CA')
                          : '',
                        null
                      );
                      return;
                    }
                    const localDate = new Date(
                      date?.getTime() - date?.getTimezoneOffset() * 60000
                    )
                      ?.toISOString()
                      .split('T')[0];
                    handleFilter(
                      User,
                      WeekOff,
                      effectiveDate !== ''
                        ? effectiveDate?.toLocaleDateString('en-CA')
                        : '',
                      localDate
                    );
                  }}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  dateFormat="dd-MM-yyyy"
                  isClearable={!!todate}
                />
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
