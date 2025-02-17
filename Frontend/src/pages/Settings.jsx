import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getdetail } from "../feature/datafetch/detailfetchSlice.js";
const Settings = () => {
  const detail = useSelector((state) => state.getDetail);
  console.log(detail);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getdetail());
  }, []);

  const roles = [
    { name: "Admin" },
    { name: "User" },
    { name: "HR" },
    { name: "Product Manager" },
  ];
  const [permissions, setPermissions] = useState({
    Admin: {
      manageUser: detail.detail[0].ok.manageUser,
      manageUserAccess: detail.detail[0].ok.manageUserAccess,
    },
    User: {
      manageUser: detail.detail[1].ok.manageUser,
      manageUserAccess: detail.detail[1].ok.manageUserAccess,
    },
    HR: {
      manageUser: detail.detail[2].ok.manageUser,
      manageUserAccess: detail.detail[2].ok.manageUserAccess,
    },
    ProductManager: {
      manageUser: detail.detail[3].ok.manageUser,
      manageUserAccess: detail.detail[3].ok.manageUserAccess,
    },
  });
  const togglePermission = (role, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission],
      },
    }));
  };
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
                  <span className="text-gray-700">Manage User</span>
                  <input
                    type="checkbox"
                    className="toggle-checkbox hidden"
                    checked={permissions[role.name]?.manageUser || false}
                    onChange={() => togglePermission(role.name, "manageUser")}
                  />{" "}
                  <div
                    className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${
                      permissions[role.name]?.manageUser
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {" "}
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                        permissions[role.name]?.manageUser
                          ? "translate-x-6"
                          : ""
                      }`}
                    ></div>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <span className="text-gray-700">Manage User Access</span>
                  <input
                    type="checkbox"
                    className="toggle-checkbox hidden"
                    checked={permissions[role.name]?.manageUserAccess || false}
                    onChange={() =>
                      togglePermission(role.name, "manageUserAccess")
                    }
                  />
                  <div
                    className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${
                      permissions[role.name]?.manageUserAccess
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {" "}
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                        permissions[role.name]?.manageUserAccess
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
