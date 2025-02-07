import React from "react";
import { Link } from "react-router";
import { FiPlus } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import ThemeToggle from "../Components/ThemeToggle.jsx";
const NavBar = () => {
  const value = localStorage.getItem("theme");
  return (
    <div
      style={{ top: 0 }}
      className={` ${
        value === "light" ? "bg-white " : "bg-black"
      }w-[100%]  flex flex-row  text-white h-20 border  ${
        value === "light" ? "border-white" : "border-black"
      } shadow `}
    >
      <Link to="/">
        <img
          src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
          className="h-20 w-60 p-5 ml-2 flex items-center"
        />
      </Link>
      <div
        className={`flex items-center w-[100%] justify-end mr-10 space-x-11 `}
      >
        <ThemeToggle />
        <div className={`${value === "light" ? "text-black" : "text-white"}`}>
          <FiPlus size={26} style={{ fontWeight: "bold" }} />
        </div>
        <div className={`${value === "light" ? "text-black" : "text-white"}`}>
          <IoMdNotificationsOutline size={26} />
        </div>
        <div className={`${value === "light" ? "text-black" : "text-white"}`}>
          <FaUser size={26} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
