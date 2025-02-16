import React, { use, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { replace, useNavigate } from "react-router";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../Components/components/ui/select.tsx";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "../Components/components/ui/drawer.tsx";
import AuthForm from "../Components/Form.jsx";
import UpdateForm from "../Components/UpdateForm.jsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../Components/components/ui/sheet";
import AdminForm from "../Components/AdminForm.jsx";
const Users = () => {
  const { user } = useSelector((state) => state.auth);

  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(true);
  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    const Details = async (e) => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/", {
          withCredentials: true,
        });

        setusers(res.data.message);
      } catch (error) {
        console.log("Not Authorized", error?.response.data || error.message);
      } finally {
        setloading(false);
      }
      const role = user.user.role;
      if (role === "Admin") {
        setisAdmin(true);
      } else setisAdmin(false);
    };
    Details();
  }, []);

  const navigate = useNavigate();

  const addUser = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/createUser",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success === true) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Something went wrong while creating user");
    }
  };

  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);

  // const handleEdit = (userID) => {
  //   window.history.pushState({}, "", `/users/${userID}`);
  // };

  const { id } = useParams();
  const [sheetopen, setsheetopen] = useState(false);
  const [userid, setuserid] = useState(id);

  const openSheet = (id) => {
    navigate(`/users/${id}`);
    setTimeout(() => {
      setsheetopen(true);
    }, 0);
  };

  useEffect(() => {
    setuserid(id);
  }, [id]);

  const updateUser = async (data) => {
    const res = await axios.put(
      `http://localhost:8000/api/v1/user/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (res.data.statusCode) {
      navigate("/dashboard");
    }

    return res.data;
  };

  return (
    <div
      className={`flex items-start pl-6 mt-32 right-0 absolute bg-white/20 rounded-xl `}
      style={{
        width: isExpanded ? "calc(100% - 280px)" : "calc(100% - 64px)",
      }}
    >
      <div className=" w-auto ml-14 h-full shadow-xl rounded-xl">
        <div className="text-3xl pb-4 flex ml-2 justify-between">
          Users
          <Drawer>
            <DrawerTrigger className={`${isAdmin ? "flex" : "hidden"}`}>
              +
            </DrawerTrigger>
            <DrawerContent className="">
              <AuthForm onSubmit={addUser} />
            </DrawerContent>
          </Drawer>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md w-[80rem] rounded-lg h-[30rem]">
            <table className="w-full border-collapse ">
              <thead className="bg-blue-200 text-gray-800">
                <tr>
                  <th></th>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">EmpCode</th>
                  <th className="p-3 text-left">role</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Date of Joining</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Reporting Manager</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users?.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id} className="border-b hover:bg-gray-100">
                      <Select>
                        <SelectTrigger className="w-auto">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DOJ">
                            Date of Joining :- {user.DATE_OF_JOINING}
                          </SelectItem>
                          <SelectItem value="Mobile Number">
                            Mobile Number :- {user.Mobile_Number}
                          </SelectItem>
                          <SelectItem value="system">
                            DOB :-{user.Date_of_Birth}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{user.Name || "N/A"}</td>
                      <td className="p-3">{user.EMP_CODE || "N/A"}</td>
                      <td className="p-3">{user.role || "N/A"}</td>
                      <td className="p-3">{user.Email || "N/A"}</td>
                      <td className="p-3">{user.DATE_OF_JOINING}</td>
                      <td className="p-3">{user.Mobile_Number || "N/A"}</td>
                      <td className="p-3 ">{user.ReportingManager || "N/A"}</td>
                      <td className="p-3">
                        <Sheet
                          // open={!!id}
                          onOpenChange={(open) => {
                            if (!open) navigate("/users");
                          }}
                        >
                          <SheetTrigger
                            onClick={() => {
                              openSheet(user._id);
                            }}
                            asChild
                          >
                            <FaEdit />
                          </SheetTrigger>
                          <SheetContent className="min-w-4xl">
                            <SheetHeader>
                              <SheetTitle className="text-2xl">
                                Update User??
                              </SheetTitle>
                              <SheetDescription>
                                {isAdmin ? (
                                  <AdminForm onSubmit={updateUser} />
                                ) : (
                                  <UpdateForm onSubmit={updateUser} />
                                )}
                              </SheetDescription>
                            </SheetHeader>
                          </SheetContent>
                        </Sheet>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-3 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
