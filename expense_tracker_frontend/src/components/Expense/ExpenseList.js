import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, deleteExpense } from '../../redux/slices/expenseSlice';
import { useNavigate } from 'react-router-dom';
import ExpenseFilter from './ExpenseFilter';
import './ExpenseList.css'; 
import { toast } from 'react-toastify';

const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, errorMessage } = useSelector((state) => state.expenses);
  const navigate = useNavigate();

  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [isFiltered, setIsFiltered] = useState(false); 

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id));
    }
  };

  const handleFilterChange = (filterData) => {
    let results;

    switch (filterData.type) {
      case 'category':
        results = expenses.filter(expense => expense.categoryName === filterData.category);
        break;
      case 'date':
        results = expenses.filter(expense => new Date(expense.date).toISOString().split('T')[0] === filterData.date);
        break;
      case 'monthYear':
        results = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() + 1 === parseInt(filterData.month) && expenseDate.getFullYear() === parseInt(filterData.year);
        });
        break;
      default:
        results = expenses;
        break;
    }

    setFilteredExpenses(results);
    setIsFiltered(results.length < expenses.length); 
    if (results.length === 0 && results.length < expenses.length) {
      toast.info("No expenses found"); 
    }
  };

  return (
    <div className="expense-list-container">
      <h2 className="expense-list-title">Expense List</h2>

      <ExpenseFilter onFilterChange={handleFilterChange} />

      {errorMessage ? null : (
        <>
          {filteredExpenses.length === 0 && !isFiltered ? (
            <p>No expenses available.</p> 
          ) : (
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.expenseName}</td>
                    <td> ₹{expense.amount}</td>
                    <td>{expense.categoryName}</td>
                    <td>{expense.date}</td>
                    <td>
                      <button className="action-button view-button" onClick={() => navigate(`/expense/view/${expense.id}`)}>View</button>
                      <button className="action-button edit-button" onClick={() => navigate(`/expense/edit/${expense.id}`)}>Edit</button>
                      <button className="action-button delete-button" onClick={() => handleDelete(expense.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseList;
