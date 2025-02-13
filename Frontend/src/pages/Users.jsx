import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
const Users = () => {
  const [user, setuser] = useState([]);
  const [loading, setloading] = useState(true);
  const [isAdmin, setisAdmin] = useState(false);
  useEffect(() => {
    const Details = async (e) => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/", {
          withCredentials: true,
        });
        setuser(res.data.message);
      } catch (error) {
        console.log("Not Authorized", error?.response.data || error.message);
      } finally {
        setloading(false);
      }
      const role = localStorage.getItem("role");
      if (role === "Admin") {
        setisAdmin(true);
      } else setisAdmin(false);
    };
    Details();
  }, []);

  // const Admin = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:8000/api/v1/user/");

  //     if (res.data.message.role === "Admin") {
  //       setisAdmin(true);
  //     } else {
  //       setisAdmin(false);
  //     }
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  //   Admin();

  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);
  console.log("Sidebar expanded", isExpanded);

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
          <div className={`${isAdmin ? "flex" : "hidden"}`}>+</div>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md w-[80rem] rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-blue-200 text-gray-800">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">EmpCode</th>
                  <th className="p-3 text-left">Job Role</th>
                  <th className="p-3 text-left">Date of Joining</th>
                  <th className="p-3 text-left">Mobile</th>
                  <th className="p-3 text-left">Reporting Manager</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {user.length > 0 ? (
                  user.map((user, index) => (
                    <tr key={user._id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{user.Email || "N/A"}</td>
                      <td className="p-3">{user.EMP_CODE || "N/A"}</td>
                      <td className="p-3">{user.role || "N/A"}</td>
                      <td className="p-3">{user.DATE_OF_JOINING}</td>
                      <td className="p-3">{user.Mobile_Number || "N/A"}</td>
                      <td className="p-3">{user.reportingManager || "N/A"}</td>
                      <td className="p-3">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
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
