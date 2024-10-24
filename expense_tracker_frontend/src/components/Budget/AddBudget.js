import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBudget, clearMessages } from '../../redux/slices/budgetSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddBudget.css';

const AddBudget = () => {
  const dispatch = useDispatch();
  const { message, error, loading } = useSelector((state) => state.budgets);
  const navigate = useNavigate();
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (message) {
      setMonth('');
      setYear('');
      setTotalMonthlyBudget('');

    }
    if (error) {

    }
    dispatch(clearMessages());
  }, [message, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!month) {
      setFormError('Please select a month');
      toast.error('Please select a month');
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      setFormError('Year must be a 4-digit number');
      toast.error('Year must be a 4-digit number');
      return;
    }

    dispatch(createBudget({ month, year, total_monthly_budget: totalMonthlyBudget }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const months = Array.from({ length: 12 }, (_, i) => (
    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
      {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(0, i))}
    </option>
  ));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear + i).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));

  return (
    <div className="addbudget-container">
      <ToastContainer />
      <div className="addbudget-form-container">
        <h2 className="addbudget-title">Add New Budget</h2>
        <form onSubmit={handleSubmit} className="addbudget-form">
          <div className="form-group">
            <select value={month} onChange={(e) => setMonth(e.target.value)} required className="form-control">
              <option value="">Select Month</option>
              {months}
            </select>
          </div>

          <div className="form-group">
            <select value={year} onChange={(e) => setYear(e.target.value)} required className="form-control">
              <option value="">Select Year</option>
              {years}
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Total Monthly Budget"
              value={totalMonthlyBudget}
              onChange={(e) => setTotalMonthlyBudget(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="addbudget-buttons">
            <button type="submit" disabled={loading} className="addbudget-button">
              {loading ? 'Adding...' : 'Add Budget'}
            </button>

            <button type="button" onClick={handleCancel} className="addbudget-button cancel-button">
              Cancel
            </button>
          </div>
        </form>

        {formError && <p className="error-message">{formError}</p>}
      </div>
    </div>
  );
};

export default AddBudget;
