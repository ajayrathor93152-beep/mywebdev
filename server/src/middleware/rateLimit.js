import rateLimit from "express-rate-limit";

const base = {
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (_req, res, _next, options) =>
    res.status(options.statusCode).json({
      error: { message: options.message, code: "RATE_LIMITED" },
    }),
};

/** Baseline for every /api request. */
export const globalLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: "Too many requests, please slow down.",
});

/** Brute-force protection: only failed attempts count toward the limit. */
export const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Try again in 15 minutes.",
});

export const refreshLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: "Too many session refreshes.",
});

/** Contact form spam protection. */
export const contactLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: "You've sent several messages already — we'll be in touch soon.",
});
