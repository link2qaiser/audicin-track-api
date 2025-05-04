/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Send error response
  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = { errorHandler };