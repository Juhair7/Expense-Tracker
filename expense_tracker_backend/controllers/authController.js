const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAndSendOTP, verifyOTP } = require('../utils/otpService.js');
require('dotenv').config();

// Sign Up
exports.signup = async (req, res) => {
  const { username, password, mobile, email, securityQuestion, securityAnswer } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10); 
    const user = await User.create({ 
      username, 
      password: hashedPassword, 
      mobile, 
      email, 
      securityQuestion, 
      securityAnswer: hashedSecurityAnswer 
    });

    res.json({ message: 'User registered successfully.', user });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body; 
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate and send OTP for login
    await generateAndSendOTP(user);
    
    res.json({ message: 'OTP has been sent to your email for verification.' });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { username, otp } = req.body; 
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!verifyOTP(user, otp)) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err });
  }
};

// Password Recovery
exports.passwordRecovery = async (req, res) => {
  const { username } = req.body; 
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Username not found' });

    await generateAndSendOTP(user);

    res.json({ message: 'OTP has been sent to your email for verification.' });
  } catch (err) {
    res.status(500).json({ message: 'Error during password recovery', error: err });
  }
};

// Verify OTP for Password Recovery
exports.verifyRecoveryOTP = async (req, res) => {
  const { username, otp, securityAnswer, newPassword } = req.body; 
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Verify the OTP provided by the user
    if (!verifyOTP(user, otp)) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Verify Security Answer
    const isSecurityAnswerMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!isSecurityAnswerMatch) return res.status(400).json({ message: 'Incorrect security answer' });

    // Check if the new password is the same as the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) return res.status(400).json({ message: "Nice try, but that's your old password!" });

    // Hash the new password and update the user's password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error during password recovery', error: err });
  }
};

exports.getSecurityQuestion = async (req, res) => {
  const { username } = req.body;
 
  const user = await User.findOne({ where: { username } });
 
  if (user) {
    return res.json({ securityQuestion: user.securityQuestion });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};