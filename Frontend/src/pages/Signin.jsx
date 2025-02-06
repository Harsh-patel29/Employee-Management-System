import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/",
        { username, email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/login");
    } catch (error) {
      console.log("Error in logging user", error);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      <div className="h-[100vh] flex flex-col items-center justify-around">
        <div>
          <h1 className="text-2xl font-semibold">
            {loading ? "Loading..." : "SignIn"}
          </h1>
        </div>
        <div className="border border-blue-300 rounded-2xl w-[25%] h-[80%] flex justify-center ">
          <div>
            <img
              src="https://ems.jiyantech.com/assets/imgs/theme/logo.png"
              alt=""
              className="xl:w-[318px] h-[74px] mt-4 xl:ml-4 sm:w-[250px] "
            />
            <h3 className="p-6 font-light text-lg  text-gray-700">
              Please enter your details.
            </h3>
            <div className="flex flex-col items-start">
              <label htmlFor="Username" className=" ">
                Username:
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                className="ml-2 border rounded w-[90%] mt-2 p-1 "
                onChange={(e) => setusername(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col items-start xl:pt-10 sm:pt-0">
              <label htmlFor="Email" className=" ">
                Email:
              </label>
              <input
                type="text"
                placeholder="Enter your Email"
                className="ml-2 border rounded w-[90%] mt-2 p-1 "
                onChange={(e) => setemail(e.target.value)}
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
                onChange={(e) => setpassword(e.target.value)}
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
    </>
  );
};

export default Login;
