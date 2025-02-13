import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import ThemeToggle from "../Components/ThemeToggle.jsx";
const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  const theme = useSelector((state) => state.theme.theme);
  const value = localStorage.getItem("theme");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        {
          Email,
          Password,
        },
        { withCredentials: true }
      );
      localStorage.setItem("role", res.data.message.role);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error in logging user", error);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return (
    <div
      className={`${value === "light" ? "bg-white" : "bg-gray-900"} 
      ${value === "light" ? "text-gray-900" : "text-white"}
      h-[100vh] flex flex-col items-center justify-around`}
    >
      <ThemeToggle />
      <div>
        <h1 className="text-2xl font-semibold">
          {loading ? "Loading..." : "Login"}
        </h1>
      </div>
      <div className="border border-blue-300 rounded-2xl w-[25%] h-[70%] flex justify-center ">
        <div>
          <img
            src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
            alt=""
            className="xl:w-[318px] h-[74px] mt-4 xl:ml-4 sm:w-[250px] "
          />
          <h3 className="p-6 font-light text-lg  ">
            Welcome back! Please enter your details.
          </h3>
          <div className="flex flex-col items-start">
            <label htmlFor="Email" className=" ">
              Email:
            </label>
            <input
              type="text"
              placeholder="Enter your Email"
              className="ml-2 border rounded w-[90%] mt-2 p-1 "
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col items-start h-[20%] xl:pt-10 sm:pt-0">
            <label htmlFor="Password" className=" ">
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="ml-2 border rounded w-[90%] mt-2 p-1 "
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-center w-[100%] mt-20 ">
              <button
                type="submit"
                onClick={handleSubmit}
                className="h-10 items-center bg-blue-500 w-[80%] rounded-xl hover:bg-blue-800 cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
