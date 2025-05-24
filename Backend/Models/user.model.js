import mongoose, { Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({
  path: './.env',
});
const userSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Date_of_Birth: {
      type: String,
      required: true,
    },
    Mobile_Number: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      enum: ['MALE', 'FEMALE'],
      default: 'MALE',
    },
    EMP_CODE: {
      type: String,
    },
    DATE_OF_JOINING: {
      type: String,
    },
    Designation: {
      type: String,
    },
    WeekOff: {
      type: String,
    },
    role: {
      type: Schema.Types.String,
      ref: 'Role',
      required: true,
    },
    roleid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    access_keys: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserAccess',
    },
    ReportingManager: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    remeberMe: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('Password')) return next();
  this.Password = await bcryptjs.hash(this.Password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.Password);
};

userSchema.statics.generateEMPCode = async function () {
  const lastEmployee = await this.findOne({}, { EMP_CODE: 1 })
    .sort({
      EMP_CODE: -1,
    })
    .limit(1);
  if (!lastEmployee) {
    return 'EMP001';
  }

  const lastNumber = parseInt(lastEmployee.EMP_CODE.slice(3));
  const nextNumber = lastNumber + 1;
  return `EMP${nextNumber.toString().padStart(3, '0')}`;
};

userSchema.methods.generateAccessToken = function (RemeberMe = false) {
  const expiresIn = RemeberMe ? '7d' : '1d';
  return jwt.sign(
    {
      _id: this._id,
      Email: this.Email,
      EMP_CODE: this.EMP_CODE,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn }
  );
};

userSchema.methods.generateRefreshToken = function (RemeberMe = false) {
  const expiresIn = RemeberMe ? '30d' : '15d';
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn }
  );
};

export const User = mongoose.model('User', userSchema);
