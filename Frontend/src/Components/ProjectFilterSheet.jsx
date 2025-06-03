import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '../Components/components/ui/sheet';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { setFilter, clearFilter } from '../feature/filterSlice/filterSlice';
import { Button } from '../Components/components/ui/button';

export default function ProjectFilterSheet({ screen }) {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = useState(false);
  const [ProjectStatus, setProjectStatus] = useState(null);
  const [isFilterApplied, setisFilterApplied] = useState(false);
  const handleFilter = (value) => {
    dispatch(setFilter({ screen, values: { progress_status: value?.label } }));
  };
  const projectOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In-Progress', label: 'In-Progress' },
    { value: 'Hold', label: 'Hold' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Scrapped', label: 'Scrapped' },
  ];

  useEffect(() => {
    setisFilterApplied(!!ProjectStatus);
  }, [ProjectStatus]);

  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger className="focus:outline-none focus:ring-1 focus:ring-[#338DB5]  border-[rgb(51,141,181)]  w-[120px] h-9 mr-3 text-[17px] rounded-lg">
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
      <SheetContent
        className="min-w-lg max-xs:min-w-screen"
        showCloseButton={false}
      >
        <SheetHeader>
          <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
            <h1 className="text-2xl w-full">Filter Project</h1>
            <Button
              id="clear-filter"
              className="bg-[#338DB5] cursor-pointer text-white mr-6 hover:bg-[#338DB5]"
              onClick={() => {
                dispatch(clearFilter({ screen }));
                setProjectStatus(null);
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
          <SheetDescription>
            <div className="mt-3 font-[Inter,sans-serif]">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-[500]">Project Status</label>
                <Select
                  value={ProjectStatus}
                  id="projectStatus-filter"
                  isClearable={true}
                  options={projectOptions}
                  onChange={(value) => {
                    handleFilter(value);
                    setProjectStatus(value);
                  }}
                />
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
