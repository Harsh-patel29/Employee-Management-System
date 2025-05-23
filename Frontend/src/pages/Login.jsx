import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../feature/datafetch/datafetchSlice.js';
import { useNavigate } from 'react-router';
import LoginForm from '../Components/LoginForm.jsx';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetError } from '../feature/datafetch/datafetchSlice.js';
import Loader from '../Components/Loader.jsx';
import { Link } from 'react-router';
import { resetOtp, resetVerifyOtp } from '../feature/otpfetch/otpSlice.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = async (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const resetFormState = () => {
    dispatch(resetVerifyOtp());
    dispatch(resetOtp());
  };

  useEffect(() => {
    resetFormState();
  }, [location.key]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(resetError());
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f4f4]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-gray-900 ">
        <div className="border border-[#338db5] rounded-xl flex flex-col items-center p-6 w-full max-w-[380px] mx-4">
          <div className="w-full">
            <img
              src="./logo.png"
              alt="logo"
              className="w-[213px] h-[50px] mx-auto mb-[30px]"
            />
            <p className="text-[#667085] text-center  font-[Inter,sans-serif]">
              Welcome back!! Please enter your details.
            </p>
            <LoginForm onSubmit={handleSubmit} mode="Login" />
            <h5 className="flex justify-end px-2 mt-2 cursor-pointer">
              <Link to="/forgotPassword" className="text-[rgb(44,102,132)]">
                Forgot Password
              </Link>
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
