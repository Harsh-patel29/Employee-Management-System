import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "../Components/ThemeToggle.jsx";
import { loginUser } from "../feature/datafetch/datafetchSlice.js";
import { useNavigate } from "react-router";
import LoginForm from "../Components/LoginForm.jsx";

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
      h-[100vh] flex flex-col items-center justify-around`}
    >
      <ThemeToggle />
      <div>
        <h1 className="text-2xl font-semibold">
          {loading ? "Loading..." : "Login"}
        </h1>
      </div>
      <div className="border rounded-2xl w-[25%] h-[70%] flex justify-center ">
        <div>
          <img
            src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
            alt=""
            className="xl:w-[318px] h-[74px] mt-4 xl:ml-4 sm:w-[250px] "
          />
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Login;
