const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name email gender address')
            .sort({ appointmentDate: 1, appointmentTime: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get doctor's patients
// @route   GET /api/doctor/patients
// @access  Private/Doctor
exports.getDoctorPatients = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id }).populate('patient');
        const patients = [...new Set(appointments.map(app => app.patient))];
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id/status
// @access  Private/Doctor
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the doctor belongs to this appointment
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this appointment' });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ message: `Appointment ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
