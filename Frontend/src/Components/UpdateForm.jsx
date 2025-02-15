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

const formSchema = z.object({
  Name: z.string(),
  Email: z.string().email("Please enter correct Email"),
  Password: z.string().min(6, "Passoword must be 6 characters"),
  Date_of_Birth: z.string(),
  Mobile_Number: z.string().min(8, "Please enter valid mobile Number"),
  Gender: z.enum(["MALE", "FEMALE"]),
  DATE_OF_JOINING: z.string(),
  Designation: z.string(),
  WeekOff: z.string(),
  role: z.enum(["Admin", "Developer", "HR", "Product_Manager"]),
  ReportingManager: z.string(),
});

export default function UpdateForm({ onSubmit }) {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Email: "",
      Date_of_Birth: "",
      Mobile_Number: "",
      Gender: "",
      Designation: "",
      WeekOff: "",
      ReportingManager: "",
    },
  });

  return (
    <Form {...control}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto p-4 border rounded-lg shadow flex flex-wrap gap-8 "
      >
        <FormField
          control={control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter Your Name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter Your Email" {...field} />
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
            <FormItem>
              <FormLabel className="ml-6">DOB</FormLabel>
              <FormControl>
                <Input
                  className="ml-6"
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
              <FormLabel className="">Mobile Number</FormLabel>
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
              <FormLabel>Select Gender</FormLabel>
              <FormControl>
                <select
                  id="Gender"
                  className="flex border border-black/80 w-32 h-8 rounded-md shadow"
                >
                  <option value="MALE" {...field}>
                    MALE
                  </option>
                  <option value="FEMALE" {...field}>
                    FEMALE
                  </option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="Designation"
          render={({ field }) => (
            <FormItem>
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
              <FormLabel className="ml-3">Week Off</FormLabel>
              <FormControl>
                <Input
                  className="ml-2"
                  type="text"
                  placeholder="Enter WeekOff"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ReportingManager"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center ml-28">
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
