const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const parser = require('../middlewares/uploadCloudinary');

router.post('/register', parser.single('image'), register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
