import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
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
import { getSMTP } from '../feature/smtpfetch/smtpSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { SheetClose } from '../Components/components/ui/sheet';

const formSchema = z.object({
  Host: z.string().min(1, { message: 'Host Name is Required' }),
  Port: z.string().min(1, { message: 'Port is required' }),
  User_Email: z
    .string()
    .email({ message: 'Please enter correct Email Address' }),
  Password: z.string().min(1, { message: 'Password is required' }),
  From_Name: z.string().min(1, { message: 'From Name is required' }),
  Email_From: z.string().min(1, { message: 'From Email is required' }),
  BBC_Email: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === '') return [];
      return val.split(',').map((email) => email.trim());
    })
    .refine(
      (emails) =>
        Array.isArray(emails) &&
        emails.every((email) => z.string().email().safeParse(email).success),
      {
        message: 'Please enter valid email addresses separated by commas',
      }
    ),
});

export default function SmtpForm({ onSubmit, mode }) {
  const { fetchedsmtp } = useSelector((state) => state.smtpSlice);
  const dispatch = useDispatch();
  useEffect(() => {
    if (mode === 'update') {
      dispatch(getSMTP());
    }
  }, [mode, dispatch]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Host: '',
      Port: '',
      User_Email: '',
      Password: '',
      From_Name: '',
      Email_From: '',
      BBC_Email: '' || [],
    },
  });

  useEffect(() => {
    if (mode === 'update' && fetchedsmtp?.message?.[0]) {
      const detail = fetchedsmtp.message[0];
      reset({
        Host: detail.Host,
        Port: detail.Port,
        User_Email: detail.User_Email,
        Password: detail.Password,
        From_Name: detail.From_Name,
        Email_From: detail.Email_From,
        BBC_Email: detail.BBC_Email?.join(',') || '',
      });
    }
  }, [reset, mode, fetchedsmtp]);

  return (
    <>
      <Form {...control}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
            <h1 className="text-xl w-full">
              {' '}
              {mode === 'update' ? 'Update' : 'Create'} SMTP
            </h1>
            <Button
              id="create-SMTP"
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
            name="Host"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={errors?.Host ? 'text-[#737373]' : ''}>
                  SMTP Host
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter SMTP Host"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.Host && (
                    <span className="text-red-500 font-semibold">
                      {errors.Host.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="Port"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    errors?.Port ? 'text-[#737373]' : 'text-[16px] font-[500]'
                  }
                >
                  SMTP Port
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter SMTP Port"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.Port && (
                    <span className="text-red-500 font-semibold">
                      {errors.Port.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="User_Email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  className={errors?.User_Email ? 'text-[#737373]' : ''}
                >
                  User Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter User Email"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.User_Email && (
                    <span className="text-red-500 font-semibold">
                      {errors.User_Email.message}
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
              <FormItem className="flex flex-col ">
                <FormLabel
                  {...field}
                  className={`${
                    errors?.Password
                      ? 'text-[#737373] h-2'
                      : 'text-[16px] font-[500]'
                  }`}
                >
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Password"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
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
            name="From_Name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  className={
                    errors?.From_Name
                      ? 'text-[#737373]'
                      : 'text-[16px] font-[500]'
                  }
                >
                  From Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter From Name"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.From_Name && (
                    <span className="text-red-500 font-semibold">
                      {errors.From_Name.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="Email_From"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={errors?.Email_From ? 'text-[#737373]' : ''}
                >
                  Email From
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Email From"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.Email_From && (
                    <span className="text-red-500 font-semibold">
                      {errors.Email_From.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="BBC_Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={errors?.BBC_Email ? 'text-[#737373]' : ''}
                >
                  BBC Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter BBC Email"
                    className="h-9.5 w-full rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.BBC_Email && (
                    <span className="text-red-500 font-semibold">
                      {errors.BBC_Email.message}
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
