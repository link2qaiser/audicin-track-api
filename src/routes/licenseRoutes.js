const express = require('express');
const router = express.Router();
const { createLicense, getLicenses } = require('../controllers/licenseController');
const { authenticate, authorizePartner } = require('../middleware/auth');

/**
 * @route   POST /api/license
 * @desc    Create a new license
 * @access  Partner only
 */
router.post('/', authenticate, authorizePartner, createLicense);

/**
 * @route   GET /api/license
 * @desc    Get all licenses for current user
 * @access  Partner only
 */
router.get('/', authenticate, authorizePartner, getLicenses);

module.exports = router;