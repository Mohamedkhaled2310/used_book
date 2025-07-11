const express = require('express');
const router = express.Router();
const { uploadBook, getNearbyBooks } = require('../controllers/bookController');
const parser = require('../middlewares/uploadCloudinary');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/upload', requireAuth, parser.single('image'), uploadBook);
router.get('/timeline', requireAuth, getNearbyBooks);

module.exports = router;
