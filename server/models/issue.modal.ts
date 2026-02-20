import mongoose, { Schema, Document, Model, ObjectId, Types } from "mongoose";

export interface IIssue extends Document {
  title: string;
  description: string;
  category: string;
  citizen: Types.ObjectId;
  urgency: number;
  severity: number;
  publicImpact: number;
  priorityScore: number;
  priorityLevel: "Low" | "Medium" | "High";
  status: "Submitted" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  department: "Public Works" | "Sanitation" | "Water Department" | "General";
  isOverdue: boolean;
  slaDeadline: Date;
  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const issueSchema: Schema<IIssue> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    urgency: { type: Number, required: true },
    severity: { type: Number, required: true },
    publicImpact: { type: Number, required: true },

    priorityScore: { type: Number },
    priorityLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },

    status: {
      type: String,
      enum: ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"],
      default: "Submitted",
    },

    department: {
      type: String,
      enum: ["Public Works", "Sanitation", "Water Department", "General"],
      default: "General",
    },

    isOverdue: {
      type: Boolean,
      default: false,
    },

    slaDeadline: { type: Date },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const IssueModel: Model<IIssue> = mongoose.model("Issue", issueSchema);
export default IssueModel;
