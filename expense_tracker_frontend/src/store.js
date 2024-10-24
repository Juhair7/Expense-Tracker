import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/slices/AuthSlice'; // Ensure this path is correct
import budgetReducer from './redux/slices/budgetSlice';
import categoryReducer from './redux/slices/categorySlice'
import expenseReducer from './redux/slices/expenseSlice'
import expensePredictionReducer from './redux/slices/expensePredictionSlice'
import reportReducer from './redux/slices/reportSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    budgets: budgetReducer,
    categories: categoryReducer,
    expenses: expenseReducer,
    expensePrediction: expensePredictionReducer,
    report:reportReducer
  },
});

export default store;
