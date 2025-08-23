const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../utils/auth');

// Register
router.post('/register', UserController.register);
// Login
router.post('/login', UserController.login);
// Get all users (admin only)
router.get('/', auth(['admin']), UserController.getAllUsers);
// Get user by ID (admin or self)
router.get('/:id', auth(['admin', 'self']), UserController.getUserById);
// Delete user (admin only)
router.delete('/:id', auth(['admin']), UserController.deleteUser);

module.exports = router;

