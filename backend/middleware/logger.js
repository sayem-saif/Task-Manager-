/**
 * Logger middleware for request logging
 * Logs HTTP method, URL, status code, and response time
 */
const logger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  console.log(`\n📥 ${req.method} ${req.originalUrl}`);
  
  if (Object.keys(req.body).length > 0) {
    console.log('   Body:', JSON.stringify(req.body, null, 2));
  }

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - startTime;
    console.log(`📤 ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    return originalJson.call(this, data);
  };

  next();
};

module.exports = logger;
