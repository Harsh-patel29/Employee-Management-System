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

const AssignSheet = () => {
  const { id } = useParams();
  const [users, setusers] = useState();
  const [roles, setroles] = useState();
  const [userid, setuserid] = useState(id);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedRole, setSelectedRole] = useState();

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

  const assignUser = async () => {
    if (!selectedUser || !selectedRole) {
      console.log("User and Role are required");
      return;
    }

    const data = {
      user: selectedUser,
      role: selectedRole,
    };

    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v3/project/project/roles/update/${userid}`,
        data,
        { withCredentials: true }
      );
      if (res.data.success === true) {
        window.location.assign(`/productivity/project/${id}`);
      }
      return res.data;
    } catch (error) {
      console.log("Something went wrong while Assigning role");
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="w-35">Assign User</SheetTrigger>
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
                onClick={assignUser}
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
