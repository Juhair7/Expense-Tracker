const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false }, // Added email
  securityQuestion: { type: DataTypes.STRING, allowNull: false },
  securityAnswer: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING }, 
  otpExpiry: { type: DataTypes.DATE },
});

module.exports = User;
