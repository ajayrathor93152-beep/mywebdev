import { z } from "zod";

// Empty strings in .env should behave like "not set".
const optional = (schema) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),

    MONGO_URI: z.string().min(1, "MONGO_URI is required"),

    CLIENT_ORIGINS: z
      .string()
      .default("http://localhost:5173")
      .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),

    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 chars"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 chars"),
    ACCESS_TOKEN_TTL: z.string().default("15m"),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().max(90).default(7),

    COOKIE_SAMESITE: z.enum(["strict", "lax", "none"]).default("strict"),
    COOKIE_DOMAIN: optional(z.string()),

    SMTP_HOST: optional(z.string()),
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_USER: optional(z.string()),
    SMTP_PASS: optional(z.string()),
    MAIL_FROM: z.string().default("Studio <no-reply@example.com>"),
    MAIL_TO: optional(z.string().email()),
  })
  .refine((e) => e.JWT_ACCESS_SECRET !== e.JWT_REFRESH_SECRET, {
    message: "Access and refresh secrets must be different",
    path: ["JWT_REFRESH_SECRET"],
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("✖ Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
export const isProd = env.NODE_ENV === "production";
