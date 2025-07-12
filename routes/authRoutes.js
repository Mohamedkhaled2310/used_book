const express = require('express');
const router = express.Router();
const { register, login, logout, updateLocation } = require('../controllers/authController');
const parser = require('../middlewares/uploadCloudinary');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/register', parser.single('image'), register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/update-location', requireAuth, updateLocation);

module.exports = router;
