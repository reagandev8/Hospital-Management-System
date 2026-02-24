const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@hms.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = await User.create({
            name: 'Global Admin',
            email: 'admin@hms.com',
            password: 'adminpassword123', // Will be hashed by pre-save hook
            role: 'admin',
            city: 'Admin City',
            address: 'HMS Headquarters'
        });

        console.log('Admin User Created Successfully!');
        console.log('Email: admin@hms.com');
        console.log('Password: adminpassword123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
