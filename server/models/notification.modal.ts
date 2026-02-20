import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INotification extends Document {
  recipient: Types.ObjectId;
  title: string;
  message: string;
  issue: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const NotificationModel: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema,
);

export default NotificationModel;

