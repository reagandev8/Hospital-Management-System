const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.get('/register', (req, res) => {
    res.send('Auth API is active. Please use the registration form on the website (Port 5176) to register. This endpoint only accepts POST requests.');
});
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
