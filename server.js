const express = require('express');
const userRoutes = require('./routes/userRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(logger);

// Root route - Enhanced API Documentation
app.get('/', (req, res) => {
  const documentation = {
    message: "Welcome to the REST API Tutorial! 🚀",
    description: "Advanced REST API with filtering, sorting, pagination, and more",
    version: "2.0.0",
    
    whatIsREST: {
      definition: "REST (Representational State Transfer) is an architectural style for building web services",
      principles: [
        "Client-Server architecture",
        "Stateless communication",
        "Cacheable responses",
        "Uniform interface using HTTP methods",
        "Layered system"
      ]
    },

    httpMethods: {
      GET: "Retrieve data (Read operation)",
      POST: "Create new data (Create operation)",
      PUT: "Full update of existing data (Update operation)",
      PATCH: "Partial update of existing data (Update operation)",
      DELETE: "Remove data (Delete operation)"
    },

    availableEndpoints: [
      {
        method: "GET",
        endpoint: "/api/users",
        description: "Get all users with advanced filtering, sorting, and pagination",
        queryParameters: {
          role: "Filter by role (e.g., developer, designer, manager)",
          city: "Filter by city",
          isActive: "Filter by active status (true/false)",
          minAge: "Filter users with age >= minAge",
          maxAge: "Filter users with age <= maxAge",
          search: "Search in name and email fields",
          sort: "Sort by field (use - for descending, e.g., -age)",
          page: "Page number (default: 1)",
          limit: "Items per page (default: 10)",
          fields: "Select specific fields (comma-separated, e.g., name,email,age)"
        },
        examples: [
          "GET /api/users?role=developer",
          "GET /api/users?city=New York&isActive=true",
          "GET /api/users?minAge=25&maxAge=35",
          "GET /api/users?search=alice",
          "GET /api/users?sort=-age",
          "GET /api/users?page=1&limit=5",
          "GET /api/users?fields=name,email,role",
          "GET /api/users?role=developer&sort=name&page=1&limit=10"
        ],
        curlExample: "curl 'http://localhost:3000/api/users?role=developer&sort=-age&limit=5'"
      },
      {
        method: "GET",
        endpoint: "/api/users/stats",
        description: "Get user statistics (total, by role, by city, etc.)",
        curlExample: "curl http://localhost:3000/api/users/stats"
      },
      {
        method: "GET",
        endpoint: "/api/users/:id",
        description: "Get a single user by ID",
        curlExample: "curl http://localhost:3000/api/users/1"
      },
      {
        method: "POST",
        endpoint: "/api/users",
        description: "Create a new user",
        requestBody: {
          name: "string (required, 2-50 chars)",
          email: "string (required, valid email)",
          age: "number (required, 18-100)",
          role: "string (optional, default: 'user')",
          city: "string (optional, default: 'Unknown')",
          isActive: "boolean (optional, default: true)"
        },
        curlExample: 'curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d \'{"name":"John Doe","email":"john@example.com","age":28,"role":"developer","city":"Boston"}\''
      },
      {
        method: "PUT",
        endpoint: "/api/users/:id",
        description: "Full update of an existing user",
        note: "PUT replaces the entire resource - provide all fields",
        curlExample: 'curl -X PUT http://localhost:3000/api/users/1 -H "Content-Type: application/json" -d \'{"name":"Alice Updated","age":26,"role":"senior developer"}\''
      },
      {
        method: "PATCH",
        endpoint: "/api/users/:id",
        description: "Partial update of an existing user",
        note: "PATCH updates only the provided fields",
        curlExample: 'curl -X PATCH http://localhost:3000/api/users/1 -H "Content-Type: application/json" -d \'{"isActive":false}\''
      },
      {
        method: "DELETE",
        endpoint: "/api/users/:id",
        description: "Delete a user by ID",
        curlExample: "curl -X DELETE http://localhost:3000/api/users/1"
      }
    ],

    statusCodes: {
      200: "OK - Request succeeded",
      201: "Created - New resource created successfully",
      400: "Bad Request - Invalid input data or parameters",
      404: "Not Found - Resource doesn't exist",
      500: "Internal Server Error - Something went wrong on server"
    },

    bestPractices: [
      "Use GET for reading data (idempotent, no side effects)",
      "Use POST for creating new resources",
      "Use PUT for full updates (replace entire resource)",
      "Use PATCH for partial updates (modify specific fields)",
      "Use DELETE for removing resources",
      "Always validate input data",
      "Return appropriate HTTP status codes",
      "Use query parameters for filtering and pagination",
      "Keep URLs simple and resource-based",
      "Version your API (e.g., /api/v1/users)"
    ],

    queryParametersGuide: {
      filtering: "Use query params to filter results: ?role=developer&city=Boston",
      sorting: "Sort with 'sort' param: ?sort=name (asc) or ?sort=-age (desc)",
      pagination: "Paginate with 'page' and 'limit': ?page=2&limit=10",
      fieldSelection: "Select specific fields: ?fields=name,email,age",
      searching: "Search across fields: ?search=john",
      combining: "Combine multiple params: ?role=developer&sort=-age&page=1&limit=5"
    },

    tipsForBeginners: [
      "Use Postman or Thunder Client to test APIs easily",
      "Query parameters are optional - defaults will be used if not provided",
      "Check the HTTP status code to understand the result",
      "Read error messages carefully - they help debug issues",
      "REST APIs are stateless - each request is independent",
      "Use the appropriate HTTP method for each operation",
      "Test edge cases (empty data, invalid IDs, etc.)"
    ]
  };

  res.status(200).json(documentation);
});

// Mount user routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The route ${req.method} ${req.url} does not exist`,
    availableRoutes: "Visit GET / for API documentation"
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🚀 REST API Tutorial Server v2.0 running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 User Stats: http://localhost:${PORT}/api/users/stats`);
  console.log(`${'='.repeat(70)}\n`);
});