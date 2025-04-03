import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../Components/components/ui/button";
import { Input } from "../Components/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from "../Components/components/ui/form";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../Components/components/ui/popover";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getKeys } from "../feature/rolesfetch/getrolesSlice.js";

const formSchema = z.object({
  Name: z.string().min(1, { message: "Name is Required" }),
});

export default function AdminForm({ onSubmit, mode }) {
  const [data, setdata] = useState([]);
  const dispatch = useDispatch();
  const { keys } = useSelector((state) => state.keys);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
    },
  });

  useEffect(() => {
    dispatch(getKeys());
  }, []);
  console.log(keys);

  return (
    <>
      <Form {...control}>
        <h2>Create Role</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="Name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Name</FormLabel>
                <div>{errors?.Name && <span>{errors.Name.message}</span>}</div>
                <FormControl>
                  <Input
                    className="shadow"
                    type="text"
                    placeholder="Enter Your Name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-[100%] focus:ring focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Create
          </Button>
        </form>
      </Form>
    </>
  );
}
