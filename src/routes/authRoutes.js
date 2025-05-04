const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

module.exports = router;