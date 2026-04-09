const express = require('express');
const router = express.Router();
// Import the logic from the controller to maintain modular separation
const usersController = require('../controllers/usersController');

// Define multiple routes using Express routing mechanism
// Handle different HTTP methods (GET, POST, PUT, DELETE)

// GET /api/users - Retrieve all users
router.get('/', usersController.getAllUsers);

// GET /api/users/:id - Retrieve a specific user
// Implement route parameters using dynamic routing (/:id)
router.get('/:id', usersController.getUserById);

// POST /api/users - Create a new user
router.post('/', usersController.createUser);

// PUT /api/users/:id - Update an existing user
router.put('/:id', usersController.updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', usersController.deleteUser);

module.exports = router;
