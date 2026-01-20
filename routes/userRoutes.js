const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/*
 * ROUTES EXPLANATION:
 * Routes map HTTP methods + URL patterns to controller functions
 * 
 * Pattern: router.METHOD(path, controllerFunction)
 * 
 * The path here is relative to /api/users (set in server.js)
 * So '/' here actually means '/api/users'
 */

/*
 * RESTful Route Pattern:
 * Collection: /api/users
 * Individual: /api/users/:id
 * 
 * :id is a route parameter - it's a placeholder for the actual ID
 */

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get single user
// Example: GET /api/users/1
router.get('/:id', userController.getUserById);

// POST /api/users - Create new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update user
// Example: PUT /api/users/1
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user
// Example: DELETE /api/users/1
router.delete('/:id', userController.deleteUser);

/*
 * CRUD MAPPING (Standard REST pattern):
 * Create  → POST   /api/users
 * Read    → GET    /api/users (all) or /api/users/:id (one)
 * Update  → PUT    /api/users/:id
 * Delete  → DELETE /api/users/:id
 */

module.exports = router;