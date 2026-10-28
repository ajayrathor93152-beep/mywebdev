import { Router } from "express";
import {
  createInquiry,
  listInquiries,
  updateInquiryStatus,
} from "../controllers/inquiry.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { contactLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import {
  createInquirySchema,
  inquiryIdParams,
  listInquiriesQuery,
  updateInquiryStatusSchema,
} from "../validators/inquiry.schema.js";

const router = Router();

// Public
router.post("/", contactLimiter, validate({ body: createInquirySchema }), createInquiry);

// Admin
router.get("/", requireAuth, validate({ query: listInquiriesQuery }), listInquiries);
router.patch(
  "/:id/status",
  requireAuth,
  validate({ params: inquiryIdParams, body: updateInquiryStatusSchema }),
  updateInquiryStatus
);

export default router;
