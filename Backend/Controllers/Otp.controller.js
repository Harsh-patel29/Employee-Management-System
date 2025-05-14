import { OTPModel } from '../Models/otpmodel.js';
import { User } from '../Models/user.model.js';
import { SMTP } from '../Models/smtp.model.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import { ApiError } from '../Utils/ApiError.js';
import { ApiResponse } from '../Utils/ApiResponse.js';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

const sendOTPtoMail = async (email, otp) => {
  const SMTPData = await SMTP.find({});
  const data = SMTPData[0];
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: data.User_Email,
      pass: process.env.APP_PASSWORD,
    },
  });
  const mailOptions = {
    from: `${data.From_Name} <${data.User_Email}>`,
    to: email,
    subject: 'OTP Code to resetPassword',
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 2 minutes.</p>`,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('OTP sent: %s', info.messageId);
};

const sendOtp = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ Email: email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await OTPModel.updateMany(
    { email, isExpired: false },
    { $set: { isExpired: true } }
  );
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 2 * 60 * 1000;

  const createdOTP = await OTPModel.create({
    email,
    otp,
    expiresAt,
    isVerfied: false,
  });

  try {
    sendOTPtoMail(email, otp)
      .then(() => console.log('Email sent successfully'))
      .catch((emailError) => console.error('Error sending Email:', emailError));
    return res
      .status(201)
      .json(new ApiResponse(201, createdOTP, 'OTP Sent Successfully'));
  } catch (emailError) {
    console.error('Error sending Email:', emailError);
  }
});

const verifyOtp = AsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTPModel.findOne({
    email,
    otp,
    isVerfied: false,
    isExpired: false,
  });
  if (!record) throw new ApiError(400, 'Invalid OTP');
  if (Date.now() > record.expiresAt) {
    await OTPModel.findOneAndUpdate(
      { otp: otp },
      { isExpired: true, isVerfied: false }
    );
    throw new ApiError(
      400,
      'OTP TimedOut. Click on resend OTP to receive new OTP'
    );
  }
  await OTPModel.findOneAndUpdate({ otp: otp }, { isVerfied: true });
  return res.status(200).json(new ApiResponse(200, '', 'OTP verified'));
});

const resendOtp = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  const MAX_RESENDS = 2;

  const user = await User.findOne({ Email: email });
  if (!user) throw new ApiError(404, 'User not found');

  const otpEntry = await OTPModel.findOne({
    email,
    isVerfied: false,
    isExpired: false,
  });
  const now = Date.now();

  if (otpEntry) {
    const isExpired = now > new Date(otpEntry.expiresAt).getTime();
    console.log('old OTP sent');

    if (otpEntry.resendCount >= MAX_RESENDS) {
      throw new ApiError(429, 'Too many OTP requests. Try again later.');
    }

    let otpToSend = otpEntry.otp;

    if (isExpired) {
      otpToSend = Math.floor(1000 + Math.random() * 9000).toString();
      otpEntry.otp = otpToSend;
      otpEntry.expiresAt = now + 2 * 60 * 1000;
    }

    otpEntry.resendCount += 1;
    otpEntry.lastSentAt = now;
    await otpEntry.save();

    sendOTPtoMail(email, otpToSend)
      .then(() => {
        console.log('Email sent successfully');
      })
      .catch((EmailError) => console.error('Error sending Email', EmailError));
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'OTP Resent Successfully'));
  }
  console.log('new OTP Sent');

  const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = now + 2 * 60 * 1000;

  const created = await OTPModel.create({
    email,
    otp: newOtp,
    expiresAt,
    resendCount: 1,
    lastSentAt: now,
  });

  sendOTPtoMail(email, newOtp)
    .then(() => {
      console.log('Email sent successfully');
    })
    .catch((EmailError) => console.error('Error sending Email', EmailError));
  return res
    .status(200)
    .json(new ApiResponse(200, created, 'OTP Sent Successfully'));
});

const resetPassword = AsyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const hash = await bcryptjs.hash(newPassword, 10);
  await User.updateOne({ Email: email }, { Password: hash });
  return res
    .status(200)
    .json(new ApiResponse(200, '', 'Passoword reseted Successfully'));
});

export { sendOtp, verifyOtp, resetPassword, resendOtp };
