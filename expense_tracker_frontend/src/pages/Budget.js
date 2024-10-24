import React from 'react';
import { Link } from 'react-router-dom';
import './Budget.css'; // Importing CSS file for additional styling

const Budget = () => {
  return (
    <div className="budget-container">
      <h1 className="budget-title">Budget Management</h1>
      <ul className="budget-list">
        <li><Link className="budget-link" to="/budgets/create">Add Budget</Link></li>
        <li><Link className="budget-link" to="/budgets">Get All Budgets</Link></li>
      </ul>
    </div>
  );
};

export default Budget;
