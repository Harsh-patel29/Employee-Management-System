import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Components/components/ui/button';
import { Input } from '../Components/components/ui/input';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '../Components/components/ui/form';
import { SheetClose } from '../Components/components/ui/sheet';
import Select from 'react-select';
import { fetchuser } from '../feature/createuserfetch/createuserSlice.js';
import { useSelector, useDispatch } from 'react-redux';

const formSchema = (role) => {
  let schemaFields = {};

  if (role === 'Admin') {
    (schemaFields.Date = z.string().min(1, { message: 'Date is Required' })),
      (schemaFields.MissingPunch = z
        .string()
        .min(1, { message: 'Please enter valid Time' })),
      (schemaFields.Reason = z
        .string()
        .min(1, { message: 'Reason is  Required' })),
      (schemaFields.Remarks = z
        .string()
        .min(1, { message: 'Remark is Required' })),
      (schemaFields.UserId = z
        .string()
        .min(1, { message: 'Please Select User' }));
  } else {
    (schemaFields.Date = z.string().min(1, { message: 'Date is Required' })),
      (schemaFields.MissingPunch = z
        .string()
        .min(1, { message: 'Please enter valid Time' })),
      (schemaFields.Reason = z
        .string()
        .min(1, { message: 'Reason is  Required' })),
      (schemaFields.Remarks = z
        .string()
        .min(1, { message: 'Remark is Required' }));
  }
  let schema = z.object(schemaFields);
  return schema;
};

export default function RegularizationForm({
  onSubmit,
  mode,
  Name,
  id,
  Login,
  LastLogin,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { fetchusers } = useSelector((state) => state.createuser);
  const [users, setUsers] = React.useState([]);
  const [hour, setHour] = React.useState('00');
  const [minute, setMinute] = React.useState('00');
  const [period, setPeriod] = React.useState('AM');
  const formatWithZero = (val) => (val < 10 ? `0${val}` : `${val}`);

  React.useEffect(() => {
    dispatch(fetchuser());
  }, []);

  React.useEffect(() => {
    if (fetchusers?.message) {
      setUsers(fetchusers.message);
    }
  }, [fetchusers]);

  const getFormattedTime = (h, m, p) => {
    let hourNum = parseInt(h);
    if (p === 'PM' && hourNum !== 12) hourNum += 12;
    if (p === 'AM' && hourNum === 12) hourNum = 0;

    const hourStr = hourNum.toString().padStart(2, '0');
    const minStr = m.padStart(2, '0');

    return `${hourStr}:${minStr}`;
  };

  const increaseHour = (onChange) => {
    let newHour = (parseInt(hour, 10) + 1) % 13;
    newHour = newHour === 0 ? 1 : newHour;
    const formatted = formatWithZero(newHour);
    setHour(formatted);
    onChange(formatted);
  };

  const decreaseHour = (onChange) => {
    let newHour = parseInt(hour) - 1;
    if (newHour < 0) newHour = 12;
    const formatted = formatWithZero(newHour);
    setHour(formatted);
    onChange(formatted);
  };

  const handleHourChange = (e, onChange) => {
    const value = e.target.value;
    const num = parseInt(value);
    const formatted = isNaN(num) ? '00' : formatWithZero(num);
    setHour(formatted);
    onChange(formatted);
  };

  const increaseMinute = (onChange) => {
    let newMinute = (parseInt(minute) + 5) % 60;
    newMinute = newMinute;
    const formatted = formatWithZero(newMinute);
    setMinute(formatted);
    onChange(formatted);
  };

  const decreaseMinute = (onChange) => {
    let newMinute = parseInt(minute) - 5;
    if (newMinute < 0) newMinute = 59;
    const formatted = formatWithZero(newMinute);
    setMinute(formatted);
    onChange(formatted);
  };

  const handleMinuteChange = (e) => {
    const value = e.target.value;
    const num = parseInt(value);
    const formatted = isNaN(num) ? '00' : formatWithZero(num);
    setMinute(formatted);
    onChange(formatted);
  };
  const togglePeriod = (onChange) => {
    setPeriod((prev) => {
      const newPeriod = prev === 'AM' ? 'PM' : 'AM';
      onChange(newPeriod);
      return newPeriod;
    });
  };

  const fetchedUserDetailsOptions = users.map((item) => ({
    value: item._id,
    label: item.Name,
  }));

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema(user.user.role)),
    defaultValues: {
      Date: mode === 'Direct' ? id : '',
      MissingPunch: '',
      Reason: '',
      Remarks: '',
      UserId: '',
    },
  });

  const handlesSubmit = (data) => {
    const formattedTime = getFormattedTime(hour, minute, period);
    const updatedData = {
      ...data,
      MissingPunch: formattedTime,
    };

    onSubmit(updatedData);
  };

  return (
    <>
      <Form {...control}>
        <form
          onSubmit={handleSubmit(handlesSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
            <h1 className="text-xl w-full">Create Regularization</h1>
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
          {mode === 'Direct' && (
            <div className="flex w-full justify-between mb-3  mt-3">
              {user.user.role === 'Admin' && (
                <div>
                  <p className="font-semibold">
                    <div>User</div>
                    <div>{Name}</div>
                  </p>
                </div>
              )}
              <div>
                <p className="font-semibold">
                  <div>Date</div>
                  <div>{id}</div>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  <div>Login</div>
                  <div>{Login}</div>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  <div>Last Login</div>
                  <div>{LastLogin}</div>
                </p>
              </div>
            </div>
          )}
          <div
            className={`${user.user.role === 'Admin' ? 'flex items-center justify-between' : ''}`}
          >
            {mode !== 'Direct' && (
              <FormField
                control={control}
                name="Date"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col">
                      <FormLabel
                        className={
                          errors?.Date
                            ? 'text-[#737373]'
                            : 'text-[16px] text-gray-700 font-[500]'
                        }
                      >
                        Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          className="w-full h-9.5 border border-gray-300 text-[rgb(0,0,0)] text-[15px] font-[450] rounded-sm p-3 outline-none"
                          placeholderText="Select Date"
                          autoComplete="off"
                          selected={field.value ? new Date(field.value) : null} // convert string -> Date
                          onChange={(date) => {
                            const localDate = date
                              ? new Date(
                                  date.getTime() -
                                    date.getTimezoneOffset() * 60000
                                )
                                  .toISOString()
                                  .split('T')[0]
                              : '';
                            field.onChange(localDate); // store only string
                          }}
                          maxDate={new Date()}
                          dateFormat="dd-MM-yyyy"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          isClearable
                        />
                      </FormControl>
                    </div>
                    <div>
                      {errors?.Date && (
                        <span className="text-red-500 font-semibold">
                          {errors.Date.message}
                        </span>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            )}
            {user.user.role === 'Admin' && mode !== 'Direct' && (
              <FormField
                control={control}
                name="UserId"
                render={({ field }) => (
                  <FormItem className="w-[40%] gap-0 flex flex-col">
                    <FormLabel
                      className={
                        errors?.UserId
                          ? 'text-[#737373] mb-0.5'
                          : 'text-sm font-medium text-gray-700 mb-0.5 '
                      }
                    >
                      User
                    </FormLabel>
                    <FormControl>
                      <Select
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            boxShadow: 'none',
                            fontSize: '15px',
                            color: 'rgb(120, 122, 126)',
                            width: '100%',
                            borderRadius: '6px',
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
                        value={field.label}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption.value);
                        }}
                        options={fetchedUserDetailsOptions}
                      />
                    </FormControl>
                    <div>
                      {errors?.UserId && (
                        <span className="text-red-500 font-semibold">
                          {errors.UserId.message}
                        </span>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={control}
            name="MissingPunch"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    errors?.MissingPunch
                      ? 'text-[#737373]'
                      : 'text-[16px] text-gray-700 font-[500]'
                  }
                >
                  Missing Punch
                </FormLabel>
                <FormControl>
                  <div className="w-[40%] flex mt-2 text-xl items-center">
                    <div className="flex w-full flex-col gap-1 items-center">
                      <button
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(field.value);
                          increaseHour(field.onChange);
                        }}
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18.78 15.78a.749.749 0 0 1-1.06 0L12 10.061 6.28 15.78a.749.749 0 1 1-1.06-1.06l6.25-6.25a.749.749 0 0 1 1.06 0l6.25 6.25a.749.749 0 0 1 0 1.06Z"></path>
                        </svg>
                      </button>
                      <Input
                        type="number"
                        min="0"
                        max="12"
                        accept="d"
                        value={hour}
                        placeholder="00"
                        {...register('MissingPunch')}
                        onChange={(e) => handleHourChange(e, field.onChange)}
                        className="h-9.5 w-15 rounded-sm flex text-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <button
                        className="cursor-pointer"
                        onClick={(e) => {
                          console.log(field.value);
                          e.preventDefault();
                          decreaseHour(field.onChange);
                        }}
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 24 24"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5.22 8.22a.749.749 0 0 0 0 1.06l6.25 6.25a.749.749 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939 6.28 8.22a.749.749 0 0 0-1.06 0Z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="mb-2">:</p>
                    <div className="flex w-full flex-col items-center gap-1">
                      <button
                        className="cursor-pointer"
                        onClick={(e) => {
                          console.log(field.value);
                          e.preventDefault();
                          increaseMinute(field.onChange);
                        }}
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18.78 15.78a.749.749 0 0 1-1.06 0L12 10.061 6.28 15.78a.749.749 0 1 1-1.06-1.06l6.25-6.25a.749.749 0 0 1 1.06 0l6.25 6.25a.749.749 0 0 1 0 1.06Z"></path>
                        </svg>
                      </button>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="00"
                        value={minute}
                        onChange={handleMinuteChange}
                        className="h-9.5 w-15 rounded-sm flex items-center text-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <button
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(field.value);
                          decreaseMinute(field.onChange);
                        }}
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 24 24"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5.22 8.22a.749.749 0 0 0 0 1.06l6.25 6.25a.749.749 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939 6.28 8.22a.749.749 0 0 0-1.06 0Z"></path>
                        </svg>
                      </button>
                    </div>
                    <div id="Meridiem Toggler">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(field.value);
                          togglePeriod(field.onChange);
                        }}
                        className="border cursor-pointer border-gray-300 rounded-sm px-4 py-2 h-9.5 text-center text-sm shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        {period}
                      </button>
                    </div>
                  </div>
                </FormControl>
                <div>
                  {errors?.MissingPunch && (
                    <span className="text-red-500 font-semibold">
                      {errors.MissingPunch.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="Reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    errors?.Reason
                      ? 'text-[#737373]'
                      : 'text-sm font-medium text-gray-700'
                  }
                >
                  Reason
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Leave Reason"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.Reason && (
                    <span className="text-red-500 font-semibold">
                      {errors.Reason.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="Remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    errors?.Remarks
                      ? 'text-[#737373]'
                      : 'text-sm font-medium text-gray-700'
                  }
                >
                  Remarks
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Leave Reason"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.Remarks && (
                    <span className="text-red-500 font-semibold">
                      {errors.Remarks.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
