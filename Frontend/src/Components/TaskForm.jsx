import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../Components/components/ui/button";
import { Input } from "../Components/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from "../Components/components/ui/form";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../Components/components/ui/popover";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useEffect } from "react";
import {  useParams } from "react-router";

const formSchema = z.object({
  Title: z.string(),
  Description: z.string(),
  Todo: z.array(z.string()),
  Comments: z.array(z.string()),
  Project: z.string(),
  Status: z.enum(["BackLog", "In-Progress", "DONE", "Completed", "Deployes"]),
  Asignee: z.string(),
  TotalTime: z.string(),
  StartDate: z.string(),
  EndDate: z.string(),
  EstimatedTime: z.string(),
  Users: z.array(z.string()),
  Attachments: z.array(z.string()),
});

export default function TaskUpdateForm({ onSubmit, mode }) {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [showTitleField, setShowTitleField] = useState(false);
    const [showDescriptionField, setShowDescriptionField] = useState(false);
    const [showTodoField, setShowTodoField] = useState(false);
    const [showEstimatedTimeField, setShowEstimatedTimeField] = useState(false);
    const users = useSelector((state) => state.getuser);
    const { user } = useSelector((state) => state.auth);
    const { tasks, createtask } = useSelector((state) => state.task);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
    Title:"",
    Description:"",
    Todo:[],
    Comments:[],
    Project:"",
    Status:"",
    Asignee:"",
    TotalTime:"",
    StartDate:"",
    EndDate:"",
    EstimatedTime:"",
    Users:[],
    Attachments:[],
},
});

return (
    <>
    <div className="mt-4"></div>
      <Form {...control}>
        <form className="h-screen"
          onSubmit={handleSubmit(onSubmit)}   
          >
          <FormField 
            control={control}
            name="Title"
            render={({ field }) => (
                <FormItem className="border-b-1 border-gray-300 ps-2 mb-3
                pb-2">
                <FormLabel className="flex items-center">
                    {
                        showTitleField&&
                        <FormControl>
                <Input
                type="text"
                placeholder=""
                style={{border:"none",outline:"none",boxShadow:"none"}}
                className="bg-white w-[20%] overflow-x-auto"
                {...field}
                />
                </FormControl>
}
            <div className={`${showTitleField ? "cursor-pointer" : "hidden"}`} onClick={()=>{setShowTitleField(false)}}>
            <svg class="w-6 h-6" width="24" height="24" stroke="currentColor" fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <title>update</title>
            <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
            </svg>
            </div>
                <div onClick={()=>{setShowTitleField(true)}} className={`${showTitleField ? "hidden" : " ml-10 cursor-pointer"}`}  >
            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="rgb(51,141,181)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
</svg>
                </div>
                    </FormLabel>
                  <div className="ml-5 text-[rgb(115,115,115)]">#{createtask?.message?.CODE}</div>
              </FormItem>
            )}
            />

            <div className="w-[56%] flex flex-col justify-between">
          <FormField
            control={control}
            name="Description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="flex items-center justify-between text-[20px] font-[Inter,sans-serif] ml-5 font-[100] ">Task Description
              <div className={`${showDescriptionField ? "cursor-pointer" : "hidden"}`} onClick={()=>{setShowDescriptionField(false)}}>
            <svg class="w-6 h-6" width="24" height="24" stroke="currentColor" fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <title>update</title>
            <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
            </svg>
            </div>
                <div onClick={()=>{setShowDescriptionField(true)}} className={`${showDescriptionField ? "hidden" : " ml-10 cursor-pointer"}`}  >
            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="rgb(51,141,181)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"/>
</svg>
                </div>
                </FormLabel>

{showDescriptionField&&
                <FormControl>
                   <Input
                type="text"
                placeholder=""
                style={{border:"none",outline:"none",boxShadow:"none"}}
                className=" flex  bg-white w-[20%] overflow-x-auto"
                {...field}
                />
                </FormControl>}
              </FormItem>
            )}
            />
         
          <FormField
            control={control}
            name="Todo"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col mt-6">
               <FormLabel className="flex items-center justify-between text-[20px] font-[Inter,sans-serif] ml-5 font-[100] ">Task To-Do List
              <div className={`${showTodoField ? "cursor-pointer" : "hidden"}`} onClick={()=>{setShowTodoField(false)}}>
          <svg stroke="currentColor" fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 512 512" class="w-6 h-6" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style={{transition: "transform 0.3s", transform: "rotate(45deg)"}}>
          <title>close</title>
          <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
          <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
          </svg>
            </div>
                <div onClick={()=>{setShowTodoField(true)}} className={`${showTodoField ? "hidden" : " ml-10 cursor-pointer"}`}  >
            <svg class="w-6 h-6" stroke="currentColor"  fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 512 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style={{transition: "transform 0.3s"}}>
            <title>add</title>
            <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
            <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
            </svg>
                </div>
                </FormLabel>
                  <div className="flex">
{showTodoField&&
                <FormControl >
                   <Input
                type="text"
                placeholder="Todo Title"
                style={{borderTopRightRadius:"0px" , borderBottomRightRadius:"0px", borderColor:"#e0e0e0",outline:"none",boxShadow:"none"}}
                className=" flex bg-white w-[100%] overflow-x-auto ml-5.5"
                {...field}
                >
                </Input>
                </FormControl>}
                <FormControl>
                  <button className={`${showTodoField ? "bg-[rgb(51,141,181)] text-white rounded-r-md w-10 flex justify-center items-center hover:bg-blue-600 transition-all duration-100 cursor-pointer" : "hidden"}`}>
    <svg stroke="#ffffff" fill="#ffffff" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path>
    </svg>
                  </button>
                </FormControl>
                    </div>
              </FormItem>
            )}
            />

          <FormField
            control={control}
            name="Comments"
            render={({ field }) => (
                <FormItem className="w-full flex flex-col  mt-6 bg-white shadow-2xl border-t-[rgb(226,226,226)] border-2 h-40 rounded-md ml-2">
                <FormLabel className="flex items-start mt-2 text-[20px] font-[Inter,sans-serif] ml-5  font-[100] font-[Inter,sans-serif] 
text-decoration-line: underline decoration-[rgb(205,179,162)]" >Comments</FormLabel>
                <div className="relative flex items-center w-full px-2 mt-2">
                <FormControl className="flex-grow">
                  <Input
                    type="text"
                    className="shadow h-10  mt-3 w-[98%] ml-2 bg-[rgba(249,249,249,0.65)]"
                    style={{borderColor:"#338db5",borderRadius:"20px",boxShadow:"none"}}
                    placeholder="Write your comment here..."
                    {...field}
                    />
                </FormControl>
                <div className="absolute right-6 flex gap-3 mt-3">
                <button className="">
<svg stroke="" fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
<path d="M43.246 466.142c-58.43-60.289-57.341-157.511 1.386-217.581L254.392 34c44.316-45.332 116.351-45.336 160.671 0 43.89 44.894 43.943 117.329 0 162.276L232.214 383.128c-29.855 30.537-78.633 30.111-107.982-.998-28.275-29.97-27.368-77.473 1.452-106.953l143.743-146.835c6.182-6.314 16.312-6.422 22.626-.241l22.861 22.379c6.315 6.182 6.422 16.312.241 22.626L171.427 319.927c-4.932 5.045-5.236 13.428-.648 18.292 4.372 4.634 11.245 4.711 15.688.165l182.849-186.851c19.613-20.062 19.613-52.725-.011-72.798-19.189-19.627-49.957-19.637-69.154 0L90.39 293.295c-34.763 35.56-35.299 93.12-1.191 128.313 34.01 35.093 88.985 35.137 123.058.286l172.06-175.999c6.177-6.319 16.307-6.433 22.626-.256l22.877 22.364c6.319 6.177 6.434 16.307.256 22.626l-172.06 175.998c-59.576 60.938-155.943 60.216-214.77-.485z"></path>
</svg>
                </button>
            <button>
                <svg stroke="currentColor" fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 16 16" class="comment-send-icon" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"></path>
                </svg>
                    </button>

                    </div>
                    </div>
              </FormItem>
            )}
            />
            </div>

            <div className="relative w-[40%] left-[58%] bottom-[36%] border border-l-1 border-t-0 border-b-0 border-r-0 border-gray-300">
                <div className="flex flex-col gap-4">

                 <FormField
          control={control}
          name="Project"
          render={({ field }) => (
              <FormItem className="">
               <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
<div className="ml-2.5">
<svg  stroke="rgb(155,159,167)" fill="rgb(155,159,167)" stroke-width="0" viewBox="0 0 24 24" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1115 12C11.5662 14.004 13.3584 15.5 15.5 15.5C17.6416 15.5 19.4338 14.004 19.8885 12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H11.1115ZM5 16H7V18H5V16ZM15.5 13.5C14.1193 13.5 13 12.3807 13 11C13 9.61929 14.1193 8.5 15.5 8.5C16.8807 8.5 18 9.61929 18 11C18 12.3807 16.8807 13.5 15.5 13.5ZM11.1115 10H2V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V10H19.8885C19.4338 7.99601 17.6416 6.5 15.5 6.5C13.3584 6.5 11.5662 7.99601 11.1115 10Z"></path>
</svg>
</div>
                <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Project:
                    </h2>
              <FormControl>
                <select 
                className="text-[rgb(120, 122, 126)] text-[15px]"
                style={{border:"none",outline:"none",boxShadow:"none",}}
                {...field}
                >
                  <option value="" disabled selected>
                    Select | 
                  </option>
                </select>
              </FormControl>
                      </FormLabel>
            </FormItem>
          )}
          />
                 <FormField
          control={control}
          name="Status"
          render={({ field }) => (
              <FormItem className="">
               <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
<div className="ml-2.5">
<svg  stroke="rgb(155,159,167)" fill="rgb(155,159,167)" stroke-width="0" viewBox="0 0 24 24" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1115 12C11.5662 14.004 13.3584 15.5 15.5 15.5C17.6416 15.5 19.4338 14.004 19.8885 12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H11.1115ZM5 16H7V18H5V16ZM15.5 13.5C14.1193 13.5 13 12.3807 13 11C13 9.61929 14.1193 8.5 15.5 8.5C16.8807 8.5 18 9.61929 18 11C18 12.3807 16.8807 13.5 15.5 13.5ZM11.1115 10H2V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V10H19.8885C19.4338 7.99601 17.6416 6.5 15.5 6.5C13.3584 6.5 11.5662 7.99601 11.1115 10Z"></path>
</svg>
</div>
                <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Status:
                    </h2>
              <FormControl>

                <select 
                className="text-[rgb(120, 122, 126)] text-[15px]"
                style={{border:"none",outline:"none",boxShadow:"none",}}
                {...field}
                >
                  <option value="" disabled selected>
                    Select  
                  </option>
                  <option value="Backlog">Backlog</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </FormControl>
                      </FormLabel>
            </FormItem>
          )}
          />
                 <FormField
          control={control}
          name="Asignee"
          render={({ field }) => (
              <FormItem className="">
               <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
<div className="ml-2.5">
<svg  stroke="rgb(155,159,167)" fill="rgb(155,159,167)" stroke-width="0" viewBox="0 0 24 24" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M11.1115 12C11.5662 14.004 13.3584 15.5 15.5 15.5C17.6416 15.5 19.4338 14.004 19.8885 12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H11.1115ZM5 16H7V18H5V16ZM15.5 13.5C14.1193 13.5 13 12.3807 13 11C13 9.61929 14.1193 8.5 15.5 8.5C16.8807 8.5 18 9.61929 18 11C18 12.3807 16.8807 13.5 15.5 13.5ZM11.1115 10H2V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V10H19.8885C19.4338 7.99601 17.6416 6.5 15.5 6.5C13.3584 6.5 11.5662 7.99601 11.1115 10Z"></path>
</svg>
</div>
                <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Asignee:
                    </h2>
              <FormControl>
                <select 
                className="text-[rgb(120, 122, 126)] text-[15px]"
                style={{border:"none",outline:"none",boxShadow:"none",}}
                  {...field}
                  >
                  <option value="" disabled selected>
                        Select 
                  </option>
                </select>
              </FormControl>
                      </FormLabel>
            </FormItem>
          )}
          />
           <FormField
              control={control}
              name="StartDate"
              render={({ field }) => (
                <FormItem >
                 <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
        <div className="ml-2.5">
<svg stroke="currentColor" fill="rgb(155,159,167)" stroke-width="0" viewBox="0 0 448 512" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M436 160H12c-6.6 0-12-5.4-12-12v-36c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48v36c0 6.6-5.4 12-12 12zM12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm316 140c0-6.6-5.4-12-12-12h-60v-60c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v60h-60c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h60v60c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12v-60h60c6.6 0 12-5.4 12-12v-40z"></path>
</svg>
        </div>
                     <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Start Date:
                    </h2>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger>
                        <Input
                          type="text"
                          style={{border:"none",outline:"none",boxShadow:"none",}}
                          value={
                              field.value
                              ? new Date(field.value).toLocaleDateString(
                                  "en-CA"
                                )
                                : ""
                            }
                            onChange={field.onChange}
                            placeholder="Start Date"
                            ></Input>
                      </PopoverTrigger>
                      <PopoverContent>
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                              if (date) {
                                  const localDate = new Date(
                                      date.getTime() -
                                      date.getTimezoneOffset() * 60000
                                    );
                                    field.onChange(
                                        localDate.toISOString().split("T")[0]
                                    );
                                }
                            }}
                            dateFormat="yyyy-MM-dd"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
             </FormLabel>
                </FormItem>
              )}
              />
           <FormField
              control={control}
              name="EndDate"
              render={({ field }) => (
                <FormItem >
                 <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
        <div className="ml-2.5">
                <svg stroke="currentColor" fill="rgb(155,159,167)" stroke-width="0" viewBox="0 0 448 512" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M436 160H12c-6.6 0-12-5.4-12-12v-36c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48v36c0 6.6-5.4 12-12 12zM12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm257.3 160l48.1-48.1c4.7-4.7 4.7-12.3 0-17l-28.3-28.3c-4.7-4.7-12.3-4.7-17 0L224 306.7l-48.1-48.1c-4.7-4.7-12.3-4.7-17 0l-28.3 28.3c-4.7 4.7-4.7 12.3 0 17l48.1 48.1-48.1 48.1c-4.7 4.7-4.7 12.3 0 17l28.3 28.3c4.7 4.7 12.3 4.7 17 0l48.1-48.1 48.1 48.1c4.7 4.7 12.3 4.7 17 0l28.3-28.3c4.7-4.7 4.7-12.3 0-17L269.3 352z"></path>
                </svg>
        </div>
                     <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    End Date:
                    </h2>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger>
                        <Input
                          type="text"
                          style={{border:"none",outline:"none",boxShadow:"none",}}
                          value={
                              field.value
                              ? new Date(field.value).toLocaleDateString(
                                  "en-CA"
                                )
                                : ""
                            }
                            onChange={field.onChange}
                            placeholder="End Date"
                            ></Input>
                      </PopoverTrigger>
                      <PopoverContent>
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                              if (date) {
                                  const localDate = new Date(
                                      date.getTime() -
                                      date.getTimezoneOffset() * 60000
                                    );
                                    field.onChange(
                                        localDate.toISOString().split("T")[0]
                                    );
                                }
                            }}
                            dateFormat="yyyy-MM-dd"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
             </FormLabel>
                </FormItem>
              )}
              />
              <FormField
            control={control}
            name="EstimatedTime"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
        <div className="ml-2.5 text-[rgb(155,159,167)]">
              <svg stroke="" fill="none" stroke-width="0" viewBox="0 0 15 15" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.49998 0.5C5.49998 0.223858 5.72383 0 5.99998 0H7.49998H8.99998C9.27612 0 9.49998 0.223858 9.49998 0.5C9.49998 0.776142 9.27612 1 8.99998 1H7.99998V2.11922C9.09832 2.20409 10.119 2.56622 10.992 3.13572C11.0116 3.10851 11.0336 3.08252 11.058 3.05806L12.058 2.05806C12.3021 1.81398 12.6978 1.81398 12.9419 2.05806C13.186 2.30214 13.186 2.69786 12.9419 2.94194L11.967 3.91682C13.1595 5.07925 13.9 6.70314 13.9 8.49998C13.9 12.0346 11.0346 14.9 7.49998 14.9C3.96535 14.9 1.09998 12.0346 1.09998 8.49998C1.09998 5.13361 3.69904 2.3743 6.99998 2.11922V1H5.99998C5.72383 1 5.49998 0.776142 5.49998 0.5ZM2.09998 8.49998C2.09998 5.51764 4.51764 3.09998 7.49998 3.09998C10.4823 3.09998 12.9 5.51764 12.9 8.49998C12.9 11.4823 10.4823 13.9 7.49998 13.9C4.51764 13.9 2.09998 11.4823 2.09998 8.49998ZM7.49998 8.49998V4.09998C5.06992 4.09998 3.09998 6.06992 3.09998 8.49998C3.09998 10.93 5.06992 12.9 7.49998 12.9C8.715 12.9 9.815 12.4075 10.6112 11.6112L7.49998 8.49998Z" fill="currentColor"></path>
              </svg>
        </div>
                     <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Estimated Time:
                    </h2>

{showEstimatedTimeField&&
                <FormControl>
                   <Input
                type="text"
                placeholder=""
                style={{border:"none",outline:"none",boxShadow:"none"}}
                className=" flex   w-[20%] overflow-x-auto"
                {...field}
                />
                </FormControl>}
<div onClick={()=>{setShowEstimatedTimeField(true)}} className={`${showEstimatedTimeField ? "hidden" : " ml-10 cursor-pointer"}`}  >
             <svg stroke="" fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 24 24" class="tasks-add-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <title>update</title>
                <path fill="none" d="M0 0h24v24H0z"></path>
<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                </svg>
</div>
<div className={`${showEstimatedTimeField ? "cursor-pointer" : "hidden"}`} onClick={()=>{setShowEstimatedTimeField(false)}}>
            <svg class="w-6 h-6" width="24" height="24" stroke="currentColor" fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <title>update</title>
            <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
            </svg>
            </div>
                </FormLabel>
              </FormItem>
            )}
            />
               <FormField
          control={control}
          name="Status"
          render={({ field }) => (
              <FormItem className="">
               <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
<div className="ml-2.5">
<svg stroke="currentColor" fill="rgb(155,159,167)" stroke-width="0" viewBox="0 0 24 24" aria-hidden="true" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"></path>
</svg>
</div>
                <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Users :
                    </h2>
              <FormControl>

                <select 
                className="text-[rgb(120, 122, 126)] text-[15px]"
                style={{border:"none",outline:"none",boxShadow:"none",}}
                {...field}
                >
                  <option value="" disabled selected>
                    Select  
                  </option>
                </select>
              </FormControl>
  </FormLabel>
            </FormItem>
          )}
          />
            <FormField
            control={control}
            name="Attachments"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
        <div className="ml-2.5 text-[rgb(155,159,167)]">
              <svg stroke="" fill="none" stroke-width="0" viewBox="0 0 15 15" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.49998 0.5C5.49998 0.223858 5.72383 0 5.99998 0H7.49998H8.99998C9.27612 0 9.49998 0.223858 9.49998 0.5C9.49998 0.776142 9.27612 1 8.99998 1H7.99998V2.11922C9.09832 2.20409 10.119 2.56622 10.992 3.13572C11.0116 3.10851 11.0336 3.08252 11.058 3.05806L12.058 2.05806C12.3021 1.81398 12.6978 1.81398 12.9419 2.05806C13.186 2.30214 13.186 2.69786 12.9419 2.94194L11.967 3.91682C13.1595 5.07925 13.9 6.70314 13.9 8.49998C13.9 12.0346 11.0346 14.9 7.49998 14.9C3.96535 14.9 1.09998 12.0346 1.09998 8.49998C1.09998 5.13361 3.69904 2.3743 6.99998 2.11922V1H5.99998C5.72383 1 5.49998 0.776142 5.49998 0.5ZM2.09998 8.49998C2.09998 5.51764 4.51764 3.09998 7.49998 3.09998C10.4823 3.09998 12.9 5.51764 12.9 8.49998C12.9 11.4823 10.4823 13.9 7.49998 13.9C4.51764 13.9 2.09998 11.4823 2.09998 8.49998ZM7.49998 8.49998V4.09998C5.06992 4.09998 3.09998 6.06992 3.09998 8.49998C3.09998 10.93 5.06992 12.9 7.49998 12.9C8.715 12.9 9.815 12.4075 10.6112 11.6112L7.49998 8.49998Z" fill="currentColor"></path>
              </svg>
        </div>
                     <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Attachments:
                    </h2>


<div className="cursor-pointer" >
          <svg class="w-6 h-6" stroke="currentColor"  fill="rgb(51,141,181)" stroke-width="0" viewBox="0 0 512 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg" style={{transition: "transform 0.3s"}}>
            <title>add</title>
            <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
            <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
            </svg>
            </div>
                <FormControl>
                   <Input
                type="text"
                placeholder=""
                style={{border:"none",outline:"none",boxShadow:"none"}}
                className=" flex   w-[20%] overflow-x-auto"
                {...field}
                />
                </FormControl>
                </FormLabel>
              </FormItem>
            )}
            />
            <FormField
            control={control}
            name="CreatedBy"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
        <div className="ml-2.5 text-[rgb(155,159,167)]">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h274.9c-2.4-6.8-3.4-14-2.6-21.3l6.8-60.9 1.2-11.1 7.9-7.9 77.3-77.3c-24.5-27.7-60-45.5-99.9-45.5zm45.3 145.3l-6.8 61c-1.1 10.2 7.5 18.8 17.6 17.6l60.9-6.8 137.9-137.9-71.7-71.7-137.9 137.8zM633 268.9L595.1 231c-9.3-9.3-24.5-9.3-33.8 0l-37.8 37.8-4.1 4.1 71.8 71.7 41.8-41.8c9.3-9.4 9.3-24.5 0-33.9z"></path>
              </svg>
        </div>
                     <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Created By:
                    </h2>

                <FormControl>
                   <Input
                type="text"
                placeholder=""
                style={{border:"none",outline:"none",boxShadow:"none"}}
                className=" flex   w-[20%] overflow-x-auto"
                {...field}
                />
                </FormControl>
                </FormLabel>
              </FormItem>
            )}
            />
            <FormField
            control={control}
            name="CreatedAt"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
        <div className="ml-2.5 text-[rgb(155,159,167)]">
             
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="tasks-item-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path fill="none" d="M0 0h24v24H0z"></path>
<path d="M10 8v6l4.7 2.9.8-1.2-4-2.4V8z"></path>
<path d="M17.92 12A6.957 6.957 0 0111 20c-3.9 0-7-3.1-7-7s3.1-7 7-7c.7 0 1.37.1 2 .29V4.23c-.64-.15-1.31-.23-2-.23-5 0-9 4-9 9s4 9 9 9a8.963 8.963 0 008.94-10h-2.02z"></path>
<path d="M20 5V2h-2v3h-3v2h3v3h2V7h3V5z"></path>

</svg>


        </div>
                     <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                    Created At:
                    </h2>

                <FormControl>
                   <Input
                type="text"
                placeholder=""
                style={{border:"none",outline:"none",boxShadow:"none"}}
                className=" flex   w-[20%] overflow-x-auto"
                {...field}
                />
                </FormControl>
                </FormLabel>
              </FormItem>
            )}
            />
          </div>
          </div>
        </form>
      </Form>
    </>
  );
}
