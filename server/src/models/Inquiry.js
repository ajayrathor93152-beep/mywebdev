import mongoose from "mongoose";
import { BUDGETS, INQUIRY_STATUSES, SERVICES } from "../validators/inquiry.schema.js";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 20 },
    company: { type: String, trim: true, maxlength: 120 },
    service: { type: String, enum: SERVICES, required: true },
    budget: { type: String, enum: BUDGETS, default: "unsure" },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: INQUIRY_STATUSES, default: "new", index: true },
    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

inquirySchema.index({ createdAt: -1 });

export const Inquiry = mongoose.model("Inquiry", inquirySchema);
