const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
    const { doctorId, customDoctorName, specialization, appointmentDate, appointmentTime } = req.body;

    if (!doctorId && !customDoctorName) {
        return res.status(400).json({ message: 'Please select a doctor or enter a name' });
    }

    try {
        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor: doctorId || null,
            customDoctorName,
            specialization,
            appointmentDate,
            appointmentTime,
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my
// @access  Private
exports.getMyAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patient: req.user._id }).populate('doctor', 'name specialization');
        } else if (req.user.role === 'doctor') {
            appointments = await Appointment.find({ doctor: req.user._id }).populate('patient', 'name email');
        }

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user is the patient or doctor
        if (appointment.patient.toString() !== req.user._id.toString() && appointment.doctor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ message: 'Appointment cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all doctors (for patients to book)
// @route   GET /api/appointments/doctors
// @access  Private (Patient)
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('name specialization consultancyFees');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
