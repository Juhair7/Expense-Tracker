const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Budget = sequelize.define('Budget', {
  month: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  total_monthly_budget: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  remaining_monthly_budget: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Budget;
