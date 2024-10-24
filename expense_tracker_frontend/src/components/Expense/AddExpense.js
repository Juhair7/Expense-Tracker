import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addExpense } from '../../redux/slices/expenseSlice';
import { useNavigate } from 'react-router-dom';
import './AddExpense.css'; 

const AddExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the current date in yyyy-mm-dd format
  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    expenseName: '',
    description: '',
    amount: '',
    categoryName: '',
    date: getCurrentDate(),
    receipt: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addExpense(formData));
    navigate('/expense/list');
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  useEffect(() => {
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const lastDayOfMonth = new Date(year, today.getMonth() + 1, 0).getDate();
    const minDate = `${year}-${month}-01`;
    const maxDate = `${year}-${month}-${String(lastDayOfMonth).padStart(2, '0')}`;

    const dateField = document.querySelector('input[name="date"]');
    if (dateField) {
      dateField.setAttribute('min', minDate);
      dateField.setAttribute('max', maxDate);
    }
  }, []);

  return (
    <div className="add-expense-main-container">
      <div className="add-expense-container">
        <h2 className="add-expense-title">Add New Expense</h2>
        <form className="add-expense-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="expenseName"
            placeholder="Expense Name"
            className="add-expense-input"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="add-expense-input"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            className="add-expense-input"
            onChange={handleChange}
            required
          />
          <select
            name="categoryName"
            className="add-expense-input"
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Medicine">Medicine</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Rent">Rent</option>
            <option value="Savings">Savings</option>
            <option value="Others">Others</option>
          </select>
          <input
            type="date"
            name="date"
            value={formData.date}
            className="add-expense-input"
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="receipt"
            className="add-expense-input"
            onChange={(e) => setFormData({ ...formData, receipt: e.target.files[0] })}
          />
          <div className="form-buttons">
            <button type="submit" className="add-expense-submit-button">Add </button>
            <button type="button" className="add-expense-cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
