import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '../Components/components/ui/sheet';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilter } from '../feature/filterSlice/filterSlice';
import { Button } from '../Components/components/ui/button';
import { fetchuser } from '../feature/createuserfetch/createuserSlice.js';

export default function AttendanceFilterSheet({ screen }) {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = useState(false);
  const [User, setUser] = useState(null);
  const [todate, settodate] = useState(
    screen == 'Attendance' || screen === 'MissedPunchRegularization'
      ? new Date()
      : ''
  );
  const [fromdate, setfromdate] = useState(
    screen == 'Attendance' || screen === 'MissedPunchRegularization'
      ? new Date()
      : ''
  );
  const [isFilterApplied, setisFilterApplied] = useState(false);
  const { fetchusers, loading } = useSelector((state) => state.createuser);

  useEffect(() => {
    if (sheetopen) {
      dispatch(fetchuser());
    }
  }, [dispatch, sheetopen]);

  const handleFilter = (value, startDate, endDate) => {
    dispatch(
      setFilter({
        screen,
        values: {
          User: value?.label,
          StartDate: startDate,
          EndDate: endDate,
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
    if (todate < fromdate) {
      settodate(null);
    }
  }, [fromdate, todate]);

  useEffect(() => {
    setisFilterApplied(!!fromdate || !!todate || !!User);
  }, [User, fromdate, todate]);

  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger className="focus:outline-none focus:ring-1 focus:ring-[#338DB5] border border-solid w-[120px] mr-3 text-[17px] rounded-lg">
        <div
          className={`${isFilterApplied ? 'bg-[#dbf4ff]' : 'bg-[#ffffff]'} text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-full justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300`}
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
            <h1 className="text-2xl w-full">Filter Attendnace</h1>
            <Button
              id="clear-filter"
              className="bg-[#338DB5] cursor-pointer text-white mr-6 hover:bg-[#338DB5]"
              onClick={() => {
                dispatch(clearFilter({ screen }));
                setUser(null);
                setfromdate(null);
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
          <div className="font-[Inter,sans-serif]">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-[500]">User</label>
              <Select
                value={User}
                id="User-filter"
                isClearable={true}
                options={UserOptions}
                onChange={(value) => {
                  handleFilter(value, fromdate, todate);
                  setUser(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />
            </div>
            <div className=" flex justify-between w-full mt-6 gap-4">
              <div className="flex flex-col gap-2 w-[46%]">
                <label>From</label>
                <DatePicker
                  className="w-full border-2 border-gray-300 h-10 rounded-sm p-2"
                  placeholderText="DD-MM-YYYY"
                  selected={fromdate}
                  onChange={(date) => {
                    setfromdate(date);
                    if (!date) {
                      handleFilter(
                        User,
                        null,
                        todate !== '' ? todate?.toLocaleDateString('en-CA') : ''
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
                      localDate,
                      todate !== '' ? todate?.toLocaleDateString('en-CA') : ''
                    );
                  }}
                  dateFormat="dd-MM-yyyy"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  isClearable={!!fromdate}
                />
              </div>
              <div className="flex flex-col gap-2 items-start w-[46%]">
                <label>To</label>
                <DatePicker
                  minDate={fromdate}
                  className="w-full border-2 border-gray-300 h-10 rounded-sm p-2"
                  placeholderText="DD-MM-YYYY"
                  selected={todate}
                  value={todate}
                  onChange={(date) => {
                    settodate(date);
                    if (!date) {
                      handleFilter(
                        User,
                        fromdate !== ''
                          ? fromdate?.toLocaleDateString('en-CA')
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
                      fromdate !== ''
                        ? fromdate?.toLocaleDateString('en-CA')
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
