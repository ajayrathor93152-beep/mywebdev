import { Inquiry } from "../models/Inquiry.js";
import { notifyNewInquiry } from "../services/mail.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInquiry = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;

  // Honeypot tripped: pretend success so bots learn nothing.
  if (website) return res.status(201).json({ ok: true });

  const inquiry = await Inquiry.create({
    ...data,
    meta: { ip: req.ip, userAgent: req.get("user-agent")?.slice(0, 300) },
  });

  // Don't make the visitor wait on SMTP.
  notifyNewInquiry(inquiry).catch((err) => console.error("[mail]", err));

  res.status(201).json({ ok: true, id: inquiry._id });
});

export const listInquiries = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const filter = status ? { status } : {};

  const [items, total] = await Promise.all([
    Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Inquiry.countDocuments(filter),
  ]);

  res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status } },
    { new: true, runValidators: true }
  );
  if (!inquiry) throw ApiError.notFound("Inquiry not found");
  res.json({ inquiry });
});
