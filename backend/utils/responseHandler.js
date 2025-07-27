class ResponseHandler {
  // Success response
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  // Error response
  static error(res, message = 'An error occurred', statusCode = 500, error = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error.message || error;
      response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
  }

  // Validation error response
  static validationError(res, errors, message = 'Validation failed') {
    return res.status(400).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  // Not found response
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Unauthorized response
  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Forbidden response
  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Rate limit response
  static rateLimit(res, message = 'Too many requests') {
    return res.status(429).json({
      success: false,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Processing response (for long-running operations)
  static processing(res, message = 'Processing', taskId = null) {
    const response = {
      success: true,
      message,
      status: 'processing',
      timestamp: new Date().toISOString()
    };

    if (taskId) {
      response.taskId = taskId;
    }

    return res.status(202).json(response);
  }
}

module.exports = ResponseHandler; 