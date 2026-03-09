const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all users (patients)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'patient' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
exports.addDoctor = async (req, res) => {
    const { name, email, password, specialization, address, city, gender } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const doctor = await User.create({
            name,
            email,
            password,
            role: 'doctor',
            specialization,
            address,
            city,
            gender,
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id);

        if (doctor) {
            await doctor.deleteOne();
            res.json({ message: 'Doctor removed' });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete patient (user)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Patient removed' });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const patientCount = await User.countDocuments({ role: 'patient' });
        const doctorCount = await User.countDocuments({ role: 'doctor' });
        const appointmentCount = await Appointment.countDocuments();

        res.json({
            patients: patientCount,
            doctors: doctorCount,
            appointments: appointmentCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
