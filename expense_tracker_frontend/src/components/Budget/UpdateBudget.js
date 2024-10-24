import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBudget, getBudgetById, clearMessages } from '../../redux/slices/budgetSlice';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateBudget.css';
const UpdateBudget = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { budget } = useSelector((state) => state.budgets);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(clearMessages());
      dispatch(getBudgetById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (budget) {
      setMonth(budget.month);
      setYear(budget.year);
      setTotalMonthlyBudget(budget.total_monthly_budget);
    }
  }, [budget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBudget({ id, budgetData: { month, year, total_monthly_budget: totalMonthlyBudget } }));
    navigate('/budget');
  };

  return (
    <div className="update-budget-container">
      <div className="update-budget-card">
        <h1 className="update-budget-title">Update Monthly Budget</h1>
        <form onSubmit={handleSubmit} className="update-budget-form">
          <div className="update-budget-readonly">
            <input
              type="text"
              value={month}
              readOnly
              className="update-budget-input readonly-input"
            />
            <input
              type="text"
              value={year}
              readOnly
              className="update-budget-input readonly-input"
            />
          </div>
          <input
            type="number"
            placeholder="Total Monthly Budget"
            value={totalMonthlyBudget}
            onChange={(e) => setTotalMonthlyBudget(e.target.value)}
            required
            className="update-budget-input"
          />
          <div className="update-budget-buttons">
            <button type="submit" className="update-budget-button">Update</button>
            <button type="button" className="cancel-button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBudget;
