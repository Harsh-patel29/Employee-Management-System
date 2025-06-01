import React, { useState, useEffect } from 'react';
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
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { SheetClose } from './components/ui/sheet.js';
import Select from 'react-select';
import { fetchuser } from '../feature/createuserfetch/createuserSlice.js';
import { getAllWeekOff } from '../feature/weekofffetch/weekoffslice.js';
import { getSalarybyId } from '../feature/salaryfetch/addsalaryslice.js';

const formSchema = z.object({
  User: z.string().min(1, { message: 'Please Select User' }),
  WeekOff: z.string().min(1, { message: 'Please Select WeekOff' }),
  Effective_Date: z.string().min(1, { message: 'Date is required' }),
  salary: z.string().regex(/^[0-9]+$/, { message: 'Salary is required' }),
});

export default function SalaryForm({ onSubmit, mode, id }) {
  const { fetchusers } = useSelector((state) => state.createuser);
  const { allWeekOff } = useSelector((state) => state.weekoff);
  const { fetchedSalarybyId } = useSelector((state) => state.salarySlice);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchuser());
    dispatch(getAllWeekOff());
  }, []);

  useEffect(() => {
    if (mode === 'update' && id) {
      dispatch(getSalarybyId(id));
    }
  }, [mode, id]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      User: '',
      WeekOff: '',
      Effective_Date: '',
      salary: '',
    },
  });

  const usersOptions = fetchusers?.message?.map((user) => ({
    label: user.Name,
    value: user._id,
  }));

  const weekOffOptions = allWeekOff?.message?.map((weekoff) => ({
    label: weekoff.WeekOffName,
    value: weekoff._id,
  }));

  useEffect(() => {
    if (mode === 'update' && fetchedSalarybyId?.message) {
      const detail = fetchedSalarybyId?.message;
      reset({
        User: detail?.User,
        WeekOff: detail?.WeekOff,
        Effective_Date: detail?.Effective_Date,
        salary: detail?.Salary,
      });
    }
  }, [mode, fetchedSalarybyId, reset, id]);

  return (
    <Form {...control}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
          <h1 className="text-xl w-full">Assign Salary</h1>
          <Button
            id="assign-salary"
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
            {mode === 'update' ? 'Update' : 'Assign'}
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
        <div className="flex w-full mt-4">
          <FormField
            control={control}
            name="User"
            render={({ field }) => (
              <FormItem className="w-full px-4">
                <FormLabel className={errors?.User ? 'text-[#737373]' : ''}>
                  User
                </FormLabel>
                <FormControl>
                  <Select
                    className="shadow"
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
                    placeholder="Select User"
                    isClearable={true}
                    value={
                      usersOptions?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(selectedOptions) => {
                      field.onChange(selectedOptions?.value || '');
                    }}
                    options={usersOptions}
                  />
                </FormControl>
                <div>
                  {errors?.User && (
                    <span className="text-red-500 font-semibold">
                      {errors.User.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="WeekOff"
            render={({ field }) => (
              <FormItem className="w-full px-4">
                <FormLabel className={errors?.WeekOff ? 'text-[#737373]' : ''}>
                  WeekOff
                </FormLabel>
                <FormControl>
                  <Select
                    className="shadow"
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
                    placeholder="Select WeekOff"
                    isClearable={true}
                    value={
                      weekOffOptions?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(selectedOptions) => {
                      field.onChange(selectedOptions?.value || '');
                    }}
                    options={weekOffOptions}
                  />
                </FormControl>
                <div>
                  {errors?.WeekOff && (
                    <span className="text-red-500 font-semibold">
                      {errors.WeekOff.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="Effective_Date"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className={errors?.WeekOff ? 'text-[#737373]' : ''}>
                Effective_Date
              </FormLabel>
              <FormControl>
                <div className="w-full" {...field}>
                  <DatePicker
                    wrapperClassName="w-full"
                    className="h-9.5 border w-full border-gray-300 p-3 text-[rgb(0,0,0)] text-[15px] font-[450]  rounded-sm outline-none"
                    autoComplete="off"
                    placeholderText="Effective Date"
                    selected={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      const localDate = new Date(
                        date?.getTime() - date?.getTimezoneOffset() * 60000
                      )
                        ?.toISOString()
                        .split('T')[0];
                      field.onChange(localDate);
                    }}
                    dateFormat="dd-MM-yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>
              </FormControl>
              <div>
                {errors?.Effective_Date && (
                  <span className="text-red-500 font-semibold">
                    {errors.Effective_Date.message}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="salary"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel
                className={
                  errors?.salary
                    ? 'text-[#737373]'
                    : 'text-[15px] font-medium text-gray-700'
                }
              >
                Salary
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  inputMode="numeric"
                  placeholder="Type Salary"
                  className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </FormControl>
              <div>
                {errors?.salary && (
                  <span className="text-red-500 font-semibold">
                    {errors.salary.message}
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
