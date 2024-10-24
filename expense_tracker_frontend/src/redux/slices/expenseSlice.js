import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast

// Set the base API URL
const API_URL = 'http://localhost:5000';

// Helper function to get JWT token from local storage
const getToken = () => localStorage.getItem('token');

// Fetch all expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/api/expenses/list`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Add a new expense
export const addExpense = createAsyncThunk('expenses/addExpense', async (expenseData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/api/expenses/add`, expenseData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    toast.success(response.data.message);  // Success toast
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || 'Error adding expense');  // Error toast
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Edit an existing expense
export const editExpense = createAsyncThunk('expenses/editExpense', async ({ id, updatedData }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/api/expenses/edit/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    toast.success(response.data.message);  // Success toast
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || 'Error editing expense');  // Error toast
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Delete an expense
export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id, thunkAPI) => {
  try {
    const response = await axios.delete(`${API_URL}/api/expenses/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    toast.success(response.data.message);  // Success toast
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message || 'Error deleting expense');  // Error toast
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Filter expenses by category
export const filterExpensesByCategory = createAsyncThunk('expenses/filterByCategory', async (filterData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/api/expenses/category`, filterData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error('Error filtering expenses by category');  // Error toast
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Filter expenses by date
export const filterExpensesByDate = createAsyncThunk('expenses/filterByDate', async (date, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/api/expenses/date`, { date }, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error('Error filtering expenses by date');  // Error toast
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Filter expenses by month and year
export const filterExpensesByMonthYear = createAsyncThunk('expenses/filterByMonthYear', async (filterData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/api/expenses/month`, filterData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error('Error filtering expenses by month and year');  // Error toast
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Slice
const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
        state.loading = false;
        toast.success("Expenses Fetched Succesfully");
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        toast.error(state.error);  // Error toast
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload.expense);
        state.successMessage = action.payload.message;
        toast.success("Expense Added Succesfully");
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex((expense) => expense.id === action.payload.expense.id);
        state.expenses[index] = action.payload.expense;
        state.successMessage = action.payload.message;
        toast.success("Expense Updated Succesfully");
      })
      .addCase(editExpense.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        toast.error(state.error);  // Error toast
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((expense) => expense.id !== action.payload.id);
        state.successMessage = action.payload.message;
        toast.success("Expense Deleted Succesfully");
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        toast.error(state.error); 
      })
      .addCase(filterExpensesByCategory.fulfilled, (state, action) => {
        state.expenses = action.payload;
        toast.success("Expense Filtered By Category Succesfully");
      })
      .addCase(filterExpensesByCategory.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        toast.error(state.error);  
      })
      .addCase(filterExpensesByDate.fulfilled, (state, action) => {
        state.expenses = action.payload;
        toast.success("Expense Filtered By Date Succesfully");
      })
      .addCase(filterExpensesByDate.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        toast.error(state.error);  // Error toast
      })
      .addCase(filterExpensesByMonthYear.fulfilled, (state, action) => {
        state.expenses = action.payload;
        toast.success("Expense Filtered By Month & Year Succesfully");
      })
      .addCase(filterExpensesByMonthYear.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        toast.error(state.error);  // Error toast
      });
  },
});

export const { clearMessage } = expensesSlice.actions;
export default expensesSlice.reducer;


