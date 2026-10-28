export class ApiError extends Error {
  constructor(status, message, { code, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message = "Bad request", opts) {
    return new ApiError(400, message, opts);
  }
  static unauthorized(message = "Unauthorized", opts) {
    return new ApiError(401, message, opts);
  }
  static forbidden(message = "Forbidden", opts) {
    return new ApiError(403, message, opts);
  }
  static notFound(message = "Not found", opts) {
    return new ApiError(404, message, opts);
  }
}
