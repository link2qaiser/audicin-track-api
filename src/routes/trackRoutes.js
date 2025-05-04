const express = require('express');
const router = express.Router();
const { uploadTrack, getTracks } = require('../controllers/trackController');
const { authenticate, authorizeAdmin, authorizePartner } = require('../middleware/auth');

/**
 * @route   POST /api/tracks
 * @desc    Upload a new track
 * @access  Admin only
 */
router.post('/', authenticate, authorizeAdmin, uploadTrack);

/**
 * @route   GET /api/tracks
 * @desc    Get all tracks
 * @access  Partner only
 */
router.get('/', authenticate, authorizePartner, getTracks);

module.exports = router;