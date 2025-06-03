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
import { useDispatch, useSelector } from 'react-redux';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../Components/components/ui/popover';
import { SheetClose } from './components/ui/sheet.js';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { getUser } from '../feature/datafetch/userfetchSlice.js';
import { getRoles } from '../feature/rolesfetch/getrolesSlice.js';
import { fetchuser } from '../feature/createuserfetch/createuserSlice.js';
import Select from 'react-select';

const passwordField = (mode) => {
  if (mode === 'update') {
    return z.string().optional();
  } else {
    return z.string().min(1, { message: 'Password is required' });
  }
};

const formSchema = (mode) =>
  z.object({
    Name: z.string().min(1, { message: 'Name is Required' }),
    Email: z.string().email({ message: 'Please enter correct Email' }),
    Password: passwordField(mode),
    Date_of_Birth: z.string().min(1, { message: 'Date of Birth is Required' }),
    Mobile_Number: z
      .string()
      .regex(/^\d+$/, { message: 'Please enter a valid mobile number' })
      .min(8, { message: 'Please enter valid mobile Number' }),
    Gender: z.string().min(1, { message: 'Select Gender' }),
    DATE_OF_JOINING: z
      .string()
      .min(1, { message: 'Date of Joining is required' }),
    Designation: z.string(),
    WeekOff: z.string(),
    role: z.string().min(1, { message: 'Select Role' }),
    ReportingManager: z.string().optional(),
  });

export default function AdminForm({ onSubmit, mode }) {
  const users = useSelector((state) => state.getuser);
  const { user } = useSelector((state) => state.auth);
  const { roles } = useSelector((state) => state.getrole);
  const { fetchusers } = useSelector((state) => state.createuser);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (mode === 'update' && id) {
      dispatch(getUser(id));
    }
  }, [dispatch, id, mode]);

  useEffect(() => {
    dispatch(fetchuser());
  }, []);

  useEffect(() => {
    dispatch(getRoles());
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema(mode)),
    defaultValues: {
      Name: '',
      Email: '',
      Password: '',
      Date_of_Birth: '',
      Mobile_Number: '',
      Gender: '',
      DATE_OF_JOINING: '',
      Designation: '',
      WeekOff: '',
      role: '',
      ReportingManager: '',
    },
  });

  useEffect(() => {
    if (mode === 'update' && users?.users?.message) {
      const detail = users.users.message;
      reset({
        Name: detail?.Name || '',
        Email: detail?.Email || '',
        Password: '',
        Date_of_Birth: detail?.Date_of_Birth
          ? detail?.Date_of_Birth.split('T')[0]
          : '',
        Mobile_Number: detail?.Mobile_Number || '',
        Gender: detail?.Gender || '',
        DATE_OF_JOINING: detail?.DATE_OF_JOINING
          ? detail?.DATE_OF_JOINING.split('T')[0]
          : '',
        Designation: detail?.Designation || '',
        WeekOff: detail?.WeekOff || '',
        role: detail?.role || '',
        ReportingManager: detail.ReportingManager || '',
      });
    }
  }, [mode, users, reset]);

  const rolesOptions = roles?.message.map((role) => ({
    label: role.name,
    value: role.name,
  }));

  const usersOptions = fetchusers?.message.map((user) => ({
    label: user.Name,
    value: user.Name,
  }));

  const genderOptions = [
    { value: 'MALE', label: 'MALE' },
    { value: 'FEMALE', label: 'FEMALE' },
  ];

  return (
    <>
      <Form {...control}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
            <h1 className="text-xl w-full text-start">Create User</h1>
            <Button
              id="create-User"
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
          <div
            className={`mt-4 grid grid-cols-3 max-[670px]:grid-cols-2 max-[530px]:grid-cols-2 max-[530px]:ml-0 gap-6 max-[530px]:gap-y-6 items-center justify-evenly ml-10`}
          >
            <FormField
              control={control}
              name="Name"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel className={errors?.Name ? 'text-[#737373]' : ''}>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="shadow"
                      type="text"
                      placeholder="Enter Your Name"
                      {...field}
                    />
                  </FormControl>
                  <div>
                    {errors?.Name && (
                      <span className="text-red-500 font-semibold">
                        {errors.Name.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Email"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel className={errors?.Email ? 'text-[#737373]' : ''}>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="shadow"
                      type="email"
                      placeholder="Enter Your Email"
                      {...field}
                    />
                  </FormControl>
                  <div>
                    {errors?.Email && (
                      <span className="text-red-500 font-semibold">
                        {errors.Email.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Password"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel className={errors?.Email ? 'text-[#737373]' : ''}>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="shadow"
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <div>
                    {errors?.Password && (
                      <span className="text-red-500 font-semibold">
                        {errors.Password.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Date_of_Birth"
              render={({ field }) => (
                <FormItem className="w-[90%] flex flex-col ">
                  <FormLabel
                    className={`${errors?.Date_of_Birth ? 'text-[#737373] h-2' : ''}`}
                  >
                    DOB
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          type="text"
                          className="justify-evenly shadow"
                          value={
                            field.value
                              ? new Date(field.value).toLocaleDateString(
                                  'en-CA'
                                )
                              : ''
                          }
                          onChange={field.onChange}
                          placeholder="Select Date"
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 w-20 h-0"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            if (date) {
                              const localDate = new Date(
                                date.getTime() -
                                  date.getTimezoneOffset() * 60000
                              );
                              field.onChange(
                                localDate.toISOString().split('T')[0]
                              );
                            }
                          }}
                          inline
                          dateFormat="yyyy-MM-dd"
                          showYearDropdown
                          showMonthDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <div>
                    {errors?.Date_of_Birth && (
                      <span className="text-red-500 font-semibold">
                        {errors.Date_of_Birth.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Mobile_Number"
              render={({ field }) => (
                <FormItem className="w-[90%]">
                  <FormLabel
                    className={errors?.Mobile_Number ? 'text-[#737373]' : ''}
                  >
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shadow"
                      placeholder="Enter Your Mobile Number"
                      {...field}
                    />
                  </FormControl>
                  <div>
                    {errors?.Mobile_Number && (
                      <span className="text-red-500 font-semibold">
                        {errors.Mobile_Number.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="Gender"
                    className={errors?.Gender ? 'text-[#737373]' : ''}
                  >
                    Select Gender
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="shadow w-[90%]"
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
                      {...field}
                      placeholder={field.value || 'Select'}
                      value={field.value}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions.value);
                      }}
                      options={genderOptions}
                    />
                  </FormControl>
                  <div>
                    {errors?.Gender && (
                      <span className="text-red-500 font-semibold">
                        {errors.Gender.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="DATE_OF_JOINING"
              render={({ field }) => (
                <FormItem className="w-[90%] h-16 ">
                  <FormLabel
                    className={`${errors?.DATE_OF_JOINING ? 'text-[#737373] ' : ''}`}
                  >
                    Date Of Joining
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Input
                          disabled={user.user.role !== 'Admin'}
                          type="text"
                          className="justify-evenly shadow disabled:text-black"
                          value={
                            field.value
                              ? new Date(field.value).toLocaleDateString(
                                  'en-CA'
                                )
                              : ''
                          }
                          onChange={field.onChange}
                          placeholder="Select Date"
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0 w-20 h-0"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            if (date) {
                              const localDate = new Date(
                                date.getTime() -
                                  date.getTimezoneOffset() * 60000
                              );
                              field.onChange(
                                localDate.toISOString().split('T')[0]
                              );
                            }
                          }}
                          disabled={user.user.role !== 'Admin'}
                          inline
                          dateFormat="yyyy-MM-dd"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <div>
                    {errors?.DATE_OF_JOINING && (
                      <span className="text-red-500 font-semibold">
                        {errors.DATE_OF_JOINING.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="Designation"
              render={({ field }) => (
                <FormItem className="w-[90%] flex flex-col ">
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shadow"
                      placeholder="Enter Designation"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="WeekOff"
              render={({ field }) => (
                <FormItem className="w-[90%] flex flex-col">
                  <FormLabel>Week Off</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shadow"
                      placeholder="Enter WeekOff"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="role"
                    className={errors?.role ? 'text-[#737373]' : ''}
                  >
                    Role
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="shadow w-[90%] text-start"
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
                      {...field}
                      isDisabled={user.user.role !== 'Admin'}
                      placeholder={field.value || 'Select'}
                      value={field.value}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions.value);
                      }}
                      options={rolesOptions}
                    />
                  </FormControl>
                  <div>
                    {errors?.role && (
                      <span className="text-red-500 font-semibold">
                        {errors.role.message}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="ReportingManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reporting Manager</FormLabel>
                  <FormControl>
                    <Select
                      className="shadow w-[90%]"
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
                      {...field}
                      isDisabled={user.user.role !== 'Admin'}
                      placeholder={field.value || 'Select'}
                      value={field.value}
                      onChange={(selectedOptions) => {
                        field.onChange(selectedOptions.value);
                      }}
                      options={usersOptions}
                    />
                  </FormControl>
                  <div></div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
