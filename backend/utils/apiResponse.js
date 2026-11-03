/**
 * Standardized API Response Utilities
 * Provides consistent response shapes across all endpoints:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: any,
 *   meta?: object,
 *   errors?: any
 * }
 */

const success = (res, message = 'Success', data = null, statusCode = 200, meta = null) => {
  const payload = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
  };
  return res.status(statusCode).json(payload);
};

const created = (res, message = 'Resource created successfully', data = null, meta = null) => {
  return success(res, message, data, 201, meta);
};

const error = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
    ...(errors !== null && { errors }),
  };
  return res.status(statusCode).json(payload);
};

const badRequest = (res, message = 'Bad request', errors = null) => {
  return error(res, message, 400, errors);
};

const unauthorized = (res, message = 'Unauthorized access', errors = null) => {
  return error(res, message, 401, errors);
};

const forbidden = (res, message = 'Forbidden access to this resource', errors = null) => {
  return error(res, message, 403, errors);
};

const notFound = (res, message = 'Resource not found', errors = null) => {
  return error(res, message, 404, errors);
};

const unprocessable = (res, message = 'Validation failed', errors = null) => {
  return error(res, message, 422, errors);
};

module.exports = {
  success,
  created,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  unprocessable,
};
