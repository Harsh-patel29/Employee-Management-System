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
import { useEffect } from "react";
import { useParams } from "react-router";
import { getUser } from "../feature/datafetch/userfetchSlice";
const formSchema = z.object({
  Name: z.string(),
  Email: z.string().email("Please enter correct Email"),
  Password: z.string().min(6, "Passoword must be 6 characters"),
  Date_of_Birth: z.string(),
  Mobile_Number: z.string().min(10, "Please enter valid mobile Number"),
  Gender: z.enum(["MALE", "FEMALE"]),
  DATE_OF_JOINING: z.string(),
  Designation: z.string(),
  WeekOff: z.string(),
  role: z.enum(["Admin", "Developer", "HR", "Product_Manager"]),
  ReportingManager: z.string(),
});

export default function AdminForm({ onSubmit }) {
  const user = useSelector((state) => state.getuser);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getUser(id));
    }
  }, [dispatch, id]);

  const { control, handleSubmit, reset } = useForm({
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

  const detail = user?.user?.message;
  useEffect(() => {
    if (user?.user?.message) {
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
  }, [user, reset]);

  return (
    <Form {...control}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto p-4 border 
         rounded-lg shadow flex flex-wrap gap-6 "
      >
        <FormField
          control={control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Email"
          render={({ field }) => (
            <FormItem className="ml-3">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="w-auto"
                  type="email"
                  placeholder="Enter your email"
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
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="w-auto"
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
            <FormItem className="ml-8">
              <FormLabel>DOB</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Enter Your Date of Birth"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Mobile_Number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
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
            <FormItem className="ml-14">
              <FormLabel htmlFor="Gender">Select Gender</FormLabel>
              <FormControl>
                <select
                  id="Gender"
                  {...field}
                  className="flex border border-black/80 w-32 h-8 rounded-md shadow"
                >
                  <option value="Select">Select</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="DATE_OF_JOINING"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Joining</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Enter Date Of Joining"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Designation"
          render={({ field }) => (
            <FormItem className="ml-12">
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
            <FormItem>
              <FormLabel>Week Off</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter WeekOff" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem className="ml-14">
              <FormLabel htmlFor="role">Role</FormLabel>
              <FormControl>
                <select
                  id="role"
                  className="flex border border-black/80 w-32 h-8 rounded-md shadow"
                  {...field}
                >
                  <option value="Select">Select</option>
                  <option value="Admin">Admin</option>
                  <option value="HR">HR</option>
                  <option value="Product_Manager">Product_Manager</option>
                  <option value="Developer">Developer</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="ReportingManager"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center ml-24">
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
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
