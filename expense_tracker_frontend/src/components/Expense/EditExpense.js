import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchExpenses, editExpense } from '../../redux/slices/expenseSlice';
import './EditExpense.css'; 

const EditExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { expenses } = useSelector((state) => state.expenses);

  const [expense, setExpense] = useState({
    expenseName: '',
    amount: '',
    categoryName: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    const foundExpense = expenses.find((exp) => exp.id === parseInt(id));
    if (foundExpense) {
      setExpense({
        expenseName: foundExpense.expenseName,
        amount: foundExpense.amount,
        categoryName: foundExpense.categoryName,
        date: foundExpense.date,
        description: foundExpense.description,
      });
    }
  }, [expenses, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editExpense({ id: id, updatedData: expense })).then(() => {
      navigate('/expense/list');
    });
  };

  return (
    <div className="edit-expense-container">
      <div className="edit-expense-form-card">
        <h2>Edit Expense</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="expenseName"
              value={expense.expenseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              name="name"
              value={expense.categoryName}
              onChange={handleChange}
              required
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
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={expense.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="edit-expense-button-group">
            <button type="submit" className="edit-expense-save-button">
              Save
            </button>
            <button
              type="button"
              className="edit-expense-cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
