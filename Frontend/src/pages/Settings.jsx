import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccessDetail } from "../feature/datafetch/accessfetchSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.settings);
  const [loading, setLoading] = useState(true); // Add loading state
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchAccessDetail()).then(() => setLoading(false)); // Set loading to false after fetch
    }, 0);
  }, [dispatch]);

  const roles = [
    { name: "Admin" },
    { name: "Developer" },
    { name: "HR" },
    { name: "Product Manager" },
  ];

  useEffect(() => {
    if (loading || !data) return; // Wait for data to load
    setPermissions((prev) => ({
      ...prev,
      Admin: {
        can_add_user:
          data?.data?.message[0]?.result?.access?.user?.can_add_user,
        can_update_user:
          data?.data?.message[0]?.result.access?.user?.can_update_user,
      },
    }));
    console.log("Initialized permissions:", permissions);
  }, [data, loading]);

  const togglePermission = (role, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role]?.[permission],
      },
    }));
  };
  console.log(permissions);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="absolute ml-28 mt-32 w-[80rem] bg-gray-100 p-6 flex  justify-center">
      <div className=" bg-white shadow-lg rounded-lg p-6 w-[70rem] ">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 ">
          Role-Based Permissions
        </h1>
        <div className="space-y-6">
          {roles.map((role) => (
            <div
              key={role.name}
              className="bg-gray-50 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {role.name}
              </h2>
              <div className="flex items-center justify-between">
                {/* Manage User Toggle */}
                <label className="flex items-center space-x-3">
                  <span className="text-gray-700">Can add User</span>
                  <input
                    type="checkbox"
                    className="toggle-checkbox hidden"
                    checked={permissions[role.name]?.can_add_user || false}
                    onChange={() => togglePermission(role.name, "can_add_user")}
                  />{" "}
                  <div
                    className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${
                      permissions[role.name]?.can_add_user
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {" "}
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                        permissions[role.name]?.can_add_user
                          ? "translate-x-6"
                          : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
