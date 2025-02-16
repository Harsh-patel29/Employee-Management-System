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
import { useParams } from "react-router";
import { useEffect } from "react";
import { getUser } from "../feature/datafetch/userfetchSlice";

const formSchema = z.object({
  Name: z.string(),
  Email: z.string().email("Please enter correct Email"),
  Password: z.string().min(6, "Passoword must be 6 characters"),
  Date_of_Birth: z.string(),
  Mobile_Number: z.number().min(8, "Please enter valid mobile Number"),
  Gender: z.enum(["MALE", "FEMALE"]),
  Designation: z.string(),
  DATE_OF_JOINING: z.string(),
  role: z.enum(["Admin", "Developer", "HR", "Product_Manager"]),
  WeekOff: z.string(),
  ReportingManager: z.string(),
});

export default function UpdateForm({ onSubmit }) {
  const user = useSelector((state) => state.getuser);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getUser(id));
    }
  }, [dispatch, id]);

  const detail = user?.user?.message;

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Email: "",
      Date_of_Birth: "",
      Mobile_Number: "",
      Gender: "",
      Designation: "",
      WeekOff: "",
      DATE_OF_JOINING: "",
      role: "",
      ReportingManager: "",
    },
  });
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
        className="space-y-4 max-w-md  mx-auto p-4 border 
         rounded-lg shadow flex flex-wrap gap-4 "
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
                <Input className="w-auto" type="email" {...field} />
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
                <Input type="text" {...field} />
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
                  readOnly
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
            <FormItem className="ml-14">
              <FormLabel className="ml-2">Designation</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter designation" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="WeekOff"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="ml-2">Week Off</FormLabel>
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
              <FormLabel htmlFor="role" className="ml-0.5">
                Role
              </FormLabel>
              <FormControl>
                <select
                  id="role"
                  className="flex border border-black/80 w-32 h-8 rounded-md shadow"
                  {...field}
                >
                  <option value="">{detail?.role}</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="ReportingManager"
          render={({ field }) => (
            <FormItem className="flex flex-col ml-28 items-center">
              <FormLabel>Reporting Manager</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
