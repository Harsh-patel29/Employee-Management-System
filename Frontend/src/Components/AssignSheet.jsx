import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../Components/components/ui/sheet";
import AssignUserTable from "./AssignUserTable";
import { useParams } from "react-router";
import { useDispatch ,useSelector} from "react-redux";
import { assignuser,getname,resetAssigneduser,resetDeleteuser } from "../feature/projectfetch/assignuser.js";
import { Bounce, toast } from "react-toastify";

const AssignSheet = () => {
  const { id } = useParams();
  const [users, setusers] = useState();
  const [roles, setroles] = useState();
  const [userid, setuserid] = useState(id);
  const [sheetopen, setsheetopen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedRole, setSelectedRole] = useState();

  const dispatch = useDispatch();
  const { assigneduser, deleteuser,error } = useSelector((state) => state.assignusers);

  
useEffect(()=>{
  if(assigneduser?.success){
    toast.success("User assigned successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  }
  return () => {
    dispatch(resetAssigneduser());
    dispatch(resetDeleteuser());
  }
},[assigneduser?.success])

useEffect(()=>{
  if(deleteuser?.success){
    toast.success("User deleted successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  }
},[deleteuser?.success]) 

useEffect(() => {
    if (error) {
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
      });
    }
  },[error])
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/", {
          withCredentials: true,
        });
        setusers(res?.data?.message);
        return res?.data;
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v3/project/project/roles/details",
          { withCredentials: true }
        );
        setroles(res?.data?.message);
        return res.data;
      } catch (error) {
        console.log("Something went wrong while fetching roles detail");
      }
    }
    fetchRoles();
  }, []);

  const data = {
    user: selectedUser,
    role: selectedRole,
  };

  return (
    <Sheet open={sheetopen} onOpenChange={setsheetopen}>
      <SheetTrigger className="w-35">
        <div className="bg-[#ffffff] text-[#338DB5] font-[400] gap-3 border-[rgb(51,141,181)] border border-solid cursor-pointer rounded-lg w-[160px] justify-center text-[17px] h-9 mr-3 flex items-center hover:bg-[#c1dde9] transition-all duration-300">
          <svg
            class="w-6 h-6 text-[#338DB5]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Assign User</title>
            <path
              fill-rule="evenodd"
              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Assign User
        </div>
      </SheetTrigger>
      <SheetContent className="min-w-2xl">
        <SheetHeader>
          <h1 className="flex w-full justify-center text-2xl">Assign User</h1>
          <SheetDescription>
            <div className="flex items-center gap-3 py-4">
              <div className="relative w-[50%]">
                <select
                  className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 text-gray-600 focus:border-blue-500 focus:outline-none"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select User
                  </option>
                  {users?.map((user) => (
                    <option key={user._id} value={user.Name}>
                      {user.Name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <div className="relative w-[50%]">
                <select
                  className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 text-gray-600 focus:border-blue-500 focus:outline-none"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select Role
                  </option>
                  {roles?.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <button
                className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[49%]"
                onClick={() => {
                  if (sheetopen) {
                    dispatch(assignuser({ data, userid }));
                    dispatch(getname(userid));
                  }
                }}
              >
                Assign
              </button>
            </div>
          </SheetDescription>
          <div className="mt-3">
            <AssignUserTable />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
export default AssignSheet;
