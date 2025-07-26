const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getDoctors,
  getDoctorById,
  createDoctor
} = require('../controllers/doctorController');

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctorById);

// Protected routes
router.post('/', authenticate, createDoctor);

module.exports = router; 