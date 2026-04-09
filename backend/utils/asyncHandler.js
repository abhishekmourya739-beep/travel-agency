/**
 * asyncHandler
 *
 * This utility function wraps asynchronous Express route handlers
 * so we don't need to write try/catch blocks in every controller.
 *
 * If any error occurs inside the async function, it automatically
 * forwards the error to Express's global error handler middleware.
 *
 * Usage:
 *   router.get("/users", asyncHandler(getUsers));
 *
 * Without this wrapper, every controller would need a try/catch block.
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    // Ensure the function result is a Promise
    // If it rejects, pass the error to Express error middleware
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
