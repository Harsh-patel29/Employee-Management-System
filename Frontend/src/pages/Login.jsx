import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../Components/ThemeToggle.jsx";
import { loginUser } from "../feature/datafetch/datafetchSlice.js";
import { useNavigate } from "react-router";
import LoginForm from "../Components/LoginForm.jsx";
import { Flex } from "@mantine/core";

const Login = () => {
  // const [Email, setEmail] = useState("");
  // const [Password, setPassword] = useState("");

  const theme = useSelector((state) => state.theme.theme);
  const value = localStorage.getItem("theme");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div
      className={`${value === "light" ? "bg-white" : "bg-gray-900"} 
      ${value === "light" ? "text-gray-900" : "text-white"}
       flex items-center w-full h-[100vh]  flex-col`}
    >
      <div className="p-6">
        <ThemeToggle />
      </div>
      <div>
        <h1 className="text-2xl font-semibold m-0">
          {loading ? "Loading..." : "Login"}
        </h1>
      </div>

      <div className="border border-[#338db5] rounded-xl flex xl:mt-10 lg:mt-8 md:mt-12 justify-center xl:w-[25%] xl:h-[28rem] lg:w-[30%] lg:h-[25rem] md:w-[40%] md:h-[25rem] sm:w-[50%] sm:h-[25rem] sm:mt-10  max-w-[380px]">
        <div>
          <img
            src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
            alt="logo"
            className="flex xl:w-full xl:p-6 xl:pb-0 xl:min-h-[18%] xl:ml-0 lg:w-[80%] lg:h-[18%] lg:p-2 lg:ml-7 lg:pb-0 md:w-[80%] h-[22%] md:p-4 md:ml-7 sm:p-2 sm:w-[70%] sm:h-[20%] sm:ml-12"
          />
          <p className="text-[#667085] text-center xl:pt-6">
            Welcome back!! Please enter your details
          </p>
          <div>
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
