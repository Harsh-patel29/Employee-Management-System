import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../Components/components/ui/input';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '../Components/components/ui/form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../Components/components/ui/popover';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../Components/components/ui/alert-dialog';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
  updateTask,
  getTaskById,
  uploadAttachment,
  Attachment,
  resetUploadedImage,
  resetTask,
  deleteUploadedImage,
  deleteTodo,
  resetdeleteImage,
  deleteAttachedFile,
} from '../feature/taskfetch/taskfetchSlice';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { FileText } from 'lucide-react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Loader from './Loader';

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  todo: z.any(),
  comments: z.any(),
  Project: z.string().optional(),
  Status: z.string().optional(),
  Asignee: z.string().optional(),
  Totatime: z.string().optional(),
  StartDate: z.string().optional(),
  EndDate: z.string().optional(),
  EstimatedTime: z.string().optional(),
  Users: z.any().optional(),
  Attachments: z.any().optional(),
});

export default function TaskUpdateForm({ onSubmit, mode }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [taskid, setTaskid] = useState(id);
  const [assignedName, setAssignedName] = useState([]);
  const [Tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState([]);
  const [showTitleField, setShowTitleField] = useState(false);
  const [showDescriptionField, setShowDescriptionField] = useState(false);
  const [showTodoField, setShowTodoField] = useState(false);
  const [showEstimatedTimeField, setShowEstimatedTimeField] = useState(false);
  const [showAttachmentField, setShowAttachmentField] = useState(false);
  const [showdropDown, setShowdropDown] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openTaskAttachmentDialog, setOpenTaskAttachmentDialog] =
    useState(false);
  const [currentPublicId, setCurrentPublicId] = useState('');
  const [currentvalue, setCurrentvalue] = useState('');
  const [localAttachments, setLocalAttachments] = useState([]);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const users = useSelector((state) => state.getuser);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (Tasks?.Attachments) {
      setLocalAttachments(Tasks.Attachments);
    }
  }, [Tasks?.Attachments]);
  const {
    updatedTask,
    getTaskid,
    uploadedAttachment,
    uploadedImage,
    deletedAttachment,
    deletedTodo,
    deletedUploadedImage,
    loading,
    uploadedImageLoading,
    uploadedAttachmentLoading,
  } = useSelector((state) => state.task);
  const [currentAttachments, setCurrentAttachments] = useState([]);
  const [attachment, setAttachment] = useState([]);
  const [openTodoDialog, setOpenTodoDialog] = useState(false);
  const [openTodoUpdateDialog, setOpenTodoUpdateDialog] = useState(false);
  const [todochecked, settodochecked] = useState(false);
  const [todoId, setTodoId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDropDown, setShowUserDropDown] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocx, setSelectedDocx] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  useEffect(() => {
    if (updatedTask?.success) {
      setShowTitleField(false);
      setShowDescriptionField(false);
      setShowEstimatedTimeField(false);
      toast.success('Task Updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(getTaskById(taskid));
    }
  }, [updatedTask, dispatch]);

  useEffect(() => {
    dispatch(getTaskById(taskid));
  }, []);

  useEffect(() => {
    if (getTaskid?.message) {
      setTasks(getTaskid.message.task);
      setProjectName(getTaskid.message.projectName);
      setAssignedName(getTaskid.message.name);
    } else {
      setTasks([]);
    }
  }, [getTaskid]);

  useEffect(() => {
    if (uploadedAttachment?.message) {
      setCurrentAttachments((prev) => [...prev, ...uploadedAttachment.message]);
    }
    return () => {
      dispatch(resetTask());
    };
  }, [uploadedAttachment]);

  useEffect(() => {
    if (uploadedImage?.message) {
      setAttachment((prev) => [...prev, ...uploadedImage?.message]);
    }
    return () => {
      dispatch(resetUploadedImage());
    };
  }, [uploadedImage]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      todo: '',
      comments: '',
      Project: '',
      Status: '',
      Asignee: '',
      Totatime: '',
      StartDate: '',
      EndDate: '',
      EstimatedTime: '',
      Users: '',
      Attachments: [],
    },
  });

  useEffect(() => {
    if (Tasks && Object.keys(Tasks).length > 0) {
      reset({
        title: Tasks.title || '',
        description: Tasks.description || '',
        todo: '',
        comments: '',
        Project: Tasks.Project || '',
        Status: Tasks.Status || '',
        Asignee: Tasks.Asignee || '',
        Totatime: Tasks.Totatime || '',
        StartDate: Tasks.StartDate || '',
        EndDate: Tasks.EndDate || '',
        EstimatedTime: Tasks.EstimatedTime || '',
        CreatedBy: Tasks.createdBy || '',
        Users: Tasks.Users || [],
        Attachments: Tasks.Attachments || [],
      });
      setSelectedUsers(Tasks.Users || []);
    }
  }, [Tasks, reset]);

  const handleUpdateTask = (fieldName, value, field) => {
    const currentValues = control._formValues;
    const updatedData = {
      ...currentValues,
      [fieldName]: value,
      field,
    };

    if (fieldName === 'comments') {
      updatedData.comments = {
        Attachments: currentAttachments.map((file) => ({
          url: file.url,
          public_id: file.public_id,
        })),
        comment: typeof value === 'string' ? value : value.comment || '',
      };
    } else if (fieldName === 'Attachments') {
      updatedData.Attachments = value;
    } else {
      updatedData[fieldName] = value;
    }
    dispatch(updateTask({ data: updatedData, id: taskid }));

    if (fieldName === 'comments') {
      setCurrentAttachments([]);
    }
    return () => {
      dispatch(resetTask());
    };
  };
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    dispatch(Attachment(files))
      .then((response) => {
        e.target.value = '';
      })
      .catch((error) => {
        console.error('Error uploading files', error);
        e.target.value = '';
      });
  };

  useEffect(() => {
    if (!attachment || attachment.length === 0) return;

    const existingAttachments = Array.isArray(Tasks.Attachments)
      ? Tasks.Attachments
      : [];

    const formattedNewAttachments = attachment.map((file) => ({
      url: file.url,
      public_id: file.public_id,
      orignalname: file.original_filename,
    }));

    const isDuplicate = formattedNewAttachments.filter((newAttachment) =>
      existingAttachments.some(
        (existAttach) => existAttach.public_id === newAttachment.public_id
      )
    );

    const nonDuplicates = formattedNewAttachments.filter(
      (newAtt) =>
        !isDuplicate.some((dupAtt) => dupAtt.public_id === newAtt.public_id)
    );

    const newUpload = [...existingAttachments, ...nonDuplicates];
    setAttachment(isDuplicate);

    handleUpdateTask('Attachments', newUpload);
    dispatch(resetUploadedImage());
  }, [attachment]);

  useEffect(() => {
    if (deletedAttachment?.success || deletedUploadedImage?.success) {
      dispatch(getTaskById(taskid));
      toast.success('Task Updated Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [deletedAttachment, deletedUploadedImage]);

  useEffect(() => {
    if (deletedTodo?.success) {
      dispatch(getTaskById(taskid));
    }
  }, [deletedTodo]);

  useEffect(() => {
    if (Tasks?.EndDate && Tasks?.StartDate > Tasks?.EndDate) {
      setEndDate(null);
      setValue('EndDate', null);
    }
  }, [Tasks]);

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const num = parseInt(value, 10);
      if (value === '' || (num >= 0 && num <= 59)) {
        setMinutes(value);
      }
    }
  };

  const projectOptions = projectName?.map((value) => ({
    label: value,
    value: value,
  }));

  const statusOptions = [
    { value: 'Backlog', label: 'Backlog' },
    { value: 'In_Progress', label: 'In_Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Done', label: 'Done' },
    { value: 'Deployed', label: 'Deployed' },
  ];

  const asigneeOptions = assignedName?.map((value) => ({
    label: value,
    value: value,
  }));

  const deleteUser = (userToDelete) => {
    const updatedUsers = Tasks?.Users?.filter((user) => user !== userToDelete);
    setSelectedUsers(updatedUsers);
    handleUpdateTask('Users', updatedUsers);
  };

  const isDeleteable = user?.user?.Name;

  return (
    <>
      <div className="mt-4"></div>
      <Form {...control}>
        <form
          className="max-h-full min-h-screen"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem
                className=" border-b-1 border-gray-300 ps-2 mb-3
                pb-2"
              >
                <FormLabel className="flex items-center">
                  {showTitleField && (
                    <FormControl>
                      <Input
                        type="text"
                        placeholder=""
                        style={{
                          border: 'none',
                          outline: 'none',
                          boxShadow: 'none',
                          fontSize: '20px',
                        }}
                        className="bg-white w-[20%] ml-2 overflow-x-auto text-[20px]"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                  )}
                  {Tasks.title && showTitleField === false && (
                    <div className="ml-5 text-[20px]">{Tasks.title}</div>
                  )}

                  <button
                    type="submit"
                    className={`${
                      showTitleField ? 'cursor-pointer' : 'hidden'
                    }`}
                    onClick={() => {
                      handleUpdateTask('title', field.value);
                    }}
                  >
                    <svg
                      class="w-6 h-6"
                      width="24"
                      height="24"
                      stroke="currentColor"
                      fill="rgb(51,141,181)"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>update</title>
                      <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTitleField(true);
                    }}
                    className={`${
                      showTitleField ? 'hidden' : ' ml-10 cursor-pointer'
                    }`}
                  >
                    <svg
                      class="w-6 h-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="rgb(51,141,181)"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                      />
                    </svg>
                  </button>
                </FormLabel>
                <div className="ml-5 text-[rgb(115,115,115)]">#{taskid}</div>
              </FormItem>
            )}
          />
          <div className="flex w-full h-full justify-between items-start pb-3 ">
            <div className="flex flex-col w-[810px]">
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-center justify-between text-[20px] font-[Inter,sans-serif] ml-5 font-[100] ">
                      Task Description
                      <div
                        className={`${
                          showDescriptionField ? 'cursor-pointer' : 'hidden'
                        }`}
                        onClick={() => {
                          handleUpdateTask('description', field.value);
                        }}
                      >
                        <svg
                          class="w-6 h-6"
                          width="24"
                          height="24"
                          stroke="currentColor"
                          fill="rgb(51,141,181)"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>update</title>
                          <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                        </svg>
                      </div>
                      <div
                        onClick={() => {
                          setShowDescriptionField(true);
                        }}
                        className={`${
                          showDescriptionField
                            ? 'hidden'
                            : ' ml-10 cursor-pointer'
                        }`}
                      >
                        <svg
                          class="w-6 h-6"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="rgb(51,141,181)"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                          />
                        </svg>
                      </div>
                    </FormLabel>

                    {showDescriptionField && (
                      <FormControl>
                        <Input
                          name="description"
                          type="text"
                          placeholder=""
                          style={{
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                          }}
                          className=" flex  bg-white w-[20%] overflow-x-auto ml-2"
                          {...field}
                        />
                      </FormControl>
                    )}
                    {Tasks.description && showDescriptionField === false && (
                      <div className=" ml-6 text-[rgb(115,115,115)]">
                        {Tasks.description}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="todo"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col mt-6">
                    <FormLabel className="flex items-center justify-between text-[20px] font-[Inter,sans-serif] ml-5 font-[100]">
                      Task To-Do List
                      <div
                        className={`${
                          showTodoField ? 'cursor-pointer' : 'hidden'
                        }`}
                        onClick={() => {
                          setShowTodoField(false);
                        }}
                      >
                        <svg
                          stroke="currentColor"
                          fill="rgb(51,141,181)"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          class="w-6 h-6"
                          height="24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            transition: 'transform 0.3s',
                            transform: 'rotate(45deg)',
                          }}
                        >
                          <title>close</title>
                          <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
                          <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
                        </svg>
                      </div>
                      <div
                        onClick={() => {
                          setShowTodoField(true);
                        }}
                        className={`${
                          showTodoField ? 'hidden' : ' ml-10 cursor-pointer'
                        }`}
                      >
                        <svg
                          class="w-6 h-6"
                          stroke="currentColor"
                          fill="rgb(51,141,181)"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ transition: 'transform 0.3s' }}
                        >
                          <title>add</title>
                          <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
                          <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
                        </svg>
                      </div>
                    </FormLabel>
                    <div className="flex w-full">
                      {showTodoField && (
                        <FormControl>
                          <Input
                            name="todo"
                            type="text"
                            placeholder="Todo Title"
                            style={{
                              borderTopRightRadius: '0px',
                              borderBottomRightRadius: '0px',
                              borderColor: '#e0e0e0',
                              outline: 'none',
                              boxShadow: 'none',
                            }}
                            className=" flex bg-white w-[100%] overflow-x-auto ml-5.5"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleUpdateTask('todo', {
                                  todoTitle: field.value,
                                });
                                field.onChange('');
                              }
                            }}
                            {...field}
                          ></Input>
                        </FormControl>
                      )}
                      <button
                        type="submit"
                        onClick={() => {
                          handleUpdateTask('todo', { todoTitle: field.value });
                          field.onChange('');
                        }}
                        className={`${
                          showTodoField
                            ? 'bg-[rgb(51,141,181)] text-white rounded-r-md w-10 flex justify-center items-center hover:bg-[rgb(41,131,181)] transition-all duration-100 cursor-pointer'
                            : 'hidden'
                        }`}
                      >
                        <svg
                          stroke="#ffffff"
                          fill="#ffffff"
                          stroke-width="0"
                          viewBox="0 0 512 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path>
                        </svg>
                      </button>
                    </div>
                    {Tasks.todo && (
                      <div className="flex overflow-y-auto flex-col ml-2 mt-2 w-full max-h-[300px]">
                        {Object.entries(Tasks.todo).map(([key, value]) => (
                          <div
                            key={key}
                            className="mb-1  flex justify-between items-center relative"
                          >
                            <div
                              className={`flex  min-h-[45px] justify-start items-center pl-2 w-full h-full cursor-pointer rounded-md ${value.todoStatus ? ' bg-[rgb(211,248,211)]' : ' bg-[rgb(241,236,236)] hover:bg-[rgba(225,232,237,255)]'}`}
                            >
                              <input
                                type="checkbox"
                                className="w-5 h-5 flex items-center"
                                checked={value.todoStatus}
                                onChange={() => {
                                  const updatedData = {
                                    todoIndex: parseInt(key),
                                    todoStatus: !value.todoStatus,
                                  };
                                  setOpenTodoUpdateDialog(true);
                                  settodochecked(updatedData);
                                }}
                              />
                              <span
                                className={`flex relative h-full items-center pl-2 pb-1 text-[rgb(115,115,115)] ${value.todoStatus ? 'line-through ' : ''}`}
                              >
                                {value.todoTitle}
                              </span>
                            </div>
                            <div className="absolute right-2 pb-1 cursor-pointer">
                              <svg
                                onClick={() => {
                                  setTodoId(value._id);
                                  setOpenTodoDialog(true);
                                }}
                                stroke="currentColor"
                                fill="red"
                                stroke-width="0"
                                viewBox="0 0 512 512"
                                class="w-6 h-6"
                                height="24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  transition: 'transform 0.3s',
                                  transform: 'rotate(45deg)',
                                }}
                              >
                                <title>close</title>
                                <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
                                <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Update Todo Alert */}
                    <AlertDialog
                      open={openTodoUpdateDialog}
                      onOpenChange={setOpenTodoUpdateDialog}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Update Todo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to update this todo?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => {
                              dispatch(
                                updateTask({ data: todochecked, id: taskid })
                              );
                              setOpenTodoDialog(false);
                            }}
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog
                      open={openTodoDialog}
                      onOpenChange={setOpenTodoDialog}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this todo? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 text-white hover:bg-red-700"
                            onClick={() => {
                              dispatch(
                                deleteTodo({ data: todoId, id: taskid })
                              );
                              setOpenTodoDialog(false);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="comments"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col mt-6 bg-white shadow-2xl border-t-[rgb(226,226,226)] border-2 h-auto min-h-40 pb-8 rounded-md ml-2 overflow-y-auto">
                    <FormLabel
                      className="flex items-start mt-2 text-[20px]  ml-5 font-[100] font-[Inter,sans-serif] 
                          text-decoration-line: underline decoration-[rgb(205,179,162)]"
                    >
                      Comments
                    </FormLabel>
                    {uploadedAttachmentLoading ? (
                      <div
                        className="flex justify-center items-center h-10 w-full
                      "
                      >
                        <Loader />
                      </div>
                    ) : (
                      <>
                        {currentAttachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-2 ml-4 border-b-2 mr-4 border-gray-300">
                            {currentAttachments.map((value, index) => (
                              <div key={index} className="relative">
                                <div>
                                  <div
                                    className=" absolute top-0 right-0 flex justify-end bg-white rounded-full m-1 mt-1  cursor-pointer"
                                    onClick={() => {
                                      setCurrentvalue(value.public_id);
                                      setOpenDialog(true);
                                    }}
                                  >
                                    <svg
                                      class="w-4 h-4 text-red-500"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      style={{
                                        transition: 'transform 0.3s',
                                        transform: 'rotate(45deg)',
                                      }}
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 12h14m-7 7V5"
                                      />
                                    </svg>
                                  </div>
                                  {value.url.split('.').includes('docx') ||
                                  value.url.split('.').includes('xlsx') ||
                                  value.url.split('.').includes('pptx') ? (
                                    <div>
                                      <FileText className="w-[90px] h-[90px] object-cover text-[rgb(51,141,181)]" />
                                    </div>
                                  ) : value.url.split('.').includes('pdf') ? (
                                    <div>
                                      <FileText className="h-[90px] w-[90px] object-cover text-[rgb(51,141,181)]" />
                                    </div>
                                  ) : (
                                    <img
                                      src={value?.url}
                                      alt="Attachment"
                                      className="w-[90px] h-[90px] object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this attachment?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 text-white hover:bg-red-700"
                            onClick={() => {
                              dispatch(deleteAttachedFile(currentvalue));
                              setCurrentAttachments(
                                currentAttachments.filter(
                                  (attachment) =>
                                    attachment.public_id !== currentvalue
                                )
                              );
                              setOpenDialog(false);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="relative flex items-center w-full px-2 mt-2">
                      <FormControl className="flex-grow">
                        <Input
                          id="comments"
                          name="comments"
                          type="text"
                          className="shadow h-10 mt-3 mb-3 w-[98%] ml-2  bg-[rgba(249,249,249,0.65)]"
                          style={{
                            border: '1px solid #338db5',
                            borderRadius: '20px',
                            boxShadow: 'none',
                          }}
                          placeholder="Write your comment here..."
                          {...field}
                        />
                      </FormControl>
                      <div className="absolute right-6 flex gap-3 mt-3">
                        <label
                          htmlFor="attachment-button"
                          className="cursor-pointer inline-block"
                        >
                          <svg
                            stroke=""
                            fill="rgb(51,141,181)"
                            stroke-width="0"
                            viewBox="0 0 448 512"
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M43.246 466.142c-58.43-60.289-57.341-157.511 1.386-217.581L254.392 34c44.316-45.332 116.351-45.336 160.671 0 43.89 44.894 43.943 117.329 0 162.276L232.214 383.128c-29.855 30.537-78.633 30.111-107.982-.998-28.275-29.97-27.368-77.473 1.452-106.953l143.743-146.835c6.182-6.314 16.312-6.422 22.626-.241l22.861 22.379c6.315 6.182 6.422 16.312.241 22.626L171.427 319.927c-4.932 5.045-5.236 13.428-.648 18.292 4.372 4.634 11.245 4.711 15.688.165l182.849-186.851c19.613-20.062 19.613-52.725-.011-72.798-19.189-19.627-49.957-19.637-69.154 0L90.39 293.295c-34.763 35.56-35.299 93.12-1.191 128.313 34.01 35.093 88.985 35.137 123.058.286l172.06-175.999c6.177-6.319 16.307-6.433 22.626-.256l22.877 22.364c6.319 6.177 6.434 16.307.256 22.626l-172.06 175.998c-59.576 60.938-155.943 60.216-214.77-.485z"></path>
                          </svg>
                        </label>
                        <input
                          type="file"
                          id="attachment-button"
                          multiple
                          className="hidden"
                          accept=""
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              dispatch(uploadAttachment(files));
                            }
                          }}
                        />
                        <button
                          id="comment-send-button"
                          className="mb-3 disabled:cursor-not-allowed "
                          onClick={() => {
                            handleUpdateTask('comments', {
                              Attachments:
                                currentAttachments.map((file) => ({
                                  url: file.url,
                                  public_id: file.public_id,
                                })) || [],
                              comment: field.value,
                            });
                            field.onChange('');
                          }}
                          disabled={
                            currentAttachments.length === 0 &&
                            field.value === ''
                          }
                        >
                          <svg
                            stroke="currentColor"
                            fill="rgb(51,141,181)"
                            stroke-width="0"
                            viewBox="0 0 16 16"
                            class="comment-send-icon"
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto flex flex-col gap-2">
                      {Tasks.comments?.map((value) => (
                        <div key={value._id} className="h-auto">
                          <div className="flex items-center gap-2">
                            <p className="ml-2 bg-[rgba(61,66,179,0.92)] text-white rounded-full p-2 w-8 h-8 flex items-center justify-center">
                              {value.user
                                ? value.user
                                    .split(' ')
                                    .map((name) => name[0])
                                    .join('')
                                    .toUpperCase()
                                : user.user.Name.split(' ')
                                    .map((name) => name[0])
                                    .join('')
                                    .toUpperCase()}
                            </p>
                            <div className="flex flex-col bg-[rgba(249,249,249,0.65)] rounded-2xl  p-2 mr-7 overflow-y-auto mt-2  justify-center border-2 border-[rgb(226,226,226)] w-full">
                              <div className="flex items-center gap-6">
                                <p className="ml-3">
                                  {value.user || user.user.Name}
                                </p>
                                <p className="text-[rgb(115,115,115)]">
                                  {value.createdAt
                                    ? format(
                                        new Date(value.createdAt),
                                        'MMM, dd, yyyy, hh:mm:ss a'
                                      )
                                    : ''}
                                </p>
                              </div>
                              <p className="text-[rgb(115,115,115)] ml-2 mb-2 mt-2">
                                {value.comment}
                              </p>
                              <div
                                className={`${value.Attachments.map((file) => (file.url === '' ? '' : ''))}`}
                              ></div>
                              <div className="grid grid-cols-7 gap-y-2 max-h-48 min-h-auto gap-1 w-full overflow-auto">
                                {value.Attachments.map((file, index) => (
                                  <div className="ml-1">
                                    {file.url.split('.').includes('pdf') ? (
                                      <div
                                        key={index}
                                        className="w-[90px] h-[90px] cursor-pointer"
                                        onClick={() => {
                                          setSelectedFileType('pdf');
                                          setSelectedFile(file.url);
                                          setOpenImageDialog(true);
                                        }}
                                      >
                                        <FileText className="w-[90%] h-[90%] text-[rgb(51,141,181)]" />
                                      </div>
                                    ) : file.url.split('.').includes('docx') ||
                                      file.url.split('.').includes('pptx') ||
                                      file.url.split('.').includes('xlsx') ? (
                                      <div
                                        key={index}
                                        className="w-[90px] h-[90px] cursor-pointer"
                                        onClick={() => {
                                          setSelectedFileType('docx');
                                          setSelectedDocx(file.url);
                                          setOpenImageDialog(true);
                                        }}
                                      >
                                        <FileText className="w-[90%] h-[90%] text-[rgb(51,141,181)]" />
                                      </div>
                                    ) : (
                                      <img
                                        key={index}
                                        src={file.url}
                                        className="w-[90px] h-[90px] cursor-pointer"
                                        alt="Attachment"
                                        onClick={() => {
                                          setSelectedFileType('image');
                                          setSelectedImage(file.url);
                                          setOpenImageDialog(true);
                                        }}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {openImageDialog &&
                        (selectedFile || selectedImage || selectedDocx) && (
                          <div
                            className="fixed inset-0  flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
                            onClick={() => {
                              setOpenImageDialog(false);
                            }}
                          >
                            <div
                              className="relative bg-gradient-to-br bg-white  p-6 rounded-xl shadow-2xl  max-h-[95%] border border-slate-700"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <div className="flex justify-between pb-4">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                                  Media Viewer
                                </h1>
                                <button
                                  className="font-bold text-2xl text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                                  onClick={() => setOpenImageDialog(false)}
                                >
                                  &times;
                                </button>
                              </div>
                              {selectedFileType === 'image' ? (
                                <img
                                  src={selectedImage}
                                  alt="Full View"
                                  className="flex max-w-full max-h-[80vh] rounded-lg shadow-lg"
                                />
                              ) : selectedFileType === 'docx' ? (
                                <div className="relative w-180 h-150">
                                  <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedDocx)}&embedded=true`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                  />
                                </div>
                              ) : (
                                <div className="relative w-180 h-150">
                                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                    <Viewer
                                      fileUrl={selectedFile}
                                      plugins={[defaultLayoutPluginInstance]}
                                    />
                                  </Worker>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="mr-20 pb-6 w-[34%]">
              <div className="flex flex-col gap-4 border  border-l-1 border-t-0 border-b-0 border-r-0 border-gray-300">
                <FormField
                  control={control}
                  name="Project"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
                        <div className="ml-2.5">
                          <svg
                            stroke="rgb(155,159,167)"
                            fill="rgb(155,159,167)"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1115 12C11.5662 14.004 13.3584 15.5 15.5 15.5C17.6416 15.5 19.4338 14.004 19.8885 12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H11.1115ZM5 16H7V18H5V16ZM15.5 13.5C14.1193 13.5 13 12.3807 13 11C13 9.61929 14.1193 8.5 15.5 8.5C16.8807 8.5 18 9.61929 18 11C18 12.3807 16.8807 13.5 15.5 13.5ZM11.1115 10H2V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V10H19.8885C19.4338 7.99601 17.6416 6.5 15.5 6.5C13.3584 6.5 11.5662 7.99601 11.1115 10Z"></path>
                          </svg>
                        </div>
                        <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                          Project:
                        </h2>
                        <FormControl>
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                border: 'none',
                                boxShadow: 'none',
                                fontSize: '15px',
                                color: 'rgb(120, 122, 126)',
                                backgroundColor: 'transparent',
                              }),
                              placeholder: (baseStyles) => ({
                                ...baseStyles,
                                color: 'rgb(120, 122, 126)',
                                fontSize: '15px',
                              }),
                              option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isFocused
                                  ? 'rgb(51,141,181)'
                                  : 'white',
                                color: state.isFocused
                                  ? 'white'
                                  : 'rgb(120, 122, 126)',
                                ':hover': {
                                  backgroundColor: 'rgb(51,141,181)',
                                },
                              }),
                              menu: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: 'white',
                              }),
                            }}
                            className="text-[rgb(120, 122, 126)] text-[14px]"
                            placeholder={Tasks?.Project || 'Select Project'}
                            {...field}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption.value);
                              handleUpdateTask(
                                'Project',
                                selectedOption.value,
                                'Project'
                              );
                            }}
                            options={projectOptions}
                          />
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
                          <svg
                            stroke="rgb(155,159,167)"
                            fill="rgb(155,159,167)"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1115 12C11.5662 14.004 13.3584 15.5 15.5 15.5C17.6416 15.5 19.4338 14.004 19.8885 12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H11.1115ZM5 16H7V18H5V16ZM15.5 13.5C14.1193 13.5 13 12.3807 13 11C13 9.61929 14.1193 8.5 15.5 8.5C16.8807 8.5 18 9.61929 18 11C18 12.3807 16.8807 13.5 15.5 13.5ZM11.1115 10H2V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V10H19.8885C19.4338 7.99601 17.6416 6.5 15.5 6.5C13.3584 6.5 11.5662 7.99601 11.1115 10Z"></path>
                          </svg>
                        </div>
                        <h2 className="text-[rgb(120, 122, 126)] text-[15px] min-w-10">
                          Status:
                        </h2>
                        <FormControl>
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                border: 'none',
                                boxShadow: 'none',
                                fontSize: '15px',
                                color: 'rgb(120, 122, 126)',
                                backgroundColor: 'transparent',
                              }),
                              placeholder: (baseStyles) => ({
                                ...baseStyles,
                                color: 'rgb(120, 122, 126)',
                                fontSize: '15px',
                              }),
                              option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isFocused
                                  ? 'rgb(51,141,181)'
                                  : 'white',
                                color: state.isFocused
                                  ? 'white'
                                  : 'rgb(120, 122, 126)',
                                ':hover': {
                                  backgroundColor: 'rgb(51,141,181)',
                                },
                              }),
                              menu: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: 'white',
                              }),
                            }}
                            className="text-[rgb(120, 122, 126)] text-[14px]"
                            placeholder={Tasks?.Status}
                            {...field}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption.value);
                              handleUpdateTask('Status', selectedOption.value);
                            }}
                            options={statusOptions}
                          />
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
                          <svg
                            stroke="rgb(155,159,167)"
                            fill="rgb(155,159,167)"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11.1115 12C11.5662 14.004 13.3584 15.5 15.5 15.5C17.6416 15.5 19.4338 14.004 19.8885 12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H11.1115ZM5 16H7V18H5V16ZM15.5 13.5C14.1193 13.5 13 12.3807 13 11C13 9.61929 14.1193 8.5 15.5 8.5C16.8807 8.5 18 9.61929 18 11C18 12.3807 16.8807 13.5 15.5 13.5ZM11.1115 10H2V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V10H19.8885C19.4338 7.99601 17.6416 6.5 15.5 6.5C13.3584 6.5 11.5662 7.99601 11.1115 10Z"></path>
                          </svg>
                        </div>
                        <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                          Asignee:
                        </h2>
                        <FormControl>
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                border: 'none',
                                boxShadow: 'none',
                                fontSize: '15px',
                                color: 'rgb(120, 122, 126)',
                                backgroundColor: 'transparent',
                                minWidth: '120px',
                                width: 'auto',
                              }),
                              placeholder: (baseStyles) => ({
                                ...baseStyles,
                                color: 'rgb(120, 122, 126)',
                                fontSize: '15px',
                              }),
                              option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isFocused
                                  ? 'rgb(51,141,181)'
                                  : 'white',
                                color: state.isFocused
                                  ? 'white'
                                  : 'rgb(120, 122, 126)',
                                ':hover': {
                                  backgroundColor: 'rgb(51,141,181)',
                                },
                              }),
                              menu: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: 'white',
                              }),
                            }}
                            value={field.value}
                            isDisabled={!Tasks?.Project}
                            className="text-[rgb(120, 122, 126)] text-[14px]"
                            placeholder={
                              Tasks?.Project ? Tasks?.Asignee : 'Select Asignee'
                            }
                            {...field}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption.value);
                              handleUpdateTask('Asignee', selectedOption.value);
                            }}
                            options={asigneeOptions}
                          />
                        </FormControl>
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="StartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
                        <div className="ml-2.5">
                          <svg
                            stroke="currentColor"
                            fill="rgb(155,159,167)"
                            stroke-width="0"
                            viewBox="0 0 448 512"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M436 160H12c-6.6 0-12-5.4-12-12v-36c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48v36c0 6.6-5.4 12-12 12zM12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm316 140c0-6.6-5.4-12-12-12h-60v-60c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v60h-60c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h60v60c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12v-60h60c6.6 0 12-5.4 12-12v-40z"></path>
                          </svg>
                        </div>
                        <h2 className="text-[rgb(120, 122, 126)] text-[15px] ">
                          Start Date:
                        </h2>
                        <div className="flex w-[30%] items-center">
                          <FormControl>
                            <Popover>
                              <PopoverTrigger>
                                <Input
                                  className="text-[rgb(120,122,126)]"
                                  type="text"
                                  style={{
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                  }}
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                          .toLocaleDateString('en-GB')
                                          .split('/')
                                          .join('-')
                                      : ''
                                  }
                                  onChange={field.onChange}
                                  placeholder="Start Date"
                                ></Input>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 w-0 h-0">
                                <DatePicker
                                  selected={field.value ? startDate : null}
                                  onChange={(date) => {
                                    if (date) {
                                      setStartDate(date);
                                      const localDate = new Date(
                                        date.getTime() -
                                          date.getTimezoneOffset() * 60000
                                      );
                                      field.onChange(
                                        localDate.toISOString().split('T')[0]
                                      );
                                      handleUpdateTask(
                                        'StartDate',
                                        localDate.toISOString().split('T')[0]
                                      );
                                    }
                                  }}
                                  inline
                                  dateFormat="yyyy-MM-dd"
                                  showYearDropdown
                                  scrollableYearDropdown
                                  yearDropdownItemNumber={100}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          {Tasks?.StartDate && (
                            <button
                              className="cursor-pointer"
                              onClick={() => {
                                handleUpdateTask('StartDate', '');
                              }}
                            >
                              <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="rgb(51,141,181)"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="EndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
                        <div className="ml-2.5">
                          <svg
                            stroke="currentColor"
                            fill="rgb(155,159,167)"
                            stroke-width="0"
                            viewBox="0 0 448 512"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M436 160H12c-6.6 0-12-5.4-12-12v-36c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48v36c0 6.6-5.4 12-12 12zM12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm257.3 160l48.1-48.1c4.7-4.7 4.7-12.3 0-17l-28.3-28.3c-4.7-4.7-12.3-4.7-17 0l-48.1 48.1-48.1-48.1c-4.7-4.7-12.3-4.7-17 0l-28.3 28.3c-4.7 4.7-4.7 12.3 0 17l48.1 48.1-48.1 48.1c-4.7 4.7-4.7 12.3 0 17l28.3 28.3c4.7 4.7 12.3 4.7 17 0l48.1-48.1 48.1 48.1c4.7 4.7 12.3 4.7 17 0l28.3-28.3c4.7-4.7 4.7-12.3 0-17L269.3 352z"></path>
                          </svg>
                        </div>
                        <h2 className="text-[rgb(120, 122, 126)] text-[15px] min-w-18">
                          End Date:
                        </h2>
                        <div className="flex w-[30%] items-center">
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Input
                                  className="text-[rgb(120,122,126)]"
                                  disabled={!Tasks?.StartDate}
                                  type=""
                                  style={{
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                  }}
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                          .toLocaleDateString('en-GB')
                                          .split('/')
                                          .join('-')
                                      : ''
                                  }
                                  onChange={field.onChange}
                                  placeholder="End Date"
                                />
                              </PopoverTrigger>
                              <PopoverContent className="p-0 w-20 h-0">
                                <DatePicker
                                  selected={field.value ? endDate : null}
                                  onChange={(date) => {
                                    if (date) {
                                      setEndDate(date);
                                      const localDate = new Date(
                                        date.getTime() -
                                          date.getTimezoneOffset() * 60000
                                      );
                                      field.onChange(
                                        localDate.toISOString().split('T')[0]
                                      );
                                      handleUpdateTask(
                                        'EndDate',
                                        localDate.toISOString().split('T')[0]
                                      );
                                    }
                                  }}
                                  minDate={Tasks?.StartDate}
                                  inline
                                  dateFormat="yyyy-MM-dd"
                                  showYearDropdown
                                  scrollableYearDropdown
                                  yearDropdownItemNumber={100}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          {Tasks?.EndDate && (
                            <button
                              className="cursor-pointer"
                              onClick={() => {
                                handleUpdateTask('EndDate', '');
                              }}
                            >
                              <svg
                                class="w-6 h-6 text-gray-800 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="rgb(51,141,181)"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
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
                          <svg
                            stroke=""
                            fill="none"
                            stroke-width="0"
                            viewBox="0 0 15 15"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M5.49998 0.5C5.49998 0.223858 5.72383 0 5.99998 0H7.49998H8.99998C9.27612 0 9.49998 0.223858 9.49998 0.5C9.49998 0.776142 9.27612 1 8.99998 1H7.99998V2.11922C9.09832 2.20409 10.119 2.56622 10.992 3.13572C11.0116 3.10851 11.0336 3.08252 11.058 3.05806L12.058 2.05806C12.3021 1.81398 12.6978 1.81398 12.9419 2.05806C13.186 2.30214 13.186 2.69786 12.9419 2.94194L11.967 3.91682C13.1595 5.07925 13.9 6.70314 13.9 8.49998C13.9 12.0346 11.0346 14.9 7.49998 14.9C3.96535 14.9 1.09998 12.0346 1.09998 8.49998C1.09998 5.13361 3.69904 2.3743 6.99998 2.11922V1H5.99998C5.72383 1 5.49998 0.776142 5.49998 0.5ZM2.09998 8.49998C2.09998 5.51764 4.51764 3.09998 7.49998 3.09998C10.4823 3.09998 12.9 5.51764 12.9 8.49998C12.9 11.4823 10.4823 13.9 7.49998 13.9C4.51764 13.9 2.09998 11.4823 2.09998 8.49998ZM7.49998 8.49998V4.09998C5.06992 4.09998 3.09998 6.06992 3.09998 8.49998C3.09998 10.93 5.06992 12.9 7.49998 12.9C8.715 12.9 9.815 12.4075 10.6112 11.6112L7.49998 8.49998Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <h2 className="text-[rgb(120, 122, 126)] text-[15px]">
                          Estimated Time:
                        </h2>
                        {showEstimatedTimeField && (
                          <FormControl>
                            <div
                              className="flex items-center gap-2  text-sm text-[rgb(115,122,126)]"
                              {...field}
                            >
                              <input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                placeholder="Hours"
                                min="0"
                                className="w-17 px-2 py-1 text-sm text-center text-gray-800 rounded-md focus:outline-none"
                              />

                              <span className="text-lg font-semibold text-gray-700 dark:text-white">
                                :
                              </span>
                              <input
                                type="text"
                                value={minutes}
                                onChange={handleMinutesChange}
                                placeholder="Minutes"
                                className="w-16 px-2 py-1 text-sm text-center text-gray-800  rounded-md focus:outline-none"
                              />
                            </div>
                          </FormControl>
                        )}
                        {Tasks?.EstimatedTime &&
                          showEstimatedTimeField === false && (
                            <div className="text-[rgb(120,122,126)]">
                              {Tasks?.EstimatedTime}
                            </div>
                          )}
                        <button
                          className={
                            showEstimatedTimeField ? 'cursor-pointer' : 'hidden'
                          }
                          onClick={() => {
                            const [existingHours, existingMinutes] = (
                              field.value || '0:00'
                            ).split(':');

                            const finalHours =
                              hours !== '' ? hours : existingHours;
                            const finalMinutes =
                              minutes !== '' ? minutes : existingMinutes;

                            const paddedMinutes = finalMinutes
                              .toString()
                              .padStart(2, '0');

                            handleUpdateTask(
                              'EstimatedTime',
                              `${finalHours}:${paddedMinutes}`
                            );
                          }}
                        >
                          <svg
                            class="w-6 h-6"
                            width="24"
                            height="24"
                            stroke="currentColor"
                            fill="rgb(51,141,181)"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path>
                          </svg>
                        </button>
                        <div
                          onClick={() => {
                            setShowEstimatedTimeField(true);
                          }}
                          className={`${
                            showEstimatedTimeField
                              ? 'hidden'
                              : ' ml-10 cursor-pointer'
                          }`}
                        >
                          <svg
                            class="w-6 h-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="rgb(51,141,181)"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                            />
                          </svg>
                        </div>
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="Users"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
                        <div className="ml-2.5">
                          <svg
                            stroke="currentColor"
                            fill="rgb(155,159,167)"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"></path>
                          </svg>
                        </div>
                        <h2 className="text-[rgb(120, 122, 126)] text-[15px] min-w-12">
                          Users:
                        </h2>
                        <div className="flex gap-1">
                          {Tasks?.Project &&
                            Tasks?.Users?.map((user, index) => {
                              const initials = user
                                ?.split(' ')
                                .map((name) => name[0])
                                .join('')
                                .toUpperCase();
                              return (
                                <p
                                  key={index}
                                  className="ml-1 text-sm bg-[rgba(61,66,179,0.92)] text-white rounded-full w-7 h-7 flex items-center justify-center"
                                >
                                  {initials}
                                </p>
                              );
                            })}
                        </div>
                        <div className="flex justify-between w-full">
                          <FormControl>
                            <Select
                              styles={{
                                control: (baseStyles) => ({
                                  ...baseStyles,
                                  border: 'none',
                                  boxShadow: 'none',
                                  fontSize: '15px',
                                  color: 'rgb(120, 122, 126)',
                                  backgroundColor: 'transparent',
                                  width: 'auto',
                                }),
                                placeholder: (baseStyles) => ({
                                  ...baseStyles,
                                  color: 'rgb(120, 122, 126)',
                                  fontSize: '15px',
                                  width: 'auto',
                                }),
                                option: (baseStyles, state) => ({
                                  ...baseStyles,
                                  backgroundColor: state.isFocused
                                    ? 'rgb(51,141,181)'
                                    : 'white',
                                  color: state.isFocused
                                    ? 'white'
                                    : 'rgb(120, 122, 126)',
                                  ':hover': {
                                    backgroundColor: 'rgb(51,141,181)',
                                  },
                                }),
                                menu: (baseStyles) => ({
                                  ...baseStyles,
                                  backgroundColor: 'white',
                                  minWidth: '100px',
                                  maxWidth: 'auto',
                                }),
                              }}
                              className="text-[rgb(120, 122, 126)] text-[14px]"
                              {...field}
                              isDisabled={!Tasks?.Project}
                              onChange={(selectedOption) => {
                                const updatedUsers = selectedOption
                                  ? [
                                      ...Tasks.Users.filter(
                                        (user) => user !== selectedOption.value
                                      ),
                                      selectedOption.value,
                                    ]
                                  : [...Tasks.Users];
                                field.onChange(updatedUsers);
                                setSelectedUsers(updatedUsers);
                                handleUpdateTask(
                                  'Users',
                                  updatedUsers,
                                  'Users'
                                );
                              }}
                              options={asigneeOptions}
                            />
                          </FormControl>
                          <div className=" flex justify-end text-[15px] font-[Inter,sans-serif] mr-5 font-[100] bg-transparent">
                            {Tasks?.Users?.length > 0 &&
                              showUserDropDown === false && (
                                <button
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setShowUserDropDown(true);
                                  }}
                                >
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    class="tasks-item-icon"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                                  </svg>
                                </button>
                              )}
                            {Tasks?.Users?.length > 0 &&
                              showUserDropDown === true && (
                                <button
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setShowUserDropDown(false);
                                  }}
                                >
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    class="tasks-item-icon"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
                                  </svg>
                                </button>
                              )}
                          </div>
                        </div>
                      </FormLabel>
                      {showUserDropDown === true &&
                        Tasks?.Users &&
                        Tasks?.Users?.length > 0 && (
                          <div className="h-auto min-h-11 items-center flex rounded-md pl-2 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)]">
                            {Tasks?.Users && showUserDropDown === true && (
                              <div className="flex flex-col w-[98%] justify-end font-light text-[15px] font-[rgb(115,115,115)]">
                                {Tasks?.Users?.map((user, index) => (
                                  <div
                                    key={index}
                                    className="cursor-pointer flex justify-between items-center h-auto pb-2 pt-1"
                                  >
                                    <span className="flex gap-4 items-center">
                                      <p className="bg-[rgba(61,66,179,0.92)] text-white text-center rounded-full w-7 h-7 flex items-center  justify-center">
                                        {user
                                          .split(' ')
                                          .map((name) => name[0])
                                          .join('')
                                          .toUpperCase()}
                                      </p>
                                      <h6>{user}</h6>
                                    </span>
                                    <div
                                      className={`${isDeleteable === user ? 'hidden' : ''}`}
                                    >
                                      <svg
                                        className="cursor-pointer"
                                        onClick={() => {
                                          setCurrentUserId(user);
                                          setOpenUserDialog(true);
                                        }}
                                        stroke="currentColor"
                                        fill="red"
                                        stroke-width="0"
                                        viewBox="0 0 512 512"
                                        class="w-4 h-4"
                                        height="20"
                                        width="20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{
                                          transition: 'transform 0.3s',
                                          transform: 'rotate(45deg)',
                                        }}
                                      >
                                        <title>close</title>
                                        <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
                                        <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                    </FormItem>
                  )}
                />
                <AlertDialog
                  open={openUserDialog}
                  onOpenChange={setOpenUserDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        {`Are you sure you want to remove ${currentUserId} from this particular task?`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white hover:bg-red-700"
                        onClick={() => {
                          deleteUser(currentUserId);
                          setOpenUserDialog(false);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <FormField
                  control={control}
                  name="Attachments"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
                        <div className="ml-2.5 text-[rgb(155,159,167)]">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            version="1.1"
                            viewBox="0 0 16 16"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10.404 5.11l-1.015-1.014-5.075 5.074c-0.841 0.841-0.841 2.204 0 3.044s2.204 0.841 3.045 0l6.090-6.089c1.402-1.401 1.402-3.673 0-5.074s-3.674-1.402-5.075 0l-6.394 6.393c-0.005 0.005-0.010 0.009-0.014 0.013-1.955 1.955-1.955 5.123 0 7.077s5.123 1.954 7.078 0c0.004-0.004 0.008-0.009 0.013-0.014l0.001 0.001 4.365-4.364-1.015-1.014-4.365 4.363c-0.005 0.004-0.009 0.009-0.013 0.013-1.392 1.392-3.656 1.392-5.048 0s-1.392-3.655 0-5.047c0.005-0.005 0.009-0.009 0.014-0.013l-0.001-0.001 6.395-6.393c0.839-0.84 2.205-0.84 3.045 0s0.839 2.205 0 3.044l-6.090 6.089c-0.28 0.28-0.735 0.28-1.015 0s-0.28-0.735 0-1.014l5.075-5.075z"></path>
                          </svg>
                        </div>
                        <div className="flex w-full justify-start gap-4">
                          <h2 className="text-[rgb(120, 122, 126)] text-[15px] ">
                            Attachments {`(${Tasks?.Attachments?.length})`}:
                          </h2>
                          <label className="cursor-pointer">
                            {uploadedImageLoading ? (
                              <div className="flex justify-center items-center h-6 w-6">
                                <Loader height={30} width={30} />
                              </div>
                            ) : (
                              <svg
                                class="w-6 h-6"
                                stroke="currentColor"
                                fill="rgb(51,141,181)"
                                stroke-width="0"
                                viewBox="0 0 512 512"
                                height="24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ transition: 'transform 0.3s' }}
                              >
                                <title>add</title>
                                <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
                                <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
                              </svg>
                            )}
                            <input
                              type="file"
                              id="attachment-button"
                              multiple
                              className="hidden"
                              accept=""
                              onChange={(e) => handleAttachmentChange(e)}
                            />
                          </label>
                        </div>
                        <div className="flex w-full justify-end text-[15px] font-[Inter,sans-serif] mr-5 font-[100] bg-transparent">
                          {Tasks?.Attachments?.length > 0 &&
                            showdropDown === false && (
                              <button
                                className="cursor-pointer"
                                onClick={() => {
                                  setShowdropDown(true);
                                }}
                              >
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  stroke-width="0"
                                  viewBox="0 0 24 24"
                                  class="tasks-item-icon"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path fill="none" d="M0 0h24v24H0z"></path>
                                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                                </svg>
                              </button>
                            )}

                          {Tasks?.Attachments?.length > 0 &&
                            showdropDown === true && (
                              <button
                                className="cursor-pointer"
                                onClick={() => {
                                  setShowdropDown(false);
                                }}
                              >
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  stroke-width="0"
                                  viewBox="0 0 24 24"
                                  class="tasks-item-icon"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path fill="none" d="M0 0h24v24H0z"></path>
                                  <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
                                </svg>
                              </button>
                            )}
                        </div>
                        <FormControl></FormControl>
                      </FormLabel>
                      {showdropDown === true &&
                        Tasks?.Attachments?.length > 0 && (
                          <div className="h-auto p-2 rounded-md pl-2 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
                            {Tasks?.Attachments?.length > 0 &&
                              showAttachmentField === false && (
                                <div className="flex flex-col  justify-end font-light text-[15px] font-[rgb(115,115,115)] gap-2">
                                  {Tasks?.Attachments?.map((file, index) => (
                                    <div
                                      key={index}
                                      className="cursor-pointer flex justify-between items-center pr-2 h-auto pb-0.5 "
                                    >
                                      <span className="flex items-center gap-4">
                                        <svg
                                          stroke="currentColor"
                                          fill="currentColor"
                                          stroke-width="0"
                                          viewBox="0 0 384 512"
                                          class=" tasks-item-icon"
                                          height="1em"
                                          width="1em"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                                        </svg>{' '}
                                        <h6
                                          className="hover:text-[rgb(51,141,181)]"
                                          onClick={() => {
                                            if (
                                              file.url
                                                .split('.')
                                                .includes('pdf')
                                            ) {
                                              setSelectedFileType('pdf');
                                            } else if (
                                              file.url
                                                .split('.')
                                                .includes('docx') ||
                                              file.url
                                                .split('.')
                                                .includes('pptx') ||
                                              file.url
                                                .split('.')
                                                .includes('xlsx')
                                            ) {
                                              setSelectedFileType('docx');
                                            } else {
                                              setSelectedFileType('image');
                                            }
                                            setSelectedFile(file.url);
                                            setSelectedImage(file.url);
                                            setSelectedDocx(file.url);
                                            setOpenImageDialog(true);
                                          }}
                                        >
                                          {file.orignalname}.
                                          {file.url.split('.')[3]}
                                        </h6>
                                      </span>
                                      <svg
                                        className="cursor-pointer flex"
                                        onClick={() => {
                                          setCurrentPublicId(file.public_id);
                                          setOpenTaskAttachmentDialog(true);
                                        }}
                                        stroke="currentColor"
                                        fill="red"
                                        stroke-width="0"
                                        viewBox="0 0 512 512"
                                        class="w-4 h-4"
                                        height="20"
                                        width="20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{
                                          transition: 'transform 0.3s',
                                          transform: 'rotate(45deg)',
                                        }}
                                      >
                                        <title>close</title>
                                        <path d="M363 277h-86v86h-42v-86h-86v-42h86v-86h42v86h86v42z"></path>
                                        <path d="M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422c-44.3 0-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256c0-44.3 17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"></path>
                                      </svg>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}
                    </FormItem>
                  )}
                />
                <AlertDialog
                  open={openTaskAttachmentDialog}
                  onOpenChange={setOpenTaskAttachmentDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this attachment?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white hover:bg-red-700"
                        onClick={() => {
                          dispatch(deleteUploadedImage(currentPublicId));
                          dispatch(resetdeleteImage());
                          setOpenTaskAttachmentDialog(false);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <FormField
                  control={control}
                  name="CreatedBy"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex h-11 rounded-md items-center gap-6 text-[20px] font-[Inter,sans-serif] ml-5 font-[100] bg-[rgba(231,235,245,0.66)] ">
                        <div className="ml-2.5 text-[rgb(155,159,167)]">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 640 512"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                            style={{
                              border: 'none',
                              outline: 'none',
                              boxShadow: 'none',
                            }}
                            defaultValue={Tasks?.createdBy}
                            readOnly
                            className=" flex  font-semibold  w-[30%] overflow-x-auto"
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
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="tasks-item-icon"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                            style={{
                              border: 'none',
                              outline: 'none',
                              boxShadow: 'none',
                            }}
                            defaultValue={
                              Tasks?.createdAt
                                ? `${new Date(Tasks.createdAt).toLocaleDateString('en-GB')} at ${new Date(Tasks.createdAt).toLocaleTimeString()}`
                                : ''
                            }
                            readOnly
                            className=" flex   w-[60%] overflow-x-auto"
                            {...field}
                          />
                        </FormControl>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
