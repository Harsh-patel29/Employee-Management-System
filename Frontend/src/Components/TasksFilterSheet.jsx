import React ,{useEffect, useState} from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
  SheetClose
} from "../Components/components/ui/sheet";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../Components/components/ui/popover";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Select from 'react-select'
import { useDispatch,useSelector } from 'react-redux';
import { setFilter } from '../feature/filterSlice/filterSlice';
import { Button } from '../Components/components/ui/button';
import { Input } from "../Components/components/ui/input";
import {fetchuser}  from '../feature/createuserfetch/createuserSlice.js';
import {getProjects} from "../feature/projectfetch/createproject.js"
import {getAllTasks} from "../feature/taskfetch/taskfetchSlice.js"

export default function TasksFilterSheet() {
  const dispatch = useDispatch();
  const [sheetopen, setsheetopen] = useState(false);
  const [Asigneeoption, setAsigneeoption] = useState(null);
  const [projectoption, setprojectoption] = useState(null);
  const [taskoption, settaskoption] = useState(null);
  const [todate, settodate] = useState(null);
  const [fromdate, setfromdate] = useState(null);
  const [statusoption, setstatusoption] = useState(null);
  const { fetchusers, loading, error } = useSelector((state) => state.createuser);
  const {projects} = useSelector((state)=>state.project)
  const {tasks} = useSelector((state)=>state.task)
  useEffect(() => {
    dispatch(fetchuser());
    dispatch(getProjects());
    dispatch(getAllTasks());
  }, [dispatch]);
  
  const handleFilter = (value,projectValue,taskValue,startDate,endDate,statusValue) => {
    dispatch(setFilter({Asignee:value?.label,Project:projectValue?.label,Task:taskValue?.label,StartDate:startDate,EndDate:endDate,Status:statusValue}));
  }
  const assigneeOptions = (fetchusers?.message) 
    ? fetchusers.message.map(user => ({
        value: user._id,
        label: user.Name
      }))
    : [];

    const projectOptions = (projects?.message)?projects.message.map(project=>({
      value: project._id,
      label: project.name
    }))
    :[];

    const taskOptions = (tasks?.message)?tasks?.message.map(code=>({      
      value :code,
      label : code.CODE
    })):[]


    const statusOptions = [
  {value:"Backlog",label:"Backlog"},
  {value:"In_Progress",label:"In_Progress"},
  {value:"Completed",label:"Completed"},
  {value:"Done",label:"Done"},
  {value:"Deployed",label:"Deployed"},
]

    const clearFilter = () => {
    dispatch(setFilter({}));
  }



  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger >
         <button className="bg-[#ffffff] text-[#338DB5] font-[400] gap-2 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[120px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#dbf4ff] transition-all duration-300">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "var(--THEME-ICON-SIZE)" }}
            >
              <title>Filters</title>
              <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z"></path>
            </svg>
            Filters
          </button>
      </SheetTrigger>
      <SheetContent className="min-w-lg" showCloseButton={false}>
        <SheetHeader>
    <div className='flex w-full justify-end items-center border-b-2 border-gray-200 pb-4'>
          <h1 className="text-2xl w-full">Filter Task</h1>
          <Button id='clear-filter' className='bg-[#338DB5] text-white mr-6 hover:bg-[#338DB5]' onClick={()=>{
            clearFilter()
            setAsigneeoption(null)
            setprojectoption(null)
            settaskoption(null)
            setfromdate(null)
            settodate(null)
            setstatusoption(null)
          }}>Clear All</Button>
    </div>
    <SheetClose>
          <Button className='absolute -right-2 top-4 bg-transparent text-black shadow-none border-none text-4xl hover:bg-transparent hover:text-black transition-all duration-300'>&times;</Button>
    </SheetClose>
          <SheetDescription>
          </SheetDescription>
          <div className="mt-3 font-[Inter,sans-serif]">
            <div className='flex flex-col gap-2'>
              <label className='text-[16px] font-[500]'>Assignee</label>
              <Select 
                value={Asigneeoption}
                id='assignee-filter'
                isClearable={true}
                options={assigneeOptions} 
                onChange={(value)=>{
                  handleFilter(value,projectoption,taskoption)
                  setAsigneeoption(value)
                }} 
                isLoading={loading}
                isDisabled={loading}
              />
              <label className='text-[16px] font-[500]'>Project</label>
              <Select 
                value={projectoption}
                isClearable={true}
                options={projectOptions} 
                onChange={(value)=>{
                  handleFilter(Asigneeoption,value,taskoption)
                  setprojectoption(value)
                }} 
                isLoading={loading}
                isDisabled={loading}
              />
              <label className='text-[16px] font-[500]'>Task</label>
              <Select 
                value={taskoption}
                isClearable={true}
                options={taskOptions} 
                onChange={(value)=>{
                  handleFilter(Asigneeoption,projectoption,value,fromdate,todate)
                  settaskoption(value)
                }} 
                isLoading={loading}
                isDisabled={loading}
              />
            </div>
            <div className=' flex justify-between w-full mt-6 gap-4'>
             <div className='flex flex-col gap-2 w-[46%]'>
             <label >
              From 
             </label>
              <DatePicker className='w-full border-2 border-gray-300 h-10 rounded-sm'placeholderText='DD-MM-YYYY'
              selected={fromdate}
              onChange={(date)=>{
                setfromdate(date)
                 const localDate = new Date(
                                    date?.getTime() -
                                      date?.getTimezoneOffset() * 60000
                                  )?.toISOString().split("T")[0];
                handleFilter(Asigneeoption,projectoption,taskoption,localDate,todate?.toLocaleDateString("en-CA"))
              }}
              
              dateFormat="dd-MM-yyyy"
                              showYearDropdown
                              scrollableYearDropdown
                              yearDropdownItemNumber={100}
              isClearable={true}
              />
               </div>
             <div className='flex flex-col gap-2 items-start w-[46%]'>
             <label>
              To 
             </label>
              <DatePicker
              className='w-full border-2 border-gray-300 h-10 rounded-sm'
              placeholderText='DD-MM-YYYY'
              selected={todate}
              onChange={(date)=>{
                settodate(date)
                 const localDate = new Date(
                                    date?.getTime() -
                                      date?.getTimezoneOffset() * 60000
                                  )?.toISOString().split("T")[0];
        handleFilter(Asigneeoption,projectoption,taskoption,fromdate?.toLocaleDateString("en-CA"),localDate)
                                }}
                                showYearDropdown
                              scrollableYearDropdown
                              yearDropdownItemNumber={100}
              dateFormat="dd-MM-yyyy"
              isClearable={true}
              />
            </div>
            </div>
            <div className='flex flex-col gap-2 mt-6'>
             <label className='text-[16px] font-[500]'>Task Status</label>
              <Select 
                value={statusoption}
                isClearable={true}
                options={statusOptions} 
                onChange={(value)=>{
                  handleFilter(Asigneeoption,projectoption,taskoption,fromdate,todate,value?.label)
                  setstatusoption(value)
                }} 
                isLoading={loading}
                isDisabled={loading}
              />
              </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
