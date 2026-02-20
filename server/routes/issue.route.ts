import express from "express";
import { isAuthenticated } from "../middleware/auth";
import IssueModel from "../models/issue.modal";
import {
  createIssue,
  updateIssue,
  deleteIssue,
  getIssueAuditLogs,
} from "../controllers/issue.controller";

const router = express.Router();

router.post("/create", isAuthenticated, createIssue);
router.put("/:id", isAuthenticated, updateIssue);
router.delete("/:id", isAuthenticated, deleteIssue);
router.get("/audit/:id", isAuthenticated, getIssueAuditLogs);

// ADD THIS
router.get("/", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const total = await IssueModel.countDocuments();

  const issues = await IssueModel.find()
    .populate("citizen", "firstName lastName email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    issues,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
});

router.get("/:id", isAuthenticated, async (req, res) => {
  const issue = await IssueModel.findById(req.params.id).populate(
    "citizen",
    "firstName lastName email avatar role",
  );

  if (!issue) {
    return res.status(404).json({ success: false });
  }

  res.json({ success: true, issue });
});

export default router;
