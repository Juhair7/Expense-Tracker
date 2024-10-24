import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';  

export const fetchExpensePrediction = createAsyncThunk(
  'expensePrediction/fetchExpensePrediction',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5002/predict-expenses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Error fetching expense prediction.');
    }
  }
);

const expensePredictionSlice = createSlice({
  name: 'expensePrediction',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensePrediction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpensePrediction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; 
        toast.success("Expense Predicted for Next Year");
      })
      .addCase(fetchExpensePrediction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch expense prediction.';
        toast.error(action.payload.message);
      });
  },
});

export default expensePredictionSlice.reducer;
