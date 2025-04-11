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
  resetProject,
  deleteLogo,
} from "../feature/projectfetch/createproject.js";
import { Bounce,toast } from "react-toastify";
import Loader from "./Loader.jsx";

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
    { message: "Select Progress status" }
  ),
  status: z.enum(["Active", "In-Active"], { message: "Select status" }),
});

export default function ProjectForm({ onSubmit, mode, onClose }) {
  const { projectbyid, logo, project, logoloading ,updatedproject,error} = useSelector(
    (state) => state.project
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const [logos, setlogos] = useState(null);
 const[publicid,setpublicid]= useState(null);

  useEffect(()=>{
    if(project?.success){
      toast.success("Project created successfully",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      })
    }
    return ()=>{
      dispatch(resetProject())
    }
  },[project?.success])

  useEffect(()=>{
    if(updatedproject?.success){
      toast.success("Project updated successfully",{
        position: "top-right",
        autoClose: 3000,
      })
    }
    return ()=>{
      dispatch(resetProject())
    }
    },[updatedproject?.success])

  useEffect(()=>{
    if(error){
      const errorMessage = error.response?.data?.message || error.message || error;
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
    }
    },[error])



  useEffect(() => {
    if (logo?.success) {
      setlogos(logo?.message?.url);
      setpublicid(logo?.message?.public_id);
    }
  }, [logo]);

  // Cleanup on unmount if form is closed without submission
  useEffect(() => {
    return () => {
      if (logos && !project?.success && !updatedproject?.success) {
        if (mode === "create") {
          dispatch(deleteLogo(publicid));
        } else if (mode === "update" && projectbyid?.message?.logo?.public_id !== publicid) {
          dispatch(deleteLogo(publicid));
        }
      }
    };
  }, [logos, project?.success, updatedproject?.success, publicid, mode, projectbyid?.message?.logo?.public_id]);

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
        logo: detail?.logo.url || "",
        progress_status: detail?.progress_status || "",
        status: detail?.status || "",
      });
    }
  }, [mode, projectbyid, reset]);

  const handleFormSubmit = (data) => {
    const formData = {
      name: data.name,
      logo: logos ? {
        secure_url: logos,
        public_id: publicid,
      } : undefined,
      progress_status: data.progress_status,
      status: data.status
    };

    onSubmit(formData);
  };

  useEffect(() => {
    if(mode==="create"){
      setlogos(null);
      return()=>{
        dispatch(resetProject())
      }
    }
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
              <FormLabel className={errors?.logo ? "text-[#737373]" : ""}>
                Project Logo
              </FormLabel>
              <label
                id="label"
                htmlFor="file-upload"
                className={`${logoloading ? "w-80 h-60 flex items-center justify-center" : "w-80 h-60"} flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-500 cursor-pointer hover:bg-gray-50`}
              >
                {logoloading ? (
                 <Loader />
                ) : 
                mode === "update" ? (
                  <>
                    {logos ? (
                      <img
                        src={logos}
                        alt=""
                        className={`${logoloading ? "hidden" : ""} h-60 w-80`}
                      />
                    ) : (
                      <img
                        src={projectbyid?.message?.logo.url}
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
              <div>
                {" "}
                {errors?.logo && (
                  <span className="text-red-600 font-semibold">
                    {errors.logo.message}
                  </span>
                )}
              </div>
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
            <FormItem className={`${logoloading?"opacity-50 cursor-not-allowed":""} mt-4`}>
              <FormLabel className={errors?.name ? "text-[#737373]" : ""}>
                Project Name
              </FormLabel>
              <FormControl>
                <Input
                  className="w-[90%]"
                  type="text"
                  placeholder="Enter Project Name"
                  {...field}
                />
              </FormControl>
              <div>
                {" "}
                {errors?.name && (
                  <span className="text-red-600 font-semibold">
                    {errors.name.message}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="progress_status"
          render={({ field }) => (
            <FormItem className={`${logoloading?"opacity-50 cursor-not-allowed":""} mt-4`}>
              <FormLabel className={errors?.progress_status ? "text-[#737373]" : ""}>
                Project Progress
              </FormLabel>
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
              <div>
                {errors?.progress_status && (
                  <span className="text-red-600 font-semibold">
                    {errors.progress_status.message}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem className={`${logoloading?"opacity-50 cursor-not-allowed":""} mt-4`}>
              <FormLabel className={errors?.status ? "text-[#737373] " : ""}>
                Project Status
              </FormLabel>
              <FormControl>
                <select
                  className={`flex border w-[90%] h-9 rounded-md shadow pl-2`}
                  {...field}
                >
                  <option value="" disabled selected>
                    Select Status
                  </option>
                  <option value="Active">Active</option>
                  <option value="In-Active">In-Active</option>
                </select>
              </FormControl>
              <div>
                {errors?.status && (
                  <span className="text-red-600 font-semibold">
                    {errors.status.message}
                  </span>
                )}
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={`${logoloading ? "opacity-50 cursor-not-allowed" : ""} w-[40%] ml-50 focus:ring focus:ring-blue-400 bg-blue-600 hover:bg-blue-700 rounded-lg mt-6`}
        >
          {mode === "update" ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
