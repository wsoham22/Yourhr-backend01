const express = require('express');
const { protect } = require('../middlewares/authmiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { uploadResume } = require('../controllers/fileController');
const router = express.Router();

router.route('/profile').get(protect, getUserProfile).patch(protect, updateUserProfile);
router.post('/upload', protect, uploadResume);
module.exports = router;
