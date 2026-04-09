/**
 * apiResponse
 *
 * Standard helper for sending successful API responses.
 * Keeps response structure consistent across the backend.
 *
 * Example:
 * apiResponse(res, 200, "Users fetched successfully", users);
 */

const apiResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    success: true, // indicates request was successful
    message, // descriptive message
    data, // main response data
  };

  // Optional metadata (useful for pagination, counts, etc.)
  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

export default apiResponse;
