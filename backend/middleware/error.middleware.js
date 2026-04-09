/**
 * Global Error Handling Middleware
 *
 * This middleware catches all errors thrown in controllers
 * and sends a consistent error response to the client.
 *
 * Works together with:
 *  - asyncHandler (for catching async errors)
 *  - AppError (for custom application errors)
 */

import { cleanupUploadedFiles } from "../validation/admin/cleanupUploadedfiles";

const errorMiddleware = async (err, req, res, next) => {
  // 🔥 CLEANUP HERE (ONLY ONCE)
  await cleanupUploadedFiles(req);
  // Use provided statusCode or default to 500
  const statusCode = err.statusCode || 500;

  // Default message if error message is not provided
  const message = err.message || "Internal Server Error";

  const response = {
    success: false,
    message,
  };

  // In development mode show stack trace for debugging
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
