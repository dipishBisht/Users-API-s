const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/*
 * ADVANCED ROUTING:
 * - GET /api/users - Get all users (supports query params)
 * - GET /api/users/stats - Get user statistics
 * - GET /api/users/:id - Get single user
 * - POST /api/users - Create user
 * - PUT /api/users/:id - Full update
 * - PATCH /api/users/:id - Partial update
 * - DELETE /api/users/:id - Delete user
 */

// IMPORTANT: Specific routes MUST come before parameterized routes
// Otherwise /stats would be treated as an ID

// GET /api/users/stats - Statistics endpoint
router.get('/stats', userController.getUserStats);

// GET /api/users - Get all users with filtering, sorting, pagination
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get single user
router.get('/:id', userController.getUserById);

// POST /api/users - Create new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Full update
router.put('/:id', userController.updateUser);

// PATCH /api/users/:id - Partial update
router.patch('/:id', userController.patchUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;