import { z } from "zod";

export const SERVICES = ["website", "ecommerce", "restaurant", "mvp", "dashboard", "other"];
export const BUDGETS = ["starter", "growth", "scale", "enterprise", "unsure"];
export const INQUIRY_STATUSES = ["new", "contacted", "won", "closed"];

// Letters (any language), spaces and a few name punctuation marks. Blocks newlines → no header injection.
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

const optionalText = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

export const createInquirySchema = z
  .object({
    name: z.string().trim().min(2).max(80).regex(NAME_RE, "Please enter a valid name"),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: optionalText(20).refine((v) => !v || PHONE_RE.test(v), "Please enter a valid phone number"),
    company: optionalText(120),
    service: z.enum(SERVICES),
    budget: z.enum(BUDGETS).default("unsure"),
    message: z.string().trim().min(20, "Tell us a little more (20+ characters)").max(2000),
    // Honeypot — real users never see or fill this field.
    website: z.string().max(200).optional(),
  })
  .strict();

export const listInquiriesQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(INQUIRY_STATUSES).optional(),
});

export const inquiryIdParams = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id"),
});

export const updateInquiryStatusSchema = z.object({ status: z.enum(INQUIRY_STATUSES) }).strict();
