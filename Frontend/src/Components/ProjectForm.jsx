import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Components/components/ui/button';
import { Input } from '../Components/components/ui/input';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '../Components/components/ui/form';
import { SheetClose } from './components/ui/sheet.js';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import {
  getProjectbyId,
  uploadLogo,
  resetProject,
  deleteLogo,
} from '../feature/projectfetch/createproject.js';
import { Bounce, toast } from 'react-toastify';
import Loader from './Loader.jsx';
import Select from 'react-select';

const getLogoSchema = (mode) => {
  if (mode === 'update') {
    // In update mode, logo is optional
    return z
      .union([
        z.instanceof(File),
        z.string().url(), // for existing URLs in update mode
      ])
      .optional();
  } else {
    // In create mode, logo must be a File
    return z.instanceof(File, { message: 'Logo is required' });
  }
};

const formSchema = (mode) =>
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    logo: getLogoSchema(mode),
    progress_status: z.enum(
      ['Pending', 'In-Progress', 'Hold', 'Completed', 'Scrapped'],
      { message: 'Select Progress status' }
    ),
    status: z.enum(['Active', 'In-Active'], { message: 'Select status' }),
  });

export default function ProjectForm({ onSubmit, mode, onClose }) {
  const { projectbyid, logo, project, logoloading, updatedproject, error } =
    useSelector((state) => state.project);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [logos, setlogos] = useState(null);
  const [publicid, setpublicid] = useState(null);

  useEffect(() => {
    if (project?.success) {
      toast.success('Project created successfully', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
    return () => {
      dispatch(resetProject());
    };
  }, [project?.success]);

  useEffect(() => {
    if (updatedproject?.success) {
      toast.success('Project updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    return () => {
      dispatch(resetProject());
    };
  }, [updatedproject?.success]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message || error.message || error;
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    }
  }, [error]);

  useEffect(() => {
    if (logo?.success) {
      setlogos(logo?.message?.url);
      setpublicid(logo?.message?.public_id);
    }
  }, [logo]);

  useEffect(() => {
    return () => {
      if (logos && !project?.success && !updatedproject?.success) {
        if (mode === 'create') {
          dispatch(deleteLogo(publicid));
        } else if (
          mode === 'update' &&
          projectbyid?.message?.logo?.public_id !== publicid
        ) {
          dispatch(deleteLogo(publicid));
        }
      }
    };
  }, [
    logos,
    project?.success,
    updatedproject?.success,
    publicid,
    mode,
    projectbyid?.message?.logo?.public_id,
  ]);

  useEffect(() => {
    if (mode === 'update' && id) {
      dispatch(getProjectbyId(id));
    }
  }, [dispatch, id, mode]);

  const form = useForm({
    resolver: zodResolver(formSchema(mode)),
    defaultValues: {
      name: '',
      logo: '',
      progress_status: '',
      status: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (mode === 'update' && projectbyid?.message) {
      const detail = projectbyid.message;
      reset({
        name: detail?.name || '',
        logo: detail?.logo.url || '',
        progress_status: detail?.progress_status || '',
        status: detail?.status || '',
      });
    }
  }, [mode, projectbyid, reset]);

  const handleFormSubmit = (data) => {
    const formData = {
      name: data.name,
      logo: logos
        ? {
            secure_url: logos,
            public_id: publicid,
          }
        : undefined,
      progress_status: data.progress_status,
      status: data.status,
    };

    onSubmit(formData);
  };

  useEffect(() => {
    if (mode === 'create') {
      setlogos(null);
      return () => {
        dispatch(resetProject());
      };
    }
  }, [onClose]);

  const ProgressOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Progress', label: 'Progress' },
    { value: 'Hold', label: 'Hold' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Scrapped', label: 'Scrapped' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'In-Active', label: 'In-Active' },
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className=""
        encType="multipart/form-data"
      >
        <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
          <h1 className="text-xl w-full">Create Project</h1>
          <Button
            id="create-leave"
            type="submit"
            className="bg-white text-black border border-gray-300 mr-6 hover:bg-white font-[Inter,sans-serif] h-auto text-md p-1.5 cursor-pointer"
          >
            <svg
              className="h-8 w-8"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>create</title>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            {mode === 'update' ? 'Update' : 'Create'}
          </Button>
          <SheetClose>
            <Button
              type="button"
              className="bg-white text-red-500 border border-gray-300 mr-6 hover:bg-white font-[Inter,sans-serif] h-auto text-md p-1.5 cursor-pointer"
            >
              <svg
                className="w-10 h-10"
                stroke="currentColor"
                fill="none"
                strokeWidth="0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
                  fill="currentColor"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                  fill="currentColor"
                ></path>
              </svg>
              Cancel
            </Button>
          </SheetClose>
        </div>
        <FormField
          control={control}
          name="logo"
          render={({ field }) => (
            <FormItem className="mt-4 max-sm:flex max-sm:flex-col max-sm:w-full max-sm:justify-center">
              <FormLabel className={errors?.logo ? 'text-[#737373]' : ''}>
                Project Logo
              </FormLabel>
              <label
                id="label"
                htmlFor="file-upload"
                className={`${logoloading ? 'w-80 h-60 flex items-center justify-center' : 'w-80 h-60 max-sm:w-full'} flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-500 cursor-pointer hover:bg-gray-50`}
              >
                {logoloading ? (
                  <Loader />
                ) : mode === 'update' ? (
                  <>
                    {logos ? (
                      <img
                        src={logos}
                        alt=""
                        className={`${logoloading ? 'hidden' : ''} h-60 w-80 max-sm:w-full`}
                      />
                    ) : (
                      <img
                        src={projectbyid?.message?.logo.url}
                        alt=""
                        className="h-60 w-80 rounded-md max-sm:w-full"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {logos ? (
                      <>
                        <img
                          src={logos}
                          alt=""
                          className="h-60 w-80 max-sm:w-full"
                        />
                      </>
                    ) : (
                      <>Upload</>
                    )}
                  </>
                )}
              </label>
              <div>
                {' '}
                {errors?.logo && (
                  <span className="text-red-600 font-semibold">
                    {errors.logo.message}
                  </span>
                )}
              </div>
              <FormControl>
                {mode === 'update' ? (
                  <Input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files[0];
                      field.onChange(files);
                      if (files) {
                        dispatch(uploadLogo(files));
                      }
                    }}
                    id="file-upload"
                  />
                ) : (
                  <Input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      field.onChange(file);
                      if (file) {
                        dispatch(uploadLogo(file));
                      }
                    }}
                    id="file-upload"
                  />
                )}
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem
              className={`${logoloading ? 'opacity-50 cursor-not-allowed' : ''} mt-4 `}
            >
              <FormLabel className={errors?.name ? 'text-[#737373]' : ''}>
                Project Name
              </FormLabel>
              <FormControl>
                <Input
                  className="w-[90%] max-sm:w-full"
                  type="text"
                  placeholder="Enter Project Name"
                  {...field}
                />
              </FormControl>
              <div>
                {' '}
                {errors?.name && (
                  <span className="text-red-600 font-semibold">
                    {errors.name.message}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="progress_status"
          render={({ field }) => (
            <FormItem
              className={`${logoloading ? 'opacity-50 cursor-not-allowed' : ''} mt-4`}
            >
              <FormLabel
                className={errors?.progress_status ? 'text-[#737373]' : ''}
              >
                Project Progress
              </FormLabel>
              <FormControl>
                <Select
                  className="shadow w-[90%] max-sm:w-full text-start"
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      boxShadow: 'none',
                      fontSize: '15px',
                      color: 'rgb(120, 122, 126)',
                      width: '100%',
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
                      color: state.isFocused ? 'white' : 'rgb(120, 122, 126)',
                      ':hover': {
                        backgroundColor: 'rgb(51,141,181)',
                      },
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: 'white',
                    }),
                  }}
                  {...field}
                  placeholder={field.value || 'Select Progress'}
                  value={field.value}
                  onChange={(selectedOptions) => {
                    field.onChange(selectedOptions.value);
                  }}
                  options={ProgressOptions}
                />
              </FormControl>
              <div>
                {errors?.progress_status && (
                  <span className="text-red-600 font-semibold">
                    {errors.progress_status.message}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem
              className={`${logoloading ? 'opacity-50 cursor-not-allowed' : ''} mt-4`}
            >
              <FormLabel className={errors?.status ? 'text-[#737373] ' : ''}>
                Project Status
              </FormLabel>
              <FormControl>
                <Select
                  className="shadow w-[90%] max-sm:w-full text-start"
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      boxShadow: 'none',
                      fontSize: '15px',
                      color: 'rgb(120, 122, 126)',
                      width: '100%',
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
                      color: state.isFocused ? 'white' : 'rgb(120, 122, 126)',
                      ':hover': {
                        backgroundColor: 'rgb(51,141,181)',
                      },
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: 'white',
                    }),
                  }}
                  {...field}
                  placeholder={field.value || 'Select Progress'}
                  value={field.value}
                  onChange={(selectedOptions) => {
                    field.onChange(selectedOptions.value);
                  }}
                  options={statusOptions}
                />
              </FormControl>
              <div>
                {errors?.status && (
                  <span className="text-red-600 font-semibold">
                    {errors.status.message}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
