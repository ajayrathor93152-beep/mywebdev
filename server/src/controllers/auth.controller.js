import bcrypt from "bcryptjs";
import { env, isProd } from "../config/env.js";
import { Admin } from "../models/Admin.js";
import {
  issueTokenPair,
  revokeAllSessions,
  revokeSession,
  rotateRefreshToken,
} from "../services/token.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { refreshTtlMs } from "../utils/tokens.js";

// `__Secure-` prefix makes browsers reject the cookie unless it's set over HTTPS with Secure.
export const REFRESH_COOKIE = isProd ? "__Secure-rt" : "rt";

const cookieOptions = () => ({
  httpOnly: true,
  secure: isProd || env.COOKIE_SAMESITE === "none",
  sameSite: env.COOKIE_SAMESITE,
  domain: env.COOKIE_DOMAIN,
  path: "/api/auth", // the cookie is only ever sent to auth endpoints
});

const setRefreshCookie = (res, token) =>
  res.cookie(REFRESH_COOKIE, token, { ...cookieOptions(), maxAge: refreshTtlMs() });

const clearRefreshCookie = (res) => res.clearCookie(REFRESH_COOKIE, cookieOptions());

const requestMeta = (req) => ({ ip: req.ip, userAgent: req.get("user-agent") });

// Compared against when the email doesn't exist so response timing doesn't reveal valid accounts.
const DUMMY_HASH = bcrypt.hashSync("timing-attack-dummy-password", 12);
const INVALID_CREDENTIALS = "Invalid email or password";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password +failedLoginAttempts +lockUntil");

  if (!admin) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw ApiError.unauthorized(INVALID_CREDENTIALS);
  }

  if (admin.isLocked) {
    throw new ApiError(423, "Account temporarily locked. Try again later.", { code: "LOCKED" });
  }

  const valid = await admin.comparePassword(password);
  if (!valid || !admin.isActive) {
    if (!valid) await admin.registerFailedLogin();
    throw ApiError.unauthorized(INVALID_CREDENTIALS);
  }

  await admin.registerSuccessfulLogin();
  const { accessToken, refreshToken } = await issueTokenPair(admin, { meta: requestMeta(req) });

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, admin });
});

export const refresh = asyncHandler(async (req, res) => {
  try {
    const { admin, accessToken, refreshToken } = await rotateRefreshToken(
      req.cookies?.[REFRESH_COOKIE],
      requestMeta(req)
    );
    setRefreshCookie(res, refreshToken);
    res.json({ accessToken, admin });
  } catch (err) {
    clearRefreshCookie(res);
    throw err;
  }
});

export const logout = asyncHandler(async (req, res) => {
  await revokeSession(req.cookies?.[REFRESH_COOKIE]);
  clearRefreshCookie(res);
  res.status(204).end();
});

export const logoutEverywhere = asyncHandler(async (req, res) => {
  await revokeAllSessions(req.auth.adminId);
  clearRefreshCookie(res);
  res.status(204).end();
});

export const me = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.auth.adminId);
  if (!admin || !admin.isActive) throw ApiError.unauthorized("Account unavailable");
  res.json({ admin });
});
