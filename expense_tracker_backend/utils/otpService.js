const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or another email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Generate and send OTP
const generateAndSendOTP = async (user) => {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Set expiration time to 10 minutes from now
  await user.save();

  return otp;
};

const verifyOTP = (user, otp) => {
  const isOtpValid = user.otp === otp;
  const isExpired = user.otpExpires < new Date();
  return isOtpValid && !isExpired;
};

module.exports = { generateAndSendOTP, verifyOTP };
