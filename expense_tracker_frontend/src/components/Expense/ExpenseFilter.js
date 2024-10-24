import React, { useState, useEffect } from 'react';
import './ExpenseFilter.css'; 

const ExpenseFilter = ({ onFilterChange }) => {
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [filterType, setFilterType] = useState('all'); 

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleFilterChange = () => {
    if (filterType === 'all') {
      onFilterChange({ type: 'all' });
    }
    if (filterType === 'category') {
      onFilterChange({ type: 'category', category });
    }
    if (filterType === 'date') {
      onFilterChange({ type: 'date', date });
    }
    if (filterType === 'monthYear') {
      onFilterChange({ type: 'monthYear', month, year });
    }
  };

  return (
    <div className="filter-container">
      <h3 className="filter-title">Filter Expenses</h3>

      <div className="filter-group">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-input"
        >
          <option value="all">All Expenses</option>
          <option value="category">Filter by Category</option>
          <option value="date">Filter by Date</option>
          <option value="monthYear">Filter by Month/Year</option>
        </select>
      </div>

      {filterType === 'category' && (
        <div className="filter-group">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-input"
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Medicine">Medicine</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Rent">Rent</option>
            <option value="Savings">Savings</option>
            <option value="Others">Others</option>
          </select>
          <button className="filter-button" onClick={handleFilterChange}>
            Apply Category Filter
          </button>
        </div>
      )}

      {filterType === 'date' && (
        <div className="filter-group">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="filter-input"
          />
          <button className="filter-button" onClick={handleFilterChange}>
            Apply Date Filter
          </button>
        </div>
      )}

      {filterType === 'monthYear' && (
        <div className="filter-group">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="filter-input"
          >
            <option value="">Select Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="filter-input"
            min="1900"
          />
          <button className="filter-button" onClick={handleFilterChange}>
            Apply Month/Year Filter
          </button>
        </div>
      )}

      {filterType === 'all' && (
        <div className="filter-group">
          <button className="filter-button" onClick={handleFilterChange}>
            Show All Expenses
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilter;
