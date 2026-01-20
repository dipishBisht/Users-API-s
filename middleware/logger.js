/*
 * MIDDLEWARE EXPLANATION:
 * Middleware functions have access to req, res, and next
 * They can:
 * 1. Execute code
 * 2. Modify req/res objects
 * 3. End the request-response cycle
 * 4. Call next() to pass control to the next middleware
 */

const logger = (req, res, next) => {
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Log request details
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Log request body if present (for POST/PUT)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  // IMPORTANT: Call next() to pass control to the next middleware/route
  // Without this, the request will hang!
  next();
};

module.exports = logger;