import express from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
  forgotPassword,
  resetPassword,
  deleteUserAccount,
} from "../controllers/user.controller";
import {  isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

// User Routes
userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put("/update-avatar", isAuthenticated, updateProfilePicture);
userRouter.post("/forgot-password", forgotPassword);
userRouter.put("/reset-password", resetPassword);
userRouter.delete("/delete-me", isAuthenticated, deleteUserAccount);



export default userRouter;
