import React, { useEffect, useState } from 'react';
import LoginForm from '../Components/LoginForm';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../Components/components/ui/input-otp.tsx';
import { Button } from '../Components/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  verifyOtp,
  resetOtp,
  resetError,
  resetVerifyOtp,
  resetPasswordField,
  resendOTP,
  resetResendedOtp,
} from '../feature/otpfetch/otpSlice.js';
import { toast, Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../Components/components/ui/input.tsx';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isOtpVerified, setisOtpVerifed] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { otp, verfiedOtp, error, resetedPassword, resendedOtp } = useSelector(
    (state) => state.otpSlice
  );
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const resetFormState = () => {
    dispatch(resetVerifyOtp());
    dispatch(resetOtp());
    setShowOtp(false);
  };

  useEffect(() => {
    resetFormState();
  }, [location.key]);

  useEffect(() => {
    if (otp?.success === true) {
      setShowOtp(true);
      setCanResend(false);
    }
  }, [otp]);

  useEffect(() => {
    if (resendTimer > 0 && showOtp) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [resendTimer, showOtp]);

  useEffect(() => {
    if (verfiedOtp?.success) {
      setisOtpVerifed(true);
    }
  }, [verfiedOtp]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message || error.message || error;
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
      dispatch(resetError());
    }
    if (error === 'Too many OTP requests. Try again later.') {
      setCanResend(true);
      setResendTimer(0);
    }
  }, [error]);

  useEffect(() => {
    if (resetedPassword?.success) {
      toast.success('Password  Reseted Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      dispatch(resetOtp());
      dispatch(resetVerifyOtp());
      dispatch(resetPasswordField());
      dispatch(resetError());
      dispatch(resetResendedOtp());
      navigate('/login');
    }
  }, [resetedPassword]);

  useEffect(() => {
    if (resendedOtp?.success === true) {
      toast.success('OTP Resent Successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    dispatch(resetResendedOtp());
  }, [resendedOtp]);

  const data = {
    email: otp?.message?.email,
    otp: Otp,
  };

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen w-full justify-center items-center">
        <div className="flex flex-col  items-center justify-center h-screen">
          <div className="border border-[#338db5] rounded-xl pt-14 pb-16 p-6">
            <img
              src="./logo.png"
              alt="logo"
              className="w-[213px] h-[50px] mx-auto mb-[30px]"
            />
            <p className="text-[#667085] text-center  font-[Inter,sans-serif]">
              {showOtp && !isOtpVerified
                ? 'Enter OTP received in your Email.'
                : isOtpVerified
                  ? 'Enter new Password'
                  : 'Enter email for Verfication Code'}
            </p>
            {showOtp ? (
              <div className={`${isOtpVerified ? 'hidden' : ''} mt-4`}>
                <div className="flex w-80 justify-center">
                  {isMobile ? (
                    <InputOTP maxLength={4} value={Otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="size-12 border-gray-600"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator className="flex items-center" />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={1}
                          className="size-12 border-gray-600"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator className="flex items-center" />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={2}
                          className="size-12 border-gray-600"
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator className="flex items-center" />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className="size-12 border-gray-600"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  ) : (
                    <Input
                      value={Otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                      className="flex text-center"
                      placeholder="Enter OTP"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-y-4">
                  <Button
                    onClick={() => dispatch(verifyOtp(data))}
                    type="submit"
                    className="w-80 bg-[#338db5] hover:bg-blue-700 mt-[15px] font-[Inter,sans-serif] cursor-pointer"
                  >
                    Verify OTP
                  </Button>
                  {canResend ? (
                    <p className="flex gap-1">
                      Didn't received OTP? Click here to{' '}
                      <div
                        onClick={() => {
                          setCanResend(false);
                          setResendTimer(30);
                          dispatch(resendOTP({ email: data.email }));
                        }}
                        className="text-blue-400 cursor-pointer"
                      >
                        Resend
                      </div>{' '}
                      OTP
                    </p>
                  ) : (
                    <div className="flex justify-center text-md">
                      <p>Resend in {resendTimer}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <LoginForm mode="ForgotPassword" />
            )}
            {isOtpVerified ? (
              <div className="mt-4">
                <LoginForm mode="ResetPassword" />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
