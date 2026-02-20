require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import IssueModel from "../models/issue.modal";
import NotificationModel from "../models/notification.modal";

// 1. View All User --- Admin Only
export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response) => {
    const { search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let filter: any = {};

    if (search) {
      filter = {
        $or: [
          { citizenNumber: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await userModel.countDocuments(filter);

    const users = await userModel
      .find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  },
);

// Get single user --- Admin Only
export const getSingleUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { citizen } = req.query;

    let user;

    if (citizen) {
      user = await userModel
        .findOne({ citizenNumber: citizen })
        .select("-password");
    } else {
      user = await userModel.findById(req.params.id).select("-password");
    }

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  },
);

// 3. Update user role --- Admin Only
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;

    const user = await userModel.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  },
);

// 4. Delete user --- Admin Only
export const deleteUserByAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  },
);

export const getAdminStats = CatchAsyncError(
  async (req: Request, res: Response) => {
    const totalUsers = await userModel.countDocuments();
    const totalIssues = await IssueModel.countDocuments();

    const statusCounts = await IssueModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedStatus: Record<string, number> = {
      Submitted: 0,
      Assigned: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0,
    };

    statusCounts.forEach((item) => {
      formattedStatus[item._id] = item.count;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsers = await userModel.countDocuments({
      createdAt: { $gte: today },
    });

    const todayIssues = await IssueModel.countDocuments({
      createdAt: { $gte: today },
    });

    const overdueIssues = await IssueModel.countDocuments({
      isOverdue: true,
    });

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlyUsers = await userModel.aggregate([
      { $match: { createdAt: { $gte: oneYearAgo } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const monthlyIssues = await IssueModel.aggregate([
      { $match: { createdAt: { $gte: oneYearAgo } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const recentNotifications = await NotificationModel.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalUsers,
      totalIssues,
      issueStatus: formattedStatus,
      todayUsers,
      todayIssues,
      overdueIssues,
      recentNotifications,
      monthlyUsers,
      monthlyIssues,
    });
  },
);
