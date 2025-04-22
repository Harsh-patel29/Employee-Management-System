import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '../Components/components/ui/sheet';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useDispatch } from 'react-redux';
import { setFilter } from '../feature/filterSlice/filterSlice';
import { Button } from '../Components/components/ui/button';

export default function LeaveFilterSheet() {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = useState(false);
  const [LeaveStatus, setLeaveStatus] = useState(null);
  const [fromDate, setfromDate] = useState('');
  const [toDate, settoDate] = useState('');

  const handleFilter = (value, StartDate, EndDate) => {
    dispatch(
      setFilter({
        Status: value?.label,
        Start_Date: StartDate,
        End_Date: EndDate,
      })
    );
  };

  const leaveStatus = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  const clearFilter = () => {
    dispatch(setFilter());
  };
  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger>
        <button className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[120px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
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
              className="bg-[#338DB5] text-white mr-6 hover:bg-[#338DB5]"
              onClick={() => {
                clearFilter();
                setLeaveStatus(null);
                setfromDate('');
                settoDate('');
              }}
            >
              Clear All
            </Button>
          </div>
          <SheetClose>
            <Button className="absolute -right-2 top-4 bg-transparent text-black shadow-none border-none text-4xl hover:bg-transparent hover:text-black transition-all duration-300">
              &times;
            </Button>
          </SheetClose>
          <SheetDescription></SheetDescription>
          <div className="mt-3 font-[Inter,sans-serif]">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-[500]">Leave Status</label>
              <Select
                value={LeaveStatus}
                id="LeaveStatus-filter"
                isClearable={true}
                options={leaveStatus}
                onChange={(value) => {
                  handleFilter(value, fromDate, toDate);
                  setLeaveStatus(value);
                }}
              />
            </div>
            <div className=" flex justify-between w-full mt-6 gap-4">
              <div className="flex flex-col gap-2 w-[46%]">
                <label>From</label>
                <DatePicker
                  className="w-full border-2 border-gray-300 h-10 rounded-sm p-2"
                  placeholderText="DD-MM-YYYY"
                  selected={fromDate}
                  onChange={(date) => {
                    setfromDate(date);
                    if (!date) {
                      handleFilter(
                        LeaveStatus,
                        null,
                        toDate?.toLocaleDateString('en-CA')
                      );
                      return;
                    }
                    const localDate = new Date(
                      date?.getTime() - date?.getTimezoneOffset() * 60000
                    )
                      ?.toISOString()
                      .split('T')[0];
                    handleFilter(
                      LeaveStatus,
                      localDate,
                      toDate?.toLocaleDateString('en-CA')
                    );
                  }}
                  dateFormat="dd-MM-yyyy"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  isClearable={true}
                />
              </div>
              <div className="flex flex-col gap-2 items-start w-[46%]">
                <label>To</label>
                <DatePicker
                  className="w-full border-2 border-gray-300 h-10 rounded-sm p-2"
                  placeholderText="DD-MM-YYYY"
                  selected={toDate}
                  onChange={(date) => {
                    settoDate(date);
                    if (!date) {
                      handleFilter(
                        LeaveStatus,
                        fromDate?.toLocaleDateString('en-CA'),
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
                      LeaveStatus,
                      fromDate?.toLocaleDateString('en-CA'),
                      localDate
                    );
                  }}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  dateFormat="dd-MM-yyyy"
                  isClearable={true}
                />
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
