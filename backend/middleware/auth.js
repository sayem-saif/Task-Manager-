const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

/**
 * Protect routes - Verify JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (!req.user.isVerified) {
      res.status(403);
      throw new Error('Please verify your email to access this resource');
    }

    next();
  } catch (error) {
    console.error('🔒 Auth Error:', error.message);
    res.status(401);
    
    // Provide more specific error messages in development
    if (process.env.NODE_ENV === 'development') {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token format');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
    }
    
    throw new Error('Not authorized to access this route');
  }
});

module.exports = { protect };
