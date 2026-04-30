/**
 * Request logging middleware
 */
const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Capture response data
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    originalSend.call(this, data);
  };

  next();
};

module.exports = loggingMiddleware;
