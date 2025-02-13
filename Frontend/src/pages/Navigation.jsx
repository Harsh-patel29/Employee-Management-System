import React, { use, useState } from "react";
import { Link } from "react-router";
import { MdDashboard } from "react-icons/md";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { CgTime } from "react-icons/cg";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdKeyboardCommandKey } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import {
  collapedSideBar,
  expandSideBar,
} from "../feature/ToggelSideBar/ToggleSideBarSlice";
const Navigation = () => {
  const [dropdown, setdropdown] = useState(false);
  // const [sidebar, setsidebar] = useState(false);/

  const toggeldropdown = () => {
    setdropdown(!dropdown);
  };

  const dispatch = useDispatch();
  const isExpanded = useSelector((state) => state.Sidebar.isExpanded);

  const value = localStorage.getItem("theme");

  return (
    <div
      style={{ zIndex: 999 }}
      className={`${isExpanded ? "flex" : "hidden"} ${
        value === "light" ? "bg-white" : "bg-gray-900"
      }
      ${value === "light" ? "border-white" : "border-black"}
      xl:flex lg:flex md:hidden[] sm:hidden flex border-b border-r shadow-2xl flex-col justify-between p-4 w-[4%] hover:w-[15%]  rounded-r-md`}
      id="navigation-container"
      onMouseEnter={() => dispatch(expandSideBar())}
      onMouseLeave={() => dispatch(collapedSideBar())}
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/dashboard"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <MdDashboard size={26} className="mr-2 mt-[3rem]" />
          <span
            className={`${
              value === "light" ? "text-black" : "text-white"
            }hidden nav-item-name  mt-[3rem]`}
          >
            DashBoard
          </span>
        </Link>
        <Link
          to="/productivity"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <HiMiniSquares2X2 size={26} className="mr-2 mt-[3rem]" />
          <span
            className={`${
              value === "light" ? "text-black" : "text-white"
            }hidden nav-item-name  mt-[3rem]`}
          >
            Productivity
          </span>
        </Link>
        <Link
          to="/attendance"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <CgTime size={26} className="mr-2 mt-[3rem]" />
          <span
            className={`
              ${value === "light" ? "text-black" : "text-white"}
              hidden nav-item-name  mt-[3rem]`}
          >
            Attendance
          </span>
        </Link>
        <Link
          to="/leave"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <MdOutlineCalendarMonth size={26} className="mr-2 mt-[3rem]" />
          <span
            className={`
              ${value === "light" ? "text-black" : "text-white"}
              hidden nav-item-name  mt-[3rem]`}
          >
            Leave
          </span>
        </Link>
        <Link
          to="/master"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <MdKeyboardCommandKey size={26} className="mr-2 mt-[3rem]" />
          <span
            className={`
              ${value === "light" ? "text-black" : "text-white"}
              hidden nav-item-name  mt-[3rem]`}
          >
            Master
          </span>
        </Link>
        <Link
          to="/users"
          className={`
            ${value === "light" ? "text-black" : "text-white"}
            flex items-center transition-transform transform hover:translate-x-2`}
        >
          <LuUsers size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name  mt-[3rem]">Users</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <IoSettingsOutline size={26} className="mr-2 mt-[3rem]" />
          <span
            className={`
              ${value === "light" ? "text-black" : "text-white"}
              hidden nav-item-name  mt-[3rem]`}
          >
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
