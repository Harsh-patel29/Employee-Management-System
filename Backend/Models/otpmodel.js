import mongoose, { Schema } from 'mongoose';

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  resendCount: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  isVerfied: { type: Boolean, default: false },
  isExpired: { type: Boolean, default: false },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = mongoose.model('OTP', otpSchema);
