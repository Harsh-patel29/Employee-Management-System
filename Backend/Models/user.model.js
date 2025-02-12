import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
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
      type: Number,
      required: true,
    },
    Gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      default: "MALE",
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
      ref: "Role",
      required: true,
    },
    roleid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcryptjs.hash(this.Password, 10);
  next();
});

userSchema.statics.generateEMPCode = async function () {
  const lastEmployee = await this.findOne({}, { EMP_CODE: 1 })
    .sort({
      EMP_CODE: -1,
    })
    .limit(1);
  if (!lastEmployee) {
    return "EMP001";
  }

  const lastNumber = parseInt(lastEmployee.EMP_CODE.slice(3));
  const nextNumber = lastNumber + 1;
  return `EMP${nextNumber.toString().padStart(3, "0")}`;
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.Password);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      Email: this.Email,
      EMP_CODE: this.EMP_CODE,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
