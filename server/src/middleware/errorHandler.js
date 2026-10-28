import { ZodError } from "zod";
import { isProd } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = 500;
  let body = { message: "Something went wrong" };

  if (err instanceof ZodError) {
    status = 422;
    body = {
      message: "Validation failed",
      code: "VALIDATION",
      fields: err.flatten().fieldErrors,
    };
  } else if (err instanceof ApiError) {
    status = err.status;
    body = { message: err.message, code: err.code, details: err.details };
  } else if (err.type === "entity.too.large") {
    status = 413;
    body = { message: "Payload too large" };
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    body = { message: "Malformed JSON" };
  } else if (err.name === "CastError") {
    status = 400;
    body = { message: "Invalid identifier" };
  } else if (err.code === 11000) {
    status = 409;
    body = { message: "Resource already exists" };
  }

  if (status >= 500) console.error("[error]", err);
  if (!isProd && status >= 500) body.stack = err.stack;

  res.status(status).json({ error: body });
}
