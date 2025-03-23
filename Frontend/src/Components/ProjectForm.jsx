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
import axios from "axios";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Logo is required" }),
  progress_status: z.enum(
    ["Pending", "In-Progress", "Hold", "Completed", "Scrapped"],
    { message: "Select status" }
  ),
  status: z.enum(["Active", "In-Active"], { message: "Select status" }),
});

export default function ProjectForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logo: null,
      progress_status: "",
      status: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const [users, setusers] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/", {
          withCredentials: true,
        });
        setusers(res.data.message);
        return res.data;
      } catch (error) {
        console.log("Something went wrong while fetching users", error);
      }
    };
    getAllUsers();
  }, []);

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", data.logo[0]);
    formData.append("progress_status", data.progress_status);
    formData.append("status", data.status);

    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className=""
        encType="multipart/form-data"
      >
        <FormField
          control={control}
          name="logo"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Project Logo</FormLabel>
              <div> {errors?.logo && <span>{errors.logo.message}</span>}</div>
              <FormControl>
                <Input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    field.onChange(files);
                  }}
                  id="file-upload"
                />
              </FormControl>
              <label
                htmlFor="file-upload"
                className="w-60 h-60 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-500 cursor-pointer hover:bg-gray-50"
              >
                Upload
              </label>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Project Name</FormLabel>
              <div> {errors?.name && <span>{errors.name.message}</span>}</div>
              <FormControl>
                <Input
                  className="w-[90%]"
                  type="text"
                  placeholder="Enter Project Name"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="progress_status"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Project Progress</FormLabel>
              <div>
                {errors?.progress_status && (
                  <span>{errors.progress_status.message}</span>
                )}
              </div>
              <FormControl>
                <select
                  className="flex border w-[90%] h-9 rounded-md shadow pl-2"
                  {...field}
                >
                  <option value="" disabled selected>
                    Select Progress
                  </option>
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Hold">Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Scrapped">Scrapped</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Project Status</FormLabel>
              <div>
                {errors?.status && <span>{errors.status.message}</span>}
              </div>
              <FormControl>
                <select
                  className="flex border w-[90%] h-9 rounded-md shadow pl-2"
                  {...field}
                >
                  <option value="" disabled selected>
                    Select Status
                  </option>
                  <option value="Active">Active</option>
                  <option value="In-Active">In-Active</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-[40%] ml-50 focus:ring focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 rounded-lg mt-6"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
