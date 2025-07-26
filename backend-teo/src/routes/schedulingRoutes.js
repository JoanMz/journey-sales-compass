const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/schedulingController');

// Public routes (might require authentication in production)
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);

// Protected routes
router.post('/', authenticate, createAppointment);
router.put('/:id', authenticate, updateAppointment);
router.delete('/:id', authenticate, deleteAppointment);

module.exports = router; 