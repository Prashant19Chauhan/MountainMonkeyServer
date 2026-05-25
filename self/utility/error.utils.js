import { StatusCodes, getReasonPhrase } from "http-status-codes";

/**
 * Creates and forwards an HTTP error to Express error handler middleware.
 * @param {number} statusCode - HTTP status code
 * @param {string|string[]} message - Error message(s)
 * @param {Function} next - Express next function
 */
export const errorHandler = (statusCode, message, next) => {
    const error = new Error(Array.isArray(message) ? message.join(", ") : message);
    error.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    error.message = Array.isArray(message) ? message.join(", ") : (message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    return next(error);
};

/**
 * Sends a standardized success JSON response.
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} [data] - Optional response data
 * @param {Object} [meta] - Optional pagination/meta info
 */
export const sendSuccess = (res, statusCode, message, data = undefined, meta = undefined) => {
    const response = { success: true, message };
    if (data !== undefined) response.data = data;
    if (meta !== undefined) response.meta = meta;
    return res.status(statusCode).json(response);
};

export { StatusCodes };

