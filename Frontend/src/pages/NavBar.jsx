import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FiPlus } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { GiSettingsKnobs } from "react-icons/gi";
import { BsClock } from "react-icons/bs";
import { CiCircleInfo } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import ThemeToggle from "../Components/ThemeToggle.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Components/components/ui/dropdown.tsx";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const handlelogout = async () => {
    const res = await axios.post(
      "http://localhost:8000/api/v1/user/logout",
      {},
      { withCredentials: true }
    );
    if (res.data.statusCode === 200) {
      navigate("/login");
    }
  };

  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <p>Loading...</p>;
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
        <div className=" flex flex-row border h-8 w-auto border-black pr-[0.5rem] rounded-2xl bg-[#64B2D559]">
          <div
            className={`${
              value === "light" ? "text-black" : "text-white"
            } flex space-x-2.5 items-center `}
          >
            <FaUser size={26} className="ml-2" />
            <h1 className="text-sm">
              {user?.user?.Name ? <p>{user.user.Name}</p> : <p>Loading...</p>}
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src="https://www.svgrepo.com/show/80156/down-arrow.svg"
                  className="h-6 w-3"
                  alt=""
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CgProfile />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GiSettingsKnobs />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BsClock />
                  Last Viewed
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CiCircleInfo />
                  About
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlelogout}>
                  <IoExitOutline />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
