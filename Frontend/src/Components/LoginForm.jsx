import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Components/components/ui/button';
import { Input } from '../Components/components/ui/input';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '../Components/components/ui/form';
import { useDispatch, useSelector } from 'react-redux';
import {
  generateOtp,
  resetError,
  resetOtp,
  resetPassword,
  resetPasswordField,
  resetVerifyOtp,
} from '../feature/otpfetch/otpSlice.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Bounce } from 'react-toastify';
import Loader from '../Components/Loader.jsx';

const formSchema = (mode) => {
  let schemaFields = {};

  if (mode !== 'ResetPassword') {
    schemaFields.Email = z
      .string()
      .email({ message: 'Please enter correct Email' });
  }

  if (mode !== 'ForgotPassword') {
    schemaFields.Password = z
      .string()
      .min(6, { message: 'Password must be 6 characters' });
  }
  if (mode === 'ResetPassword') {
    schemaFields.ChechkPassword = z.string({
      message: 'Password confirm your Password',
    });
  }

  let schema = z.object(schemaFields);

  if (mode === 'ResetPassword') {
    schema = schema.refine((data) => data.Password === data.ChechkPassword, {
      message: 'Passwords do not match',
      path: ['ChechkPassword'],
    });
  }
  return schema;
};

export default function LoginForm({ onSubmit, mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const { otp, Loading, resetedPassword, error } = useSelector(
    (state) => state.otpSlice
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema(mode)),
    defaultValues: {
      Email: '',
      Password: '',
      ChechkPassword: '',
    },
  });

  const GenerateOtp = (data) => {
    const normalizedData = { email: data?.Email?.toLowerCase() };
    dispatch(generateOtp(normalizedData));
    dispatch(resetOtp());
  };

  const resetPasswordData = (data) => {
    const ApiData = { email: otp?.message?.email, newPassword: data.Password };
    dispatch(resetPassword(ApiData));
    dispatch(resetPasswordField());
  };

  return (
    <Form {...control}>
      <form
        onSubmit={
          mode === 'ForgotPassword'
            ? handleSubmit(GenerateOtp)
            : mode === 'Login'
              ? handleSubmit(onSubmit)
              : handleSubmit(resetPasswordData)
        }
        className="flex flex-col items-center gap-6"
      >
        {mode !== 'ResetPassword' && (
          <FormField
            control={control}
            name="Email"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel className="font-[Inter,sans-serif] text-[#344054] w-100">
                  Email:
                </FormLabel>

                <FormControl>
                  <Input
                    className="w-80 p-[6px] rounded-sm"
                    type="email"
                    placeholder="Enter Your Email"
                    {...field}
                  />
                </FormControl>
                <div>
                  {errors?.Email && <span>{errors.Email.message}</span>}
                </div>
              </FormItem>
            )}
          />
        )}
        {mode !== 'ForgotPassword' && (
          <FormField
            control={control}
            name="Password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-[Inter,sans-serif] text-[#344054] w-100">
                  Password:
                </FormLabel>

                <FormControl>
                  <Input
                    className="w-80 p-[6px] rounded-sm"
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
                <div>
                  {errors?.Password && <span>{errors.Password.message}</span>}
                </div>
              </FormItem>
            )}
          />
        )}
        {mode === 'ResetPassword' && (
          <FormField
            control={control}
            name="ChechkPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-[Inter,sans-serif] text-[#344054] w-100">
                  Confirm Passwords:
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-80 p-[6px] rounded-sm"
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
                <div>
                  {errors?.ChechkPassword && (
                    <span>{errors.ChechkPassword.message}</span>
                  )}
                </div>
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          className="w-80 bg-[#338db5] hover:bg-blue-700 mt-[15px] font-[Inter,sans-serif] cursor-pointer"
        >
          {mode === 'ForgotPassword'
            ? Loading
              ? 'Sending OTP to Email...'
              : 'Generate OTP'
            : mode === 'Login'
              ? loading
                ? 'Signing IN...'
                : 'Sign In'
              : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
}
