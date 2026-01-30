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
  const timestamp = new Date().toISOString();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log('Query Params:', JSON.stringify(req.query, null, 2));
  }
  
  // Log request body if present
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  console.log(`${'='.repeat(60)}\n`);
  
  next();
};

module.exports = logger;