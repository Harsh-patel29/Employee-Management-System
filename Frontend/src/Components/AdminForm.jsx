import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../Components/components/ui/button";
import { Input } from "../Components/components/ui/input";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
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
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getUser } from "../feature/datafetch/userfetchSlice";

const formSchema = z.object({
  Name: z.string().min(1, { message: "Name is Required" }),
  Email: z.string().email({ message: "Please enter correct Email" }),
  Password: z.string().min(6, { message: "Passoword must be 6 characters" }),
  Date_of_Birth: z.string().min(1, { message: "Date of Birth is Required" }),
  Mobile_Number: z
    .string()
    .min(8, { message: "Please enter valid mobile Number" }),
  Gender: z.enum(["MALE", "FEMALE"], { message: "Select Gender" }),
  DATE_OF_JOINING: z
    .string()
    .min(1, { message: "Date of Joining is required" }),
  Designation: z.string(),
  WeekOff: z.string(),
  role: z.enum(["Admin", "Developer", "HR", "Product_Manager"], {
    message: "Select Role",
  }),
  ReportingManager: z.string(),
});

export default function AdminForm({ onSubmit }) {
  const users = useSelector((state) => state.getuser);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getUser(id));
    }
  }, [dispatch, id]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Email: "",
      Password: "",
      Date_of_Birth: "",
      Mobile_Number: "",
      Gender: "",
      DATE_OF_JOINING: "",
      Designation: "",
      WeekOff: "",
      role: "",
      ReportingManager: "",
    },
  });

  const detail = users?.users?.message;
  useEffect(() => {
    if (users?.users?.message) {
      reset({
        Name: detail?.Name || "",
        Email: detail?.Email || "",
        Password: detail?.Password || "",
        Date_of_Birth: detail?.Date_of_Birth
          ? detail?.Date_of_Birth.split("T")[0]
          : "",
        Mobile_Number: detail?.Mobile_Number || "",
        Gender: detail?.Gender || "",
        DATE_OF_JOINING: detail?.DATE_OF_JOINING
          ? detail?.DATE_OF_JOINING.split("T")[0]
          : "",
        Designation: detail?.Designation || "",
        WeekOff: detail?.WeekOff || "",
        role: detail?.role || "",
        ReportingManager: detail.ReportingManager || "",
      });
    }
  }, [users, reset]);

  const theme = useSelector((state) => state.theme.theme);

  return (
    <Form {...control}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`
        grid grid-cols-3 gap-8 space-y-10 items-center justify-evenly ml-36 mt-4 `}
      >
        <FormField
          control={control}
          name="Name"
          render={({ field }) => (
            <FormItem className="w-[80%]">
              <FormLabel>Name</FormLabel>
              <div>{errors?.Name && <span>{errors.Name.message}</span>}</div>
              <FormControl>
                <Input
                  className=""
                  type="text"
                  placeholder="Enter Your Name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Email"
          render={({ field }) => (
            <FormItem className="w-[80%]">
              <FormLabel>Email</FormLabel>
              <div>{errors?.Email && <span>{errors.Email.message}</span>}</div>
              <FormControl>
                <Input
                  className=""
                  type="email"
                  placeholder="Enter Your Email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Password"
          render={({ field }) => (
            <FormItem className="w-[80%]">
              <FormLabel>Password</FormLabel>
              <div>
                {errors?.Password && <span>{errors.Password.message}</span>}
              </div>
              <FormControl>
                <Input
                  className=""
                  type="password"
                  placeholder="Enter Password"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Date_of_Birth"
          render={({ field }) => (
            <FormItem className="w-[80%] flex flex-col">
              <FormLabel>DOB</FormLabel>
              <div>
                {errors?.Date_of_Birth && (
                  <span>{errors.Date_of_Birth.message}</span>
                )}
              </div>
              <FormControl>
                <Popover>
                  <PopoverTrigger>
                    <Input
                      type="text"
                      className="justify-evenly"
                      value={
                        field.value
                          ? new Date(field.value).toLocaleDateString("en-CA")
                          : ""
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
                          field.onChange(localDate.toISOString().split("T")[0]);
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
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Mobile_Number"
          render={({ field }) => (
            <FormItem className="w-[80%]">
              <FormLabel>Mobile Number</FormLabel>
              <div>
                {errors?.Mobile_Number && (
                  <span>{errors.Mobile_Number.message}</span>
                )}
              </div>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Your Mobile Number"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Gender"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel htmlFor="Gender">Select Gender</FormLabel>
              <div>
                {errors?.Gender && <span>{errors.Gender.message}</span>}
              </div>
              <FormControl>
                <select
                  id="Gender"
                  {...field}
                  className="flex border w-[80%] h-9 rounded-md shadow"
                >
                  <option
                    value=""
                    className={`${
                      theme === "light" ? "bg-white" : "bg-[#121212]"
                    }`}
                    disabled
                    selected
                  >
                    Select
                  </option>
                  <option
                    value="MALE"
                    className={`${
                      theme === "light" ? "bg-white" : "bg-[#121212]"
                    }`}
                  >
                    MALE
                  </option>
                  <option
                    value="FEMALE"
                    className={`${
                      theme === "light" ? "bg-white" : "bg-[#121212]"
                    }`}
                  >
                    FEMALE
                  </option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        {user.user.role === "Admin" ? (
          <FormField
            control={control}
            name="DATE_OF_JOINING"
            render={({ field }) => (
              <FormItem className="w-[80%] flex flex-col ">
                <FormLabel>Date Of Joining</FormLabel>
                <div>
                  {errors?.DATE_OF_JOINING && (
                    <span>{errors.DATE_OF_JOINING.message}</span>
                  )}
                </div>
                <FormControl>
                  <Popover>
                    <PopoverTrigger>
                      <Input
                        type="text"
                        className="justify-evenly"
                        value={
                          field.value
                            ? new Date(field.value).toLocaleDateString("en-CA")
                            : ""
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
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={control}
          name="Designation"
          render={({ field }) => (
            <FormItem className="w-[80%]">
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Designation" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="WeekOff"
          render={({ field }) => (
            <FormItem className="w-[80%]">
              <FormLabel>Week Off</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter WeekOff" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {user.user.role === "Admin" ? (
          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel htmlFor="role">Role</FormLabel>
                <div>{errors?.role && <span>{errors.role.message}</span>}</div>
                <FormControl>
                  <select
                    id="role"
                    className="flex w-[80%] border-2 h-9 rounded-md shadow"
                    {...field}
                  >
                    <option
                      value=""
                      className={`${
                        theme === "light" ? "bg-white" : "bg-[#121212]"
                      }`}
                      disabled
                      selected
                    >
                      Select
                    </option>
                    <option
                      value="Admin"
                      className={`${
                        theme === "light" ? "bg-white" : "bg-[#121212]"
                      }`}
                    >
                      Admin
                    </option>
                    <option
                      value="HR"
                      className={`${
                        theme === "light" ? "bg-white" : "bg-[#121212]"
                      }`}
                    >
                      HR
                    </option>
                    <option
                      value="Product_Manager"
                      className={`${
                        theme === "light" ? "bg-white" : "bg-[#121212]"
                      }`}
                    >
                      Product_Manager
                    </option>
                    <option
                      value="Developer"
                      className={`${
                        theme === "light" ? "bg-white" : "bg-[#121212]"
                      }`}
                    >
                      Developer
                    </option>
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
        ) : null}
        <FormField
          control={control}
          name="ReportingManager"
          render={({ field }) => (
            <FormItem className="w-[80%]">
              <FormLabel>Reporting Manager</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Name of ReportingManager"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className=" row-span-2 w-[50%] col-span-2 ml-53 mb-2 bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
