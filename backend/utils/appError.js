/**
 * AppError
 *
 * Custom error class used to create application-specific errors.
 * Instead of handling errors in every controller, we throw AppError
 * and let the global error middleware handle the response.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Calls the built-in Error class and sets the error message

    this.statusCode = statusCode; // HTTP status code (ex: 404, 401, 500)
    this.success = false; // Keeps API response format consistent
    this.isOperational = true; // Marks this as a controlled application error

    // Removes this constructor from the stack trace for cleaner debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

// What each important part does

// class AppError extends Error
// Creates a custom error type that inherits from JavaScript’s built-in Error class.

// super(message)
// Passes the error message to the parent Error class so err.message works properly.

// this.statusCode
// Stores the HTTP status code so the error middleware knows what response code to send.

// this.success = false
// Keeps your API response structure consistent:
