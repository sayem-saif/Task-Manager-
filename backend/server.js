const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'https://taskager.vercel.app',
      'http://localhost:8080',
      'http://localhost:5173'
    ].filter(Boolean);
    
    // Check if origin ends with .vercel.app (for preview deployments)
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
  });
}

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Taskager API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    database: 'connected'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 404 Handler - Must be after all valid routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error Handler Middleware - Must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
  
  // Check email configuration
  const isEmailConfigured = process.env.EMAIL_USER && 
                           process.env.EMAIL_USER !== 'your_email@gmail.com' &&
                           process.env.EMAIL_PASSWORD &&
                           process.env.EMAIL_PASSWORD !== 'your_app_password';
  
  if (!isEmailConfigured) {
    console.log('⚠️  EMAIL NOT CONFIGURED');
    console.log('   Users will be auto-verified without email confirmation');
    console.log('   To enable email verification, update .env:');
    console.log('   - EMAIL_USER=your_gmail@gmail.com');
    console.log('   - EMAIL_PASSWORD=your_16_char_app_password');
    console.log('   See backend/EMAIL_SETUP.md for instructions\n');
  } else {
    console.log('✅ Email service configured');
    console.log(`📧 Sending from: ${process.env.EMAIL_USER}\n`);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  console.error(err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;
