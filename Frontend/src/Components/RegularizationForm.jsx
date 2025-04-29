import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Components/components/ui/button';
import Select from 'react-select';
import { Input } from '../Components/components/ui/input';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '../Components/components/ui/form';
import { SheetClose } from '../Components/components/ui/sheet';
import {
  getLeaveById,
  getCreatedLeave,
} from '../feature/leavefetch/createleaveSlice';
import TimePicker from 'react-time-picker';
const formSchema = z.object({
  Date: z.string().min(1, { message: 'Date is Required' }),
  MissingPunch: z.string().min(1, { message: 'Please enter valid Time' }),
  Reason: z.string().min(1, { message: 'Reason is  Required' }),
  Remarks: z.string().min(1, { message: 'Remark is Required' }),
});

export default function RegularizationForm({ onSubmit, mode, id }) {
  const [leaveType, setLeaveType] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const { leaveById, createdLeaves, allLeave } = useSelector(
    (state) => state.leave
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === 'update' && id) {
      dispatch(getLeaveById(id));
    }
  }, [dispatch, mode, id]);

  useEffect(() => {
    dispatch(getCreatedLeave());
  }, [dispatch]);

  useEffect(() => {
    if (createdLeaves?.message) {
      setLeaveType(createdLeaves?.message);
    }
  }, [createdLeaves, allLeave]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Date: '',
      MissingPunch: '',
      Reason: '',
      Remarks: '',
      End_Date: '',
      EndDateType: '',
    },
  });

  const LeaveTypeOptions = leaveType?.map((value) => ({
    label: value?.Leave_Reason,
    value: value?.Leave_Reason,
  }));

  const StartDateTypeOptions = [
    { value: 'First_Half', label: 'First Half' },
    { value: 'Second_Half', label: 'Second Half' },
    { value: 'Full_Day', label: 'Full Day' },
  ];

  const EndDateTypeOptions = [
    { value: 'First_Half', label: 'First Half' },
    { value: 'Second_Half', label: 'Second Half' },
    { value: 'Full_Day', label: 'Full Day' },
  ];

  useEffect(() => {
    if (mode === 'update' && leaveById?.message) {
      const detail = leaveById?.message;
      reset({
        Leave_Reason: detail?.Leave_Reason,
        LEAVE_TYPE: detail?.LEAVE_TYPE,
        Start_Date: detail?.Start_Date,
        StartDateType: detail?.StartDateType,
        End_Date: detail?.End_Date,
        EndDateType: detail?.EndDateType,
      });
    }
  }, [mode, leaveById, reset, id]);

  return (
    <>
      <Form {...control}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
              <Button className="bg-white text-red-500 border border-gray-300 mr-6 hover:bg-white font-[Inter,sans-serif] h-auto text-md p-1.5 cursor-pointer">
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
            name="Date"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col">
                  <FormLabel
                    className={
                      errors?.Date ? 'text-[#737373]' : 'text-[16px] font-[500]'
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
                              date.getTime() - date.getTimezoneOffset() * 60000
                            )
                              .toISOString()
                              .split('T')[0]
                          : '';
                        field.onChange(localDate); // store only string
                      }}
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
          <FormField
            control={control}
            name="MissingPunch"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={
                    errors?.MissingPunch
                      ? 'text-[#737373]'
                      : 'text-[16px] font-[500]'
                  }
                >
                  Leave Type
                </FormLabel>
                <FormControl>
                  <div className="w-full flex text-2xl">
                    <TimePicker
                      className="w-full h-9.5"
                      clockIcon
                      hourPlaceholder="00"
                      minutePlaceholder="00"
                      clearIcon
                      clockAriaLabel
                      openClockOnFocus={false}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                    {console.log(field)}
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
                  Leave Reason
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
                  Leave Reason
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
