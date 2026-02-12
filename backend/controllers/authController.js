const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../config/email');
const crypto = require('crypto');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Generate verification token
  const verificationToken = user.generateVerificationToken();
  await user.save();

  // Create verification URL
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // Check if email is configured (not placeholder values)
  const isEmailConfigured = 
    process.env.EMAIL_USER && 
    process.env.EMAIL_PASSWORD &&
    process.env.EMAIL_USER !== 'your_email@gmail.com' &&
    process.env.EMAIL_PASSWORD !== 'your_app_password';

  if (isEmailConfigured) {
    try {
      // Send verification email
      await sendVerificationEmail(user.email, user.name, verificationUrl);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        userId: user._id
      });
    } catch (error) {
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);
      res.status(500);
      throw new Error('Failed to send verification email. Please try again.');
    }
  } else {
    // Email not configured - auto-verify for development
    console.warn('⚠️  EMAIL NOT CONFIGURED - Auto-verifying user for development');
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: 'Registration successful! (Email verification skipped - configure EMAIL_USER and EMAIL_PASSWORD in .env)',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      },
      autoVerified: true
    });
  }
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Hash the token to match with database
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with this token
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  // Verify user
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  // Generate auth token
  const authToken = user.generateAuthToken();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully!',
    token: authToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if email is verified
  if (!user.isVerified) {
    res.status(403);
    throw new Error('Please verify your email before logging in');
  }

  // Generate token
  const token = user.generateAuthToken();

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    }
  });
});

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide email');
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = user.generateVerificationToken();
  await user.save();

  // Create verification URL
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // Send verification email
  await sendVerificationEmail(user.email, user.name, verificationUrl);

  res.status(200).json({
    success: true,
    message: 'Verification email sent successfully!'
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
    }
  });
});

module.exports = {
  register,
  verifyEmail,
  login,
  resendVerification,
  getMe
};
