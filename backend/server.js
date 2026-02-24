console.log('--- STARTING HMS BACKEND ---');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`>>> ${req.method} ${req.originalUrl}`);
    next();
});

// Enable CORS
app.use(cors());

// Route files
const authRoutes = require('./routes/auth');

app.get('/', (req, res) => res.send('HMS API is running...'));

const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
