import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExpenses } from '../../redux/slices/expenseSlice';
import './ExpenseView.css'; 

const ExpenseView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expenses } = useSelector((state) => state.expenses);
  
  const expense = expenses.find((expense) => expense.id === parseInt(id));

  useEffect(() => {
    if (!expense) {
      dispatch(fetchExpenses());
    }
  }, [dispatch, expense]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace('T', ' '); 
  };

  if (!expense) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="expense-view-container">
      <section className="expense-card">
        <h2 className="expense-view-title">Expense Details</h2>
        <article className="expense-details">
          <div className="detail-item">
            <strong>Name:</strong> {expense.expenseName}
          </div>
          <div className="detail-item">
            <strong>Description:</strong> {expense.description}
          </div>
          <div className="detail-item">
            <strong>Amount:</strong>  ₹{expense.amount}
          </div>
          <div className="detail-item">
            <strong>Category:</strong> {expense.categoryName}
          </div>
          <div className="detail-item">
            <strong>Date:</strong> {expense.date}
          </div>
          <div className="detail-item">
            <strong>Created At:</strong> {formatDate(expense.createdAt)}
          </div>
          <div className="detail-item">
            <strong>Updated At:</strong> {formatDate(expense.updatedAt)}
          </div>
        </article>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </section>
    </div>
  );
};

export default ExpenseView;
