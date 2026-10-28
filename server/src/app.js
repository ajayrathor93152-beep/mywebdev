import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimit.js";
import routes from "./routes/index.js";
import { ApiError } from "./utils/ApiError.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  // Needed so req.ip (and therefore rate limiting) sees the real client IP behind a proxy.
  if (env.TRUST_PROXY) app.set("trust proxy", env.TRUST_PROXY);

  // ── Security headers ───────────────────────────────────
  // This server only returns JSON, so the CSP can deny everything.
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
      },
      crossOriginResourcePolicy: { policy: "same-site" },
    })
  );

  // ── Strict CORS (exact-origin allow-list, credentials on) ──
  app.use(
    cors({
      origin(origin, callback) {
        // No Origin header = same-origin request or server-to-server call.
        if (!origin || env.CLIENT_ORIGINS.includes(origin)) return callback(null, true);
        callback(ApiError.forbidden("Origin not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      maxAge: 600,
    })
  );

  // ── Body parsing + input hygiene ───────────────────────
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(mongoSanitize()); // strips `$` / `.` keys → blocks NoSQL operator injection
  app.use(hpp()); // blocks HTTP parameter pollution (?status=a&status=b)
  app.use(compression());

  // ── Routes ─────────────────────────────────────────────
  app.use("/api", globalLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
