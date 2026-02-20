import { Request, Response, NextFunction } from "express";
import IssueModel from "../models/issue.modal";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

export const getDashboardStats = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Total issues
      const totalIssues = await IssueModel.countDocuments();

      // Issues by priority
      const issuesByPriority = await IssueModel.aggregate([
        {
          $group: {
            _id: "$priorityLevel",
            count: { $sum: 1 },
          },
        },
      ]);

      // Issues by department
      const issuesByDepartment = await IssueModel.aggregate([
        {
          $group: {
            _id: "$department",
            count: { $sum: 1 },
          },
        },
      ]);

      // Pending vs Resolved
      const pending = await IssueModel.countDocuments({
        status: { $nin: ["Resolved", "Closed"] },
      });

      const resolved = await IssueModel.countDocuments({
        status: { $in: ["Resolved", "Closed"] },
      });

      // SLA Compliance %
      const totalResolved = await IssueModel.countDocuments({
        status: { $in: ["Resolved", "Closed"] },
      });

      const resolvedWithinSLA = await IssueModel.countDocuments({
        status: { $in: ["Resolved", "Closed"] },
        isOverdue: false,
      });

      const slaCompliance =
        totalResolved === 0
          ? 0
          : Number(((resolvedWithinSLA / totalResolved) * 100).toFixed(2));

      res.status(200).json({
        success: true,
        data: {
          totalIssues,
          issuesByPriority,
          issuesByDepartment,
          pending,
          resolved,
          slaCompliance,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);
