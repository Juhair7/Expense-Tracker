import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgetById, clearMessages } from '../../redux/slices/budgetSlice';
import { useParams, useNavigate } from 'react-router-dom';
import './GetBudgetById.css';

const GetBudgetById = () => {
  const dispatch = useDispatch();
  const { budget } = useSelector((state) => state.budgets);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(clearMessages());
      dispatch(getBudgetById(id));
    }
  }, [dispatch, id]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  return (
    <div className="getbudget-container">
      <div className="getbudget-card">
        <h1 className="getbudget-title">Budget Details</h1>
        {budget ? (
          <div className="getbudget-info">
            <p><strong>ID:</strong> {budget.id}</p>
            <p><strong>Month:</strong> {budget.month}</p>
            <p><strong>Year:</strong> {budget.year}</p>
            <p><strong>Total Monthly Budget:</strong>  ₹{budget.total_monthly_budget}</p>
            <p><strong>Remaining Monthly Budget:</strong>  ₹{budget.remaining_monthly_budget}</p>
            <p><strong>Created At:</strong> {formatDate(budget.createdAt)}</p>
            <p><strong>Updated At:</strong> {formatDate(budget.updatedAt)}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="getbudget-close-button-container">
          <button
            className="getbudget-close-button"
            onClick={() => navigate('/budget')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetBudgetById;
