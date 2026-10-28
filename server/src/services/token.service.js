import { Admin } from "../models/Admin.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { ApiError } from "../utils/ApiError.js";
import {
  newTokenId,
  refreshTtlMs,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";

const revokeFamily = (family) =>
  RefreshToken.updateMany({ family, revokedAt: null }, { $set: { revokedAt: new Date() } });

/** Issues an access token + a persisted refresh token (new family on login, same family on rotation). */
export async function issueTokenPair(admin, { family = newTokenId(), meta = {} } = {}) {
  const jti = newTokenId();

  await RefreshToken.create({
    jti,
    family,
    admin: admin._id,
    expiresAt: new Date(Date.now() + refreshTtlMs()),
    userAgent: meta.userAgent?.slice(0, 300),
    ip: meta.ip,
  });

  return {
    jti,
    accessToken: signAccessToken(admin),
    refreshToken: signRefreshToken({ adminId: admin._id, jti, family }),
  };
}

/**
 * Refresh-token rotation with reuse detection:
 *  - every refresh token works exactly once;
 *  - presenting an already-used token means it was stolen (or replayed),
 *    so the entire session family is revoked and the user must sign in again.
 */
export async function rotateRefreshToken(rawToken, meta) {
  if (!rawToken) throw ApiError.unauthorized("No session", { code: "NO_SESSION" });

  let payload;
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw ApiError.unauthorized("Session expired", { code: "SESSION_EXPIRED" });
  }

  // Atomically claim the token so two concurrent requests can't both use it.
  const claimed = await RefreshToken.findOneAndUpdate(
    { jti: payload.jti, revokedAt: null },
    { $set: { revokedAt: new Date() } },
    { new: true }
  );

  if (!claimed) {
    await revokeFamily(payload.fam);
    throw ApiError.unauthorized("Session revoked, please sign in again", { code: "TOKEN_REUSE" });
  }

  const admin = await Admin.findById(claimed.admin);
  if (!admin || !admin.isActive) {
    await revokeFamily(claimed.family);
    throw ApiError.unauthorized("Account unavailable", { code: "ACCOUNT_DISABLED" });
  }

  const pair = await issueTokenPair(admin, { family: claimed.family, meta });
  await RefreshToken.updateOne({ _id: claimed._id }, { $set: { replacedBy: pair.jti } });

  return { admin, ...pair };
}

/** Logout: revoke the whole family this token belongs to. Never throws. */
export async function revokeSession(rawToken) {
  if (!rawToken) return;
  try {
    const { fam } = verifyRefreshToken(rawToken, { ignoreExpiration: true });
    await revokeFamily(fam);
  } catch {
    /* invalid token — nothing to revoke */
  }
}

export const revokeAllSessions = (adminId) =>
  RefreshToken.updateMany({ admin: adminId, revokedAt: null }, { $set: { revokedAt: new Date() } });
