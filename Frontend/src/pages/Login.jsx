import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../Components/ThemeToggle.jsx";
import { loginUser } from "../feature/datafetch/datafetchSlice.js";
import { useNavigate } from "react-router";
import LoginForm from "../Components/LoginForm.jsx";
import { getLoginDetail } from "../feature/datafetch/datafetchSlice.js";

const Login = () => {
  console.log("Login");
  const theme = useSelector((state) => state.theme.theme);
  const value = localStorage.getItem("theme") || theme || "light";

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
      className={`min-h-screen w-full flex flex-col items-center justify-center
      ${value === "light" ? "bg-white text-gray-900" : "bg-[#121212] text-white"}`}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          {loading ? "Loading..." : "Login"}
        </h1>
      </div>

      <div className="border border-[#338db5] rounded-xl flex flex-col items-center p-6 w-full max-w-[380px] mx-4">
        <div className="w-full">
          <img
            src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
            alt="logo"
            className="w-48 mx-auto mb-4"
          />
          <p className="text-[#667085] text-center mb-6">
            Welcome back!! Please enter your details
          </p>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Login;
