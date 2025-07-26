const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Public routes (might require authentication in production)
router.get('/', getUsers);
router.get('/:id', getUserById);

// Protected routes
router.post('/', authenticate, createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

module.exports = router; 