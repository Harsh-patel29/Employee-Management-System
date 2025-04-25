import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Components/components/ui/button';
import { Input } from '../Components/components/ui/input';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../Components/components/ui/form';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { SheetClose } from '../Components/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../Components/components/ui/popover';
import { Checkbox } from '../Components/components/ui/checkbox';
import { getWeekOffById } from '../feature/weekofffetch/weekoffslice';

const formSchema = z.object({
  WeekOffName: z.string().min(1, 'WeekOff is required'),
  Effective_Date: z.string().min(1, {
    message: 'Effective Date is required',
  }),
  days: z
    .array(
      z.object({
        day: z.string(),
        type: z.enum(['Full Day', 'Half Day', 'WeekOff']),
        weeks: z.array(z.string().optional()),
      })
    )
    .optional(),
});

export default function WeekOffForm({ onSubmit, mode, id }) {
  const dispatch = useDispatch();
  const { weekOffbyId } = useSelector((state) => state.weekoff);
  const [name, setname] = useState('');
  const [date, setdate] = useState('');
  const [isWeekOffChecked, setisWeekOffChecked] = useState(false);
  const [formData, setFormData] = useState({
    weekOffName: '',
    effective_Date: '',
    days: {
      Monday: { halfDay: false, weekOff: false, weeks: [] },
      Tuesday: { halfDay: false, weekOff: false, weeks: [] },
      Wednesday: { halfDay: false, weekOff: false, weeks: [] },
      Thursday: { halfDay: false, weekOff: false, weeks: [] },
      Friday: { halfDay: false, weekOff: false, weeks: [] },
      Saturday: { halfDay: false, weekOff: false, weeks: [] },
      Sunday: { halfDay: false, weekOff: false, weeks: [] },
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      WeekOffName: '',
      Effective_Date: '',
      days: [],
    },
  });

  useEffect(() => {
    if (mode === 'update' && id) {
      dispatch(getWeekOffById(id));
    }
  }, [dispatch, mode, id]);

  const handlesSubmit = (e) => {
    const apiData = transformDataForApi();
    onSubmit(apiData);
  };
  useEffect(() => {
    if (mode === 'update' && weekOffbyId?.message) {
      const detail = weekOffbyId.message;
      reset({
        WeekOffName: detail.WeekOffName,
        Effective_Date: detail.Effective_Date,
      });
    }
  }, [mode, weekOffbyId, reset, id]);

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const weekOptions = [
    'First Week',
    'Second Week',
    'Third Week',
    'Fourth Week',
  ];

  const handleCheckboxChange = (day, type) => {
    setFormData((prevState) => ({
      ...prevState,
      days: {
        ...prevState.days,
        [day]: {
          ...prevState.days[day],
          [type]: !prevState.days[day][type],
        },
      },
    }));
  };

  useEffect(() => {
    if (mode === 'update' && weekOffbyId?.message?.days?.length > 0) {
      const updatedDays = { ...formData.days };
      weekOffbyId?.message?.days.forEach((d) => {
        if (updatedDays[d.day]) {
          updatedDays[d.day] = {
            ...updatedDays[d.day],
            [d.type === 'WeekOff' ? 'weekOff' : '']: true,
            [d.type === 'Half Day' ? 'halfDay' : '']: true,
            weeks: d.weeks || [],
          };
        }
      });
      setFormData((prev) => ({
        ...prev,
        days: updatedDays,
      }));
    }
  }, [mode, weekOffbyId]);

  const handleWeekSelection = (day, week, isSelected) => {
    setFormData((prevState) => {
      const currentWeeks = [...prevState.days[day].weeks];
      let updatedWeeks;
      if (isSelected) {
        updatedWeeks = currentWeeks.includes(week)
          ? currentWeeks
          : [...currentWeeks, week];
      } else {
        updatedWeeks = currentWeeks.filter((w) => w !== week);
      }
      return {
        ...prevState,
        days: {
          ...prevState.days,
          [day]: {
            ...prevState.days[day],
            weeks: updatedWeeks,
          },
        },
      };
    });
  };

  const transformDataForApi = () => {
    const daysArray = [];
    Object.entries(formData.days).forEach(([day, values]) => {
      let type = null;
      if (values.weekOff) {
        type = 'WeekOff';
      } else if (values.halfDay) {
        type = 'Half Day';
      } else {
        type = 'Full Day';
      }
      if (type) {
        daysArray.push({
          day: day,
          type: type,
          weeks: values.weeks,
        });
      }
    });

    if (mode === 'update') {
      return {
        WeekOffName: name ? name : weekOffbyId?.message?.WeekOffName,
        Effective_Date: date ? date : weekOffbyId?.message?.Effective_Date,
        days: daysArray ? daysArray : weekOffbyId?.message?.days,
      };
    } else {
      return {
        WeekOffName: name,
        Effective_Date: date,
        days: daysArray,
      };
    }
  };
  console.log(isWeekOffChecked);

  return (
    <Form {...control}>
      <form
        onSubmit={handleSubmit(handlesSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex w-full justify-end items-center border-b-2 border-gray-200 pb-4">
          <h1 className="text-xl w-full">
            {mode === 'update' ? 'Update WeekOff' : 'Create WeekOff'}
          </h1>
          <Button
            id="create-holiday"
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
        <div className="flex h-auto items-center w-full justify-between">
          <FormField
            control={control}
            name="WeekOffName"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[45%]">
                <FormLabel
                  className={
                    errors?.WeekOffName
                      ? 'text-[#737373]'
                      : 'text-sm font-medium text-gray-700'
                  }
                >
                  WeekOff Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setname(e.target.value);
                    }}
                    type="text"
                    placeholder="Enter WeekOff"
                    className="h-[36px] rounded-sm flex items-center shadow-none border border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <div>
                  {errors?.WeekOffName && (
                    <span className="text-red-500 font-semibold">
                      {errors.WeekOffName.message}
                    </span>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="Effective_Date"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[45%]">
                <FormLabel
                  className={
                    errors?.Effective_Date?.message
                      ? 'text-[#737373] '
                      : 'text-sm font-medium text-gray-700'
                  }
                >
                  Effective Date
                </FormLabel>
                <FormControl>
                  <DatePicker
                    {...field}
                    className="h-[36px] w-full p-[12px] border border-gray-300 rounded-sm  outline-none"
                    placeholderText="Start Date"
                    onChange={(date) => {
                      field.onChange(date);
                      const localDate = new Date(
                        date?.getTime() - date?.getTimezoneOffset() * 60000
                      )
                        ?.toISOString()
                        .split('T')[0];
                      field.onChange(localDate);
                      setdate(localDate);
                    }}
                    dateFormat="dd-MM-yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    isClearable={true}
                  />
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
        </div>
        <FormField
          control={control}
          name="days"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel
                className={
                  errors?.End_Date
                    ? 'text-[#737373]'
                    : 'text-sm font-medium text-gray-700'
                }
              ></FormLabel>
              <FormControl>
                <div>
                  <div className="flex text-xl justify-around  bg-[#1E3A8A] text-[#FFFFFF]">
                    <div className="">Days</div>
                    <div className="">WeekOff</div>
                    <div className="">Half Day</div>
                    <div className="pl-2.5"> Weeks</div>
                  </div>
                  {daysOfWeek.map((day, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`flex items-center border-gray-200 border text-[#1E3A8A] hover:bg-blue-50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-[#F0F9FF] ' : 'bg-[#FFFFFF]'}`}
                      >
                        <div className="min-w-25 text-2xl">{day}</div>
                        <div className="flex w-full items-center justify-between ml-20">
                          <Checkbox
                            className="form-checkbox h-5 w-5  border-2 border-[#879ac1] shadow-xl"
                            checked={formData.days[day].weekOff}
                            onCheckedChange={(s) =>
                              handleCheckboxChange(day, 'weekOff')
                            }
                            disabled={formData.days[day].halfDay}
                          />
                          <Checkbox
                            className="form-checkbox h-5 w-5  rounded border-2 border-[#879ac1] shadow-xl"
                            disabled={formData.days[day].weekOff}
                            checked={formData.days[day].halfDay}
                            onCheckedChange={() =>
                              handleCheckboxChange(day, 'halfDay')
                            }
                          />
                          <div className="flex mr-8 ">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="default"
                                  className="px-2 py-1 text-center shadow bg-[#6794f4]  text-[#FFFFFF] font-semibold rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  Select
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="flex flex-col w-50"
                                side="right"
                                align="start"
                                style={{ pointerEvents: 'auto' }}
                              >
                                <div
                                  className="space-y-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {weekOptions.map((week, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center space-x-2 cursor-pointer"
                                    >
                                      <Checkbox
                                        name="weekoffcheckbox"
                                        id={idx}
                                        className="cursor-pointer"
                                        checked={formData.days[
                                          day
                                        ].weeks.includes(week)}
                                        onCheckedChange={(checked) =>
                                          handleWeekSelection(
                                            day,
                                            week,
                                            checked
                                          )
                                        }
                                      />
                                      <label
                                        onClick={() => {
                                          const iscurrentlyChecked =
                                            formData.days[day].weeks.includes(
                                              week
                                            );
                                          handleWeekSelection(
                                            day,
                                            week,
                                            !iscurrentlyChecked
                                          );
                                        }}
                                        id={idx}
                                        htmlFor={`${week}-${idx}`}
                                        className="text-sm cursor-pointer"
                                      >
                                        {week}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
