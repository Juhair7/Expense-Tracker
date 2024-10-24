const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register a new user
router.post('/register', authController.signup);

// Login with OTP verification
router.post('/login', authController.login);

router.post('/verify-otp', authController.verifyOTP);

// Password recovery (OTP + security answer)
router.post('/password-recovery', authController.passwordRecovery);

router.post('/verify-recovery-otp', authController.verifyRecoveryOTP);

router.post('/get-security-question', authController.getSecurityQuestion);

module.exports = router;
