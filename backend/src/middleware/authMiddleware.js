const jwt = require('jsonwebtoken');

/**
 * Authentication middleware
 * In development mode, bypasses auth for easier local testing
 */
const authMiddleware = (req, res, next) => {
  try {
    // Development bypass: allow all requests without token
    if (process.env.NODE_ENV === 'development') {
      req.user = { id: 'dev-user', email: 'dev@local.test', role: 'admin' };
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      message: error.message,
    });
  }
};

module.exports = authMiddleware;
