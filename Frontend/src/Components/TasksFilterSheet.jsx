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
import { getProjects } from '../feature/projectfetch/createproject.js';
import { getAllTasks } from '../feature/taskfetch/taskfetchSlice.js';

export default function TasksFilterSheet({ screen }) {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = useState(false);
  const [Asigneeoption, setAsigneeoption] = useState(null);
  const [projectoption, setprojectoption] = useState(null);
  const [taskoption, settaskoption] = useState(null);
  const [todate, settodate] = useState(null);
  const [fromdate, setfromdate] = useState(null);
  const [statusoption, setstatusoption] = useState(null);
  const [isFilterApplied, setisFilterApplied] = useState(false);
  const { fetchusers, loading } = useSelector((state) => state.createuser);
  const { projects } = useSelector((state) => state.project);
  const { tasks } = useSelector((state) => state.task);

  useEffect(() => {
    if (sheetopen) {
      dispatch(fetchuser());
      dispatch(getProjects());
      dispatch(getAllTasks());
    }
  }, [dispatch, sheetopen]);

  const handleFilter = (
    value,
    projectValue,
    taskValue,
    startDate,
    endDate,
    statusValue
  ) => {
    dispatch(
      setFilter({
        screen,
        values: {
          Asignee: value?.label,
          Project: projectValue?.label,
          Task: taskValue?.label,
          StartDate: startDate,
          EndDate: endDate,
          Status: statusValue,
        },
      })
    );
  };
  const assigneeOptions = fetchusers?.message
    ? fetchusers.message.map((user) => ({
        value: user._id,
        label: user.Name,
      }))
    : [];

  const projectOptions = projects?.message
    ? projects.message.map((project) => ({
        value: project._id,
        label: project.name,
      }))
    : [];

  const taskOptions = tasks?.message
    ? tasks?.message.map((code) => ({
        value: code,
        label: code.CODE,
      }))
    : [];

  const statusOptions = [
    { value: 'Backlog', label: 'Backlog' },
    { value: 'In_Progress', label: 'In_Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Done', label: 'Done' },
    { value: 'Deployed', label: 'Deployed' },
  ];

  useEffect(() => {
    if (todate < fromdate) {
      settodate(null);
    }
  }, [fromdate, todate]);

  useEffect(() => {
    setisFilterApplied(
      !!Asigneeoption ||
        !!projectoption ||
        !!taskoption ||
        !!todate ||
        !!fromdate ||
        !!statusoption
    );
  }, [
    Asigneeoption,
    projectoption,
    taskoption,
    todate,
    fromdate,
    statusoption,
  ]);

  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger className="focus:outline-none focus:ring-1 focus:ring-[#338DB5]  w-[120px] mr-3 border-[rgb(51,141,181)] rounded-lg">
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
            <h1 className="text-2xl w-full">Filter Task</h1>
            <Button
              id="clear-filter"
              className="bg-[#338DB5] cursor-pointer text-white mr-6 hover:bg-[#338DB5]"
              onClick={() => {
                dispatch(clearFilter({ screen }));
                setAsigneeoption(null);
                setprojectoption(null);
                settaskoption(null);
                setfromdate(null);
                settodate(null);
                setstatusoption(null);
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
              <label className="text-[16px] font-[500]">Assignee</label>
              <Select
                className="text-start"
                value={Asigneeoption}
                id="assignee-filter"
                isClearable={true}
                options={assigneeOptions}
                onChange={(value) => {
                  handleFilter(
                    value,
                    projectoption,
                    taskoption,
                    fromdate,
                    todate,
                    statusoption?.label
                  );
                  setAsigneeoption(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />
              <label className="text-[16px] font-[500]">Project</label>
              <Select
                className="text-start"
                value={projectoption}
                isClearable={true}
                options={projectOptions}
                onChange={(value) => {
                  handleFilter(assigneeOptions, value, projectOptions);
                  setprojectoption(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />
              <label className="text-[16px] font-[500]">Task</label>
              <Select
                className="text-start"
                value={taskoption}
                isClearable={true}
                options={taskOptions}
                onChange={(value) => {
                  handleFilter(
                    Asigneeoption,
                    projectoption,
                    value,
                    fromdate,
                    todate,
                    statusoption?.label
                  );
                  settaskoption(value);
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
                        Asigneeoption,
                        projectoption,
                        taskoption,
                        null,
                        todate !== ''
                          ? todate?.toLocaleDateString('en-CA')
                          : '',
                        statusoption?.label
                      );
                      return;
                    }
                    const localDate = new Date(
                      date?.getTime() - date?.getTimezoneOffset() * 60000
                    )
                      ?.toISOString()
                      .split('T')[0];
                    handleFilter(
                      Asigneeoption,
                      projectoption,
                      taskoption,
                      localDate,
                      todate !== '' ? todate?.toLocaleDateString('en-CA') : '',
                      statusoption?.label
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
                  minDate={fromdate}
                  className="w-full border-2 border-gray-300 h-10 rounded-sm p-2"
                  placeholderText="DD-MM-YYYY"
                  selected={todate}
                  value={todate}
                  onChange={(date) => {
                    settodate(date);
                    if (!date) {
                      handleFilter(
                        Asigneeoption,
                        projectoption,
                        taskoption,
                        fromdate !== ''
                          ? fromdate?.toLocaleDateString('en-CA')
                          : '',
                        null,
                        statusoption?.label
                      );
                      return;
                    }
                    const localDate = new Date(
                      date?.getTime() - date?.getTimezoneOffset() * 60000
                    )
                      ?.toISOString()
                      .split('T')[0];
                    handleFilter(
                      Asigneeoption,
                      projectoption,
                      taskoption,
                      fromdate !== ''
                        ? fromdate?.toLocaleDateString('en-CA')
                        : '',
                      localDate,
                      statusoption?.label
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
            <div className="flex flex-col gap-2 mt-6">
              <label className="text-[16px] font-[500]">Task Status</label>
              <Select
                className="text-start"
                value={statusoption}
                isClearable={true}
                options={statusOptions}
                onChange={(value) => {
                  handleFilter(
                    Asigneeoption,
                    projectoption,
                    taskoption,
                    fromdate,
                    todate,
                    value?.label
                  );
                  setstatusoption(value);
                }}
                isLoading={loading}
                isDisabled={loading}
              />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
