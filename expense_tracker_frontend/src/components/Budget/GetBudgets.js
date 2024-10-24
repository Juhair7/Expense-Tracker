import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgets, selectBudgets } from '../../redux/slices/budgetSlice';
import { useNavigate } from 'react-router-dom';
import './GetBudgets.css';

const GetBudgets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { budgets } = useSelector(selectBudgets);

  useEffect(() => {
    dispatch(getBudgets());
  }, [dispatch]);


  const handleUpdate = (id) => {
    navigate(`/budgets/update/${id}`);
  };


  const handleView = (id) => {
    navigate(`/budgets/getbudget/${id}`);
  };

  return (
    <div className="budgetlist-container">
      <h1 className="budgetlist-title">All Budgets</h1>
      <div className="budgetlist-grid">
        {budgets.map((budget) => (
          <div key={budget.id} className="budgetlist-item">
            <h6>Budget ID: {budget.id}</h6>
            <h6>Month: {budget.month}</h6>
            <h6>Year: {budget.year}</h6>
            <h6>Total Monthly Budget:  ₹{budget.total_monthly_budget}</h6>
            <h6>Remaining Monthly Budget:  ₹{budget.remaining_monthly_budget}</h6>
            <div className="budgetlist-buttons">
              <button className="budgetlist-view-button" onClick={() => handleView(budget.id)}>View</button>
              <button className="budgetlist-update-button" onClick={() => handleUpdate(budget.id)}>Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetBudgets;
