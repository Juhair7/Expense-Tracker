import React from 'react';
import { Link } from 'react-router-dom';
import './Expense.css'; // Import the corresponding CSS file

const ExpensePage = () => {
  return (
    <div className="expense-container">
      <h1 className="expense-title">Expense Management</h1>
      <div className="expense-buttons">
        <Link to="/expense/add">
          <button className="expense-button">Add Expense</button>
        </Link>
        <Link to="/expense/list">
          <button className="expense-button">View Expenses</button>
        </Link>
        <Link to="/expense-prediction">
          <button className="expense-button">Predict Next Year Expenses</button>
        </Link>
      </div>
    </div>
  );
};

export default ExpensePage;
