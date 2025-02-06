import React from "react";
import { Link } from "react-router";
import { FiPlus } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
const NavBar = () => {
  return (
    <div
      style={{ top: 0 }}
      className="w-[100%] bg-black flex flex-row  text-white h-20 border border-black/90 shadow-white "
    >
      <Link to="/">
        <img
          src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
          className="h-20 w-60 p-5 ml-2 flex items-center"
        />
      </Link>
      <div className="flex items-center w-[100%] justify-end mr-10 space-x-11">
        <FiPlus size={26} style={{ fontWeight: "bold" }} />
        <div>
          <IoMdNotificationsOutline size={26} />
        </div>
        <div>
          <FaUser size={26} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
