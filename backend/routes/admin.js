const express = require('express');
const router = express.Router();
const {
    getUsers,
    getDoctors,
    addDoctor,
    deleteDoctor,
    getStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.get('/doctors', getDoctors);
router.post('/doctors', addDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.get('/stats', getStats);

module.exports = router;
