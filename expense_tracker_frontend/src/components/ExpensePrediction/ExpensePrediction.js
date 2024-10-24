import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchExpensePrediction } from '../../redux/slices/expensePredictionSlice';
import './ExpensePrediction.css'; // Import the CSS file

const ExpensePrediction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { data, status, error } = useSelector((state) => state.expensePrediction);

  useEffect(() => {
    dispatch(fetchExpensePrediction());
  }, [dispatch]);

  if (status === 'loading') {
    return <div className="loading-message">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="expense-prediction-main-container"> {/* Use correct class name */}
      <div className="expense-prediction-container">
        <h1>Expense Prediction for Next Year</h1>
        {data.length === 0 ? (
          <div>No predictions available.</div>
        ) : (
          <table className="expese-prediction-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Current Year Amount</th>
                <th>Predicted Amount (Next Year)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.category_name}</td>
                  <td>₹{item.current_year_amount.toFixed(2) || 'N/A'}</td>
                  <td>₹{item.predicted_amount.toFixed(2) || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Close Button */}
      <button className="expense-prediction-close-button" onClick={() => navigate(-1)}>
          Close
        </button>
      </div>
      
    </div>
  );
};

export default ExpensePrediction;
