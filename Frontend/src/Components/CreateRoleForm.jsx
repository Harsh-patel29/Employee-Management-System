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
import { Switch } from "../Components/components/ui/switch";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getKeys ,getRoleById} from "../feature/rolesfetch/getrolesSlice.js";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is Required" }),
  access: z.record(z.record(z.boolean())).default({}),
});

export default function AdminForm({ onSubmit,mode }) {
  const {id} = useParams();
  const navigate = useNavigate();
  const [accessData, setAccessData] = useState({});
  const [roleData, setRoleData] = useState({});
  const dispatch = useDispatch();
  const { keys ,roleById , updatedRole , createdRole} = useSelector((state) => state.getrole);
  console.log(updatedRole);
  console.log(createdRole);
  
  useEffect(() => {
    dispatch(getKeys());
  }, []);

  useEffect(() => {
    if(createdRole?.success){
      navigate("/users/roles");
    }
  }, [createdRole]);
  
  useEffect(() => {
    if(updatedRole?.success){
      navigate("/users/roles");
    }
  }, [updatedRole]);

  useEffect(() => {
    if ( mode === "update" && id) {
      dispatch(getRoleById(id));
    }
  }, [dispatch, id, mode]);
  
  useEffect(() => {
    if (keys?.message?.[0]?.access_key) {
      setAccessData(keys.message[0].access_key);
    } else {
      setAccessData([]);
    }
  }, [keys?.message]);
  

   const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      access: {},
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    if (mode === "update" && roleById?.message) {
      const detail = roleById.message;
      reset({
        name: detail?.name || "", 
        access: detail?.access || {},
      });
    }
  }, [roleById?.message, reset, mode]);
  
  return (
    <>
      <Form {...control}>
        <div className="max-w-4xl mx-auto bg-[#cce7f2] rounded-xl shadow-lg">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {mode === "update" ? "Update Role" : "Create Role" }
            </h2>
            <form
              onSubmit={handleSubmit((data) => {
                onSubmit(data);
                if(mode === "create" && createdRole?.success){
                  navigate("/user/roles");
                  reset();
                }
                if(mode === "update" && updatedRole?.success){
                  reset();
                  navigate("/user/roles");
                }
              })}
              className="space-y-6"
            >
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e4f2f7] focus:border-[#e4f2f7] transition-all"
                        type="text"
                        placeholder="Enter Role Name"
                        {...field}
                      />
                    </FormControl>
                    <div>
                      {errors?.name && (
                        <span className="text-red-500 text-sm">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="access"
                render={({ field }) => (
                  <FormItem className="space-y-6">
                    <FormLabel className="text-lg font-semibold text-gray-800">
                      Access Keys
                    </FormLabel>
                    <div className="space-y-4">
                      {Object.entries(accessData).map(
                        ([category, permissions]) => (
                          <div
                            key={category}
                            className="bg-[#e4f2f7] p-4 rounded-lg border border-gray-200 shadow-sm"
                          >
                            <h3 className="font-semibold capitalize text-gray-700 mb-4 text-lg">
                              {category}
                            </h3>
                            <div className="grid gap-3">
                              {Object.entries(permissions).map(
                                ([key, value]) => (
                                  <div
                                    key={`${category}-${key}`}
                                    className="flex items-center justify-between py-3 px-4 bg-[#e4f2f7] rounded-md shadow-sm hover:bg-[#cce7f2] transition-colors duration-200"
                                  >
                                    <span className="text-sm font-medium text-gray-600 capitalize">
                                      {key.replace(/_/g, " ")}
                                    </span>
                                    <Switch
                                      checked={
                                        field.value?.[category]?.[key] || false
                                      }
                                      onCheckedChange={(checked) => {
                                        const updatedValue = {
                                          ...field.value,
                                          [category]: {
                                            ...(field.value?.[category] || {}),
                                            [key]: checked,
                                          },
                                        };
                                        field.onChange(updatedValue);
                                      }}
                                      className="data-[state=checked]:bg-[#78adc4] data-[state=unchecked]:bg-gray-200"
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full py-3 bg-[#e4f2f7] text-gray-800 font-medium rounded-lg hover:bg-[#cce7f2] transition-colors duration-200 focus:ring-1 focus:ring-[#cce7f2] focus:ring-opacity-50"
              >
                {mode === "update" ? "Update" : "Create"}
              </Button>
            </form>
          </div>
        </div>
      </Form>
    </>
  );
}
