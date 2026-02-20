import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  citizenNumber: string;
  password?: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  SignAccessToken(): string;
  SignRefreshToken(): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Please enter your address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    citizenNumber: {
      type: String,
      required: [true, "Please enter your citizen number"],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);


// Hash password before saving
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  // Hash the password
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Sign Access Token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || "", {
    expiresIn: "5m",
  });
};

// Sign Refresh Token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || "", {
    expiresIn: "3d",
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
