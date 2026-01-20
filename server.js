const express = require('express');
const userRoutes = require('./routes/userRoutes');
const logger = require('./middleware/logger');

// Initialize Express application
const app = express();
const PORT = 3000;

/*
 * MIDDLEWARE EXPLANATION:
 * Middleware are functions that execute BEFORE your route handlers.
 * They can modify the request/response or perform actions like logging.
 */

// Parse incoming JSON data from request body
app.use(express.json());

// Custom logging middleware (logs every request)
app.use(logger);

/*
 * ROOT ROUTE - API DOCUMENTATION
 * This route serves as interactive documentation for beginners
 * HTTP Method: GET
 * Purpose: Show all available API endpoints
 */
app.get('/', (req, res) => {
  const documentation = {
    message: "Welcome to the REST API Tutorial!",
    description: "This API demonstrates RESTful principles for beginners",
    
    whatIsREST: {
      definition: "REST (Representational State Transfer) is an architectural style for building web services",
      principles: [
        "Client-Server architecture",
        "Stateless communication",
        "Cacheable responses",
        "Uniform interface using HTTP methods"
      ]
    },

    httpMethods: {
      GET: "Retrieve data (Read operation)",
      POST: "Create new data (Create operation)",
      PUT: "Update existing data (Update operation)",
      DELETE: "Remove data (Delete operation)"
    },

    availableEndpoints: [
      {
        method: "GET",
        endpoint: "/api/users",
        description: "Get all users",
        sampleResponse: [
          { id: 1, name: "Alice", email: "alice@example.com", age: 25 }
        ],
        curlExample: "curl http://localhost:3000/api/users"
      },
      {
        method: "GET",
        endpoint: "/api/users/:id",
        description: "Get a single user by ID",
        parameters: { id: "User ID (number)" },
        sampleResponse: { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
        curlExample: "curl http://localhost:3000/api/users/1"
      },
      {
        method: "POST",
        endpoint: "/api/users",
        description: "Create a new user",
        requestBody: {
          name: "string (required)",
          email: "string (required)",
          age: "number (required)"
        },
        sampleRequest: { name: "Eve", email: "eve@example.com", age: 28 },
        sampleResponse: { id: 4, name: "Eve", email: "eve@example.com", age: 28 },
        curlExample: 'curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d \'{"name":"Eve","email":"eve@example.com","age":28}\''
      },
      {
        method: "PUT",
        endpoint: "/api/users/:id",
        description: "Update an existing user",
        parameters: { id: "User ID (number)" },
        requestBody: {
          name: "string (optional)",
          email: "string (optional)",
          age: "number (optional)"
        },
        sampleRequest: { name: "Alice Updated", age: 26 },
        curlExample: 'curl -X PUT http://localhost:3000/api/users/1 -H "Content-Type: application/json" -d \'{"name":"Alice Updated","age":26}\''
      },
      {
        method: "DELETE",
        endpoint: "/api/users/:id",
        description: "Delete a user by ID",
        parameters: { id: "User ID (number)" },
        sampleResponse: { message: "User deleted successfully" },
        curlExample: "curl -X DELETE http://localhost:3000/api/users/1"
      }
    ],

    statusCodes: {
      200: "OK - Request succeeded",
      201: "Created - New resource created successfully",
      400: "Bad Request - Invalid input data",
      404: "Not Found - Resource doesn't exist",
      500: "Internal Server Error - Something went wrong on server"
    },

    tipsForBeginners: [
      "Use tools like Postman or Thunder Client to test APIs",
      "Always check the HTTP status code in responses",
      "REST APIs are stateless - each request is independent",
      "Use proper HTTP methods for different operations"
    ]
  };

  res.status(200).json(documentation);
});

// Mount user routes under /api/users
app.use('/api/users', userRoutes);

// 404 Handler - when no route matches
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The route ${req.method} ${req.url} does not exist`,
    availableRoutes: "Visit GET / for API documentation"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 REST API Tutorial Server running on http://localhost:${PORT}`);
  console.log(`📚 Visit http://localhost:${PORT}/ for API documentation`);
});