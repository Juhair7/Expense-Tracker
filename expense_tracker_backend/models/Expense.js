const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
  expenseName: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  categoryName: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  receiptUrl: { type: DataTypes.STRING, allowNull: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Expense;
