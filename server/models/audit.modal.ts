import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAudit extends Document {
  issue: mongoose.Types.ObjectId;
  action: string;
  previousValue?: any;
  newValue?: any;
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const auditSchema: Schema<IAudit> = new Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    previousValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const AuditModel: Model<IAudit> = mongoose.model("Audit", auditSchema);

export default AuditModel;
