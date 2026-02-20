require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import {
  sendToken,
  accessTokenOptions,
  refreshTokenOptions,
} from "../utils/jwt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

// Interface for Registration Body
interface IRegistrationBody {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
  citizenNumber: string;
  password: string;
}

// 1. Register User (Send OTP)
export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        citizenNumber,
        password,
        confirmPassword,
      } = req.body;

      if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
      }

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const isCitizenExist = await userModel.findOne({ citizenNumber });
      if (isCitizenExist) {
        return next(new ErrorHandler("Citizen number already exists", 400));
      }

      const user: IRegistrationBody = {
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        citizenNumber,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = {
        user: { name: `${firstName} ${lastName}` },
        activationCode,
      };

      await sendMail({
        email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${email} to activate your account.`,
        activationToken: activationToken.token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// Helper: Create Activation Token
interface IActivationToken {
  token: string;
  activationCode: string;
}

const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    },
  );

  return { token, activationCode };
};

// 2. Activate User
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const {
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        citizenNumber,
        password,
      } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user = await userModel.create({
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
        citizenNumber,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 3. Login User
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 4. Logout User
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Just clear cookies (No Redis)
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 5. Update Access Token (Refresh)
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Could not refresh token", 400));
      }

      // Since we removed Redis, we fetch user from DB to validte they still exist
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: "5m",
        },
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
          expiresIn: "3d",
        },
      );

      req.user = user; // Attach user to request

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 6. Get User Info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 7. Update User Info
interface IUpdateUserInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName } = req.body;

      const user = await userModel.findById(req.user?._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      if (firstName !== undefined) {
        user.firstName = firstName;
      }

      if (lastName !== undefined) {
        user.lastName = lastName;
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 8. Update User Password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(
          new ErrorHandler("Please provide old and new password", 400),
        );
      }

      const user = (await userModel
        .findById(req.user?._id)
        .select("+password")) as IUser | null;

      if (!user || !user.password) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 9. Update Profile Picture
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      // Directly save the Base64 string to the database
      if (avatar !== undefined) {
        user.avatar = avatar;
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// 10. Forgot Password
export const forgotPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetPasswordToken = resetCode;
      user.resetPasswordExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      await user.save();

      const data = {
        user: { name: `${user.firstName} ${user.lastName}` },
        resetCode,
      };

      try {
        await sendMail({
          email: user.email,
          subject: "Reset Your Password",
          template: "reset-password-mail.ejs",
          data,
        });
        res.status(200).json({
          success: true,
          message: `Reset code sent to ${user.email}.`,
        });
      } catch (error: any) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// 11. Reset Password
export const resetPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resetCode, newPassword } = req.body;

      // Find user with this token and check if token is not expired
      const user = await userModel.findOne({
        resetPasswordToken: resetCode,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return next(new ErrorHandler("Invalid or expired reset code", 400));
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password reset successfully. You can now log in.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// 12. Delete User Account
export const deleteUserAccount = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      const user = await userModel.findById(userId);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      await user.deleteOne();

      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

