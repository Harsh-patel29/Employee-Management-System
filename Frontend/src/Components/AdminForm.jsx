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
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { getUser } from '../feature/datafetch/userfetchSlice';
('react-redux');

const formSchema = z.object({
  Name: z.string().min(1, { message: 'Name is Required' }),
  Email: z.string().email({ message: 'Please enter correct Email' }),
  Password: z
    .union([
      z.string().min(6, { message: 'Password must be 6 characters' }),
      z.string().length(0),
    ])
    .optional(),
  Date_of_Birth: z.string().min(1, { message: 'Date of Birth is Required' }),
  Mobile_Number: z
    .string()
    .regex(/^\d+$/, { message: 'Please enter a valid mobile number' })
    .min(8, { message: 'Please enter valid mobile Number' }),
  Gender: z.enum(['MALE', 'FEMALE'], { message: 'Select Gender' }),
  DATE_OF_JOINING: z
    .string()
    .min(1, { message: 'Date of Joining is required' }),
  Designation: z.string(),
  WeekOff: z.string(),
  role: z.enum(['Admin', 'Developer', 'HR', 'Product_Manager'], {
    message: 'Select Role',
  }),
  ReportingManager: z.string(),
});

export default function AdminForm({ onSubmit, mode }) {
  const users = useSelector((state) => state.getuser);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (mode === 'update' && id) {
      dispatch(getUser(id));
    }
  }, [dispatch, id, mode]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
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

  const theme = useSelector((state) => state.theme.theme);

  return (
    <>
      <Form {...control}>
        <h2
          className={`${
            theme === 'light' ? 'text-black' : 'text-white'
          } w-full flex h-15 justify-center text-2xl font-semibold mt-8`}
        >
          {mode === 'update' ? 'Update User' : 'Create User'}
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`grid grid-cols-3 gap-6 items-center justify-evenly ml-10`}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="shadow"
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
                <div>
                  {errors?.Password && <span>{errors.Password.message}</span>}
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
                    <PopoverTrigger>
                      <Input
                        type="text"
                        className="justify-evenly shadow"
                        value={
                          field.value
                            ? new Date(field.value).toLocaleDateString('en-CA')
                            : ''
                        }
                        onChange={field.onChange}
                        placeholder="Select Date"
                      ></Input>
                    </PopoverTrigger>
                    <PopoverContent>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          if (date) {
                            const localDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000
                            );
                            field.onChange(
                              localDate.toISOString().split('T')[0]
                            );
                          }
                        }}
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
                  <select
                    id="Gender"
                    {...field}
                    className="flex border w-[90%] h-9 rounded-md shadow pl-2"
                  >
                    <option
                      value=""
                      className={`${
                        theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                      } `}
                      disabled
                      selected
                    >
                      Select
                    </option>
                    <option
                      value="MALE"
                      className={`${
                        theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                      }`}
                    >
                      MALE
                    </option>
                    <option
                      value="FEMALE"
                      className={`${
                        theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                      }`}
                    >
                      FEMALE
                    </option>
                  </select>
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
          {user.permission.user.can_update_user_roles === true ? (
            <FormField
              control={control}
              name="DATE_OF_JOINING"
              render={({ field }) => (
                <FormItem className="w-[90%] flex flex-col h-16">
                  <FormLabel
                    className={`${errors?.DATE_OF_JOINING ? 'text-[#737373] h-10' : ''}`}
                  >
                    Date Of Joining
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger>
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
                                localDate.toISOString().split('T')[0]
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
          ) : null}
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
          {user.permission.user.can_update_user_roles === true ? (
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
                    <select
                      id="role"
                      className="flex border w-[90%] h-9 rounded-md shadow pl-2"
                      {...field}
                    >
                      <option
                        value=""
                        className={`${
                          theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                        }`}
                        disabled
                        selected
                      >
                        Select
                      </option>
                      <option
                        value="Admin"
                        className={`${
                          theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                        }`}
                      >
                        Admin
                      </option>
                      <option
                        value="HR"
                        className={`${
                          theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                        }`}
                      >
                        HR
                      </option>
                      <option
                        value="Product_Manager"
                        className={`${
                          theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                        }`}
                      >
                        Product_Manager
                      </option>
                      <option
                        value="Developer"
                        className={`${
                          theme === 'light' ? 'bg-white' : 'bg-[#121212]'
                        }`}
                      >
                        Developer
                      </option>
                    </select>
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
          ) : null}
          <FormField
            control={control}
            name="ReportingManager"
            render={({ field }) => (
              <FormItem className="w-[90%] mt-0.5 flex flex-col">
                <FormLabel className="">Reporting Manager</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shadow"
                    placeholder="Enter Name of ReportingManager"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <>
            <div></div>
            <div></div>
            <Button
              type="submit"
              className="w-[90%] focus:ring focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {mode === 'update' ? 'Update' : 'Create'}
            </Button>
          </>
        </form>
      </Form>
    </>
  );
}
