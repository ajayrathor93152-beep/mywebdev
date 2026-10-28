import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/tokens.js";

/** Requires a valid `Authorization: Bearer <accessToken>` header. */
export function requireAuth(req, _res, next) {
  const [scheme, token] = (req.get("authorization") ?? "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(ApiError.unauthorized("Missing access token", { code: "NO_TOKEN" }));
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = { adminId: payload.sub, role: payload.role };
    next();
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    next(
      ApiError.unauthorized(expired ? "Access token expired" : "Invalid access token", {
        code: expired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
      })
    );
  }
}

export const requireRole =
  (...roles) =>
  (req, _res, next) =>
    roles.includes(req.auth?.role) ? next() : next(ApiError.forbidden("Insufficient permissions"));

/**
 * Cookie-authenticated endpoints (refresh/logout) require a custom header.
 * Browsers can't attach custom headers cross-origin without a CORS preflight,
 * which our strict CORS policy rejects — this blocks CSRF on top of SameSite.
 */
export function requireCsrfHeader(req, _res, next) {
  if (req.get("x-requested-with") === "XMLHttpRequest") return next();
  next(ApiError.forbidden("Missing CSRF header", { code: "CSRF" }));
}
