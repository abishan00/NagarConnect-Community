import NotificationModel from "../models/notification.modal";
import sendMail from "../utils/sendMail";
import { getIO } from "../socketServer";

interface NotificationParams {
  recipientId: string;
  recipientEmail: string;
  recipientName: string;
  title: string;
  message: string;
  issueId: string;
  issueTitle: string;
  category: string;
  status: string;
  priority: string;
}

export const sendNotification = async ({
  recipientId,
  recipientEmail,
  recipientName,
  title,
  message,
  issueId,
  issueTitle,
  category,
  status,
  priority,
}: NotificationParams) => {
  const notification = await NotificationModel.create({
    recipient: recipientId,
    title,
    message,
    issue: issueId,
  });

  try {
    const io = getIO();

    io.to(recipientId).emit("newNotification", {
      _id: notification._id.toString(),
      title,
      message,
      issueId,
      category,
      status,
      priority,
      isRead: false,
      createdAt: new Date(),
    });
  } catch (err) {
    console.log("Socket error:", err);
  }

  try {
    await sendMail({
      email: recipientEmail,
      subject: title,
      template: "issue-notification.ejs",
      data: {
        userName: recipientName,
        message,
        issueTitle,
        category,
        status,
        priority,
      },
    });
  } catch {
    console.log("Mail failed");
  }
};
