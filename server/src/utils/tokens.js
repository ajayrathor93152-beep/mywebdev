import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const ISSUER = "agency-api";
const ACCESS_AUDIENCE = "agency-admin";
const REFRESH_AUDIENCE = "agency-refresh";
const ALGORITHM = "HS256";

export const newTokenId = () => crypto.randomUUID();

export const refreshTtlMs = () => env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

/** Short-lived token the client keeps in memory only. */
export function signAccessToken(admin) {
  return jwt.sign({ role: admin.role }, env.JWT_ACCESS_SECRET, {
    subject: String(admin._id),
    expiresIn: env.ACCESS_TOKEN_TTL,
    issuer: ISSUER,
    audience: ACCESS_AUDIENCE,
    algorithm: ALGORITHM,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: [ALGORITHM],
    issuer: ISSUER,
    audience: ACCESS_AUDIENCE,
  });
}

/**
 * Long-lived token that lives only in an HTTP-only cookie.
 * `jti` identifies this exact token; `fam` groups every token descended from one login,
 * so a replayed (already-rotated) token can revoke the whole chain.
 */
export function signRefreshToken({ adminId, jti, family }) {
  return jwt.sign({ fam: family }, env.JWT_REFRESH_SECRET, {
    subject: String(adminId),
    jwtid: jti,
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
    issuer: ISSUER,
    audience: REFRESH_AUDIENCE,
    algorithm: ALGORITHM,
  });
}

export function verifyRefreshToken(token, { ignoreExpiration = false } = {}) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    algorithms: [ALGORITHM],
    issuer: ISSUER,
    audience: REFRESH_AUDIENCE,
    ignoreExpiration,
  });
}
