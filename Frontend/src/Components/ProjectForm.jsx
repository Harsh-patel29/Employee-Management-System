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
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import {
  getProjectbyId,
  uploadLogo,
} from "../feature/projectfetch/createproject.js";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z
    .union([
      z.instanceof(File).optional(),
      z.string().url({ message: "Invalid logo URL" }).optional(),
    ])
    .optional(),
  progress_status: z.enum(
    ["Pending", "In-Progress", "Hold", "Completed", "Scrapped"],
    { message: "Select status" }
  ),
  status: z.enum(["Active", "In-Active"], { message: "Select status" }),
});

export default function ProjectForm({ onSubmit, mode, onClose }) {
  const { projectbyid, logo, project } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [logos, setlogos] = useState(null);

  useEffect(() => {
    if (logo?.success) {
      setlogos(logo?.message);
    }
  }, [logo]);

  useEffect(() => {
    if (mode === "update" && id) {
      dispatch(getProjectbyId(id));
    }
  }, [dispatch, id, mode]);

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
    reset,
  } = form;

  useEffect(() => {
    if (mode === "update" && projectbyid?.message) {
      const detail = projectbyid.message;
      reset({
        name: detail?.name || "",
        logo: detail?.logo || "",
        progress_status: detail?.progress_status || "",
        status: detail?.status || "",
      });
    }
  }, [mode, projectbyid, reset]);

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", logos);
    formData.append("progress_status", data.progress_status);
    formData.append("status", data.status);

    onSubmit(formData);
    setlogos(null);
  };

  useEffect(() => {
    setlogos(null);
  }, [onClose]);

  return (
    <Form {...form}>
      <h2 className="w-full flex h-6 justify-center text-2xl font-semibold mt-0">
        {mode === "update" ? "Update Project" : "Create Project"}
      </h2>
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
              <label
                id="label"
                htmlFor="file-upload"
                className="w-80 h-60 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-500 cursor-pointer hover:bg-gray-50"
              >
                {mode === "update" ? (
                  <>
                    {logos ? (
                      <img src={logos} alt="" className="h-60 w-80" />
                    ) : (
                      <img
                        src={projectbyid?.message?.logo}
                        alt=""
                        className="h-60 w-80 rounded-md"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {logos ? (
                      <>
                        <img src={logos} alt="" className="h-60 w-80" />
                      </>
                    ) : (
                      <>Upload</>
                    )}
                  </>
                )}
              </label>
              <FormControl>
                {mode === "update" ? (
                  <Input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files[0];
                      field.onChange(files);
                      if (files) {
                        dispatch(uploadLogo(files));
                      }
                    }}
                    id="file-upload"
                  />
                ) : (
                  <Input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      field.onChange(file);
                      if (file) {
                        dispatch(uploadLogo(file));
                      }
                    }}
                    id="file-upload"
                  />
                )}
              </FormControl>
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
          {mode === "update" ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
