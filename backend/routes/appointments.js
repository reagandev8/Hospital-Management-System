const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getDoctors,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/doctors', getDoctors);
router.post('/', bookAppointment);
router.get('/my', getMyAppointments);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
