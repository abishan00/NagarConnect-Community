import { Request, Response, NextFunction } from "express";
import IssueModel from "../models/issue.modal";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { calculatePriority } from "../utils/priorityEngine";
import { assignDepartment } from "../utils/departmentRouter";
import AuditModel from "../models/audit.modal";
import userModel from "../models/user.model";
import { sendNotification } from "../utils/notificationSender";
import sendMail from "../utils/sendMail";
import { getIO } from "../socketServer";

/* ============================= */
/* SLA Calculation               */
/* ============================= */

const calculateSLA = (priority: string) => {
  const now = new Date();

  if (priority === "High") now.setHours(now.getHours() + 24);
  else if (priority === "Medium") now.setHours(now.getHours() + 48);
  else now.setHours(now.getHours() + 72);

  return now;
};

/* ============================= */
/* CREATE ISSUE                 */
/* ============================= */
export const createIssue = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, category, urgency, severity, publicImpact } =
      req.body;

    if (!req.user?._id) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    const { score, level } = calculatePriority(
      urgency,
      severity,
      publicImpact,
      new Date(),
    );

    const slaDeadline = calculateSLA(level);
    const department = assignDepartment(category);

    // 🛑 Create issue only after validation
    const issue = new IssueModel({
      title,
      description,
      category,
      urgency,
      severity,
      publicImpact,
      priorityScore: score,
      priorityLevel: level,
      slaDeadline,
      department,
      createdBy: req.user._id,
      citizen: req.user._id,
    });

    await issue.save();

    const admins = await userModel.find({ role: "admin" });

    for (const admin of admins) {
      await sendNotification({
        recipientId: admin._id.toString(),
        recipientEmail: admin.email,
        recipientName: admin.firstName,
        title: "New Issue Created",
        message: `New issue "${issue.title}" submitted.`,
        issueId: issue._id.toString(),
        issueTitle: issue.title,
        category: issue.category,
        status: issue.status,
        priority: issue.priorityLevel,
      });
    }

    await AuditModel.create({
      issue: issue._id,
      action: "ISSUE_CREATED",
      newValue: issue.toObject(),
      performedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      issue,
    });
  },
);


/* ============================= */
/* UPDATE ISSUE                 */
/* ============================= */

export const updateIssue = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const issue = await IssueModel.findById(req.params.id);

    if (!issue) {
      return next(new ErrorHandler("Issue not found", 404));
    }

    const oldStatus = issue.status;
    const oldData = issue.toObject();

    const {
      urgency,
      severity,
      publicImpact,
      status,
      category,
      title,
      description,
    } = req.body;

    if (urgency !== undefined) issue.urgency = urgency;
    if (severity !== undefined) issue.severity = severity;
    if (publicImpact !== undefined) issue.publicImpact = publicImpact;
    if (status !== undefined) issue.status = status;

    if (category !== undefined) {
      issue.category = category;
      issue.department = assignDepartment(category);
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;

    const { score, level } = calculatePriority(
      issue.urgency,
      issue.severity,
      issue.publicImpact,
      issue.createdAt,
    );

    issue.priorityScore = score;
    issue.priorityLevel = level;

    await issue.save();

    if (status && status !== oldStatus) {
      const citizen = await userModel.findById(issue.citizen);

      if (citizen) {
        await sendNotification({
          recipientId: citizen._id.toString(),
          recipientEmail: citizen.email,
          recipientName: citizen.firstName,
          title: "Issue Status Updated",
          message: `Your issue "${issue.title}" is now ${status}`,
          issueId: issue._id.toString(),
          issueTitle: issue.title,
          category: issue.category,
          status: issue.status,
          priority: issue.priorityLevel,
        });
      }
    }

    await AuditModel.create({
      issue: issue._id,
      action: "ISSUE_UPDATED",
      previousValue: oldData,
      newValue: issue.toObject(),
      performedBy: req.user?._id,
    });

    res.status(200).json({
      success: true,
      issue,
    });
  },
);


/* ============================= */
/* DELETE ISSUE                 */
/* ============================= */

export const deleteIssue = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const issue = await IssueModel.findById(req.params.id);

    if (!issue) {
      return next(new ErrorHandler("Issue not found", 404));
    }

    if (
      req.user?.role === "citizen" &&
      issue.citizen.toString() !== req.user._id.toString()
    ) {
      return next(new ErrorHandler("Not authorized", 403));
    }

    await issue.deleteOne();

    await AuditModel.create({
      issue: issue._id,
      action: "ISSUE_DELETED",
      previousValue: issue.toObject(),
      performedBy: req.user?._id,
    });

    res.status(200).json({
      success: true,
      message: "Issue deleted",
    });
  },
);

/* ============================= */
/* GET AUDIT LOGS               */
/* ============================= */

export const getIssueAuditLogs = CatchAsyncError(
  async (req: Request, res: Response) => {
    const logs = await AuditModel.find({ issue: req.params.id })
      .populate("performedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      logs,
    });
  },
);

export const checkAndMarkOverdue = async () => {
  const now = new Date();

  const overdueIssues = await IssueModel.find({
    status: { $nin: ["Resolved", "Closed"] },
    slaDeadline: { $lt: now },
    isOverdue: false,
  });

  const admins = await userModel.find({ role: "admin" });

  for (const issue of overdueIssues) {
    issue.isOverdue = true;
    await issue.save();

    for (const admin of admins) {
      await sendNotification({
        recipientId: admin._id.toString(),
        recipientEmail: admin.email,
        recipientName: admin.firstName,
        title: "Issue Overdue",
        message: `Issue "${issue.title}" is overdue.`,
        issueId: issue._id.toString(),
        issueTitle: issue.title,
        category: issue.category,
        status: issue.status,
        priority: issue.priorityLevel,
      });
    }
  }
};
