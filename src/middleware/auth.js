const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'audicin-secret-key';

/**
 * Middleware to authenticate token
 */
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is not valid' });
  }
};

/**
 * Middleware to authorize admin role
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin role required' });
  }
  next();
};

/**
 * Middleware to authorize partner role
 */
const authorizePartner = (req, res, next) => {
  if (req.user.role !== 'partner') {
    return res.status(403).json({ error: 'Access denied: Partner role required' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizePartner
};