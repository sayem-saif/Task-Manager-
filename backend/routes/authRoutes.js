const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  resendVerification,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
