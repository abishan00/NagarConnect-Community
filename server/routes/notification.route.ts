import express from "express";
import { isAuthenticated } from "../middleware/auth";
import NotificationModel from "../models/notification.modal";

const router = express.Router();

router.get("/", isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const total = await NotificationModel.countDocuments({
    recipient: req.user?._id,
  });

  const notifications = await NotificationModel.find({
    recipient: req.user?._id,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    notifications,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
});

router.put("/:id/read", isAuthenticated, async (req, res) => {
  await NotificationModel.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ success: true });
});

// ADD THIS
router.put("/mark-all-read", isAuthenticated, async (req, res) => {
  await NotificationModel.updateMany(
    { recipient: req.user?._id, isRead: false },
    { isRead: true },
  );
  res.json({ success: true });
});

export default router;
