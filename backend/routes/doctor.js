const express = require('express');
const router = express.Router();
const {
    getDoctorAppointments,
    getDoctorPatients,
    updateAppointmentStatus,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('doctor'));

router.get('/appointments', getDoctorAppointments);
router.get('/patients', getDoctorPatients);
router.put('/appointments/:id/status', updateAppointmentStatus);

module.exports = router;
