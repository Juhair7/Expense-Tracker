// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/budget'; // Adjust according to your backend endpoint

// // Fetch JWT token from local storage
// const getToken = () => {
//   return localStorage.getItem('token');
// };

// // Async Thunks
// export const createBudget = createAsyncThunk('budgets/create', async (budgetData, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(`${API_URL}/create`, budgetData, {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     });
//     return response.data; // Return response data (including success message)
//   } catch (error) {
//     return rejectWithValue(error.response.data.message); // Return error message from backend
//   }
// });

// export const getBudgets = createAsyncThunk('budgets/getAll', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`${API_URL}/list`, {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     });
//     return response.data; // Return response data
//   } catch (error) {
//     return rejectWithValue(error.response.data.message); // Return error message
//   }
// });

// export const getBudgetById = createAsyncThunk('budgets/getById', async (id, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`${API_URL}/get/${id}`, {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     });
//     return response.data; // Return budget data
//   } catch (error) {
//     return rejectWithValue(error.response.data.message); // Return error message
//   }
// });

// export const updateBudget = createAsyncThunk('budgets/update', async ({ budgetData }, { rejectWithValue }) => {
//   try {
//     const response = await axios.put(`${API_URL}/update`, budgetData, {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     });
//     return response.data; // Return updated budget data
//   } catch (error) {
//     return rejectWithValue(error.response.data.message); // Return error message
//   }
// });

// // Create slice
// const budgetSlice = createSlice({
//   name: 'budgets',
//   initialState: {
//     budgets: [], // List of budgets
//     budget: null, // Selected budget
//     loading: false, // Loading state
//     error: null, // Error state
//     message: null, // Success or information messages from the backend
//   },
//   reducers: {
//     clearMessages: (state) => {
//       state.message = null; // Clear success messages
//       state.error = null;   // Clear error messages
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create Budget
//       .addCase(createBudget.fulfilled, (state, action) => {
//         state.budgets.push(action.payload.budget); // Add created budget to the list
//         state.message = action.payload.message; // Display success message from the backend
//         state.error = null; // Clear any previous errors
//       })
//       .addCase(createBudget.rejected, (state, action) => {
//         state.error = action.payload; // Set error message
//         state.message = null; // Clear success message
//       })
//       // Get All Budgets
//       .addCase(getBudgets.fulfilled, (state, action) => {
//         state.budgets = action.payload; // Set the list of budgets
//         state.message = "Budgets fetched successfully"; // Success message
//         state.error = null; // Clear errors
//       })
//       .addCase(getBudgets.rejected, (state, action) => {
//         state.error = action.payload; // Set error message
//         state.message = null; // Clear success message
//       })
//       // Get Budget By ID
//       .addCase(getBudgetById.fulfilled, (state, action) => {
//         state.budget = action.payload; // Set the selected budget
//         state.message = "Budget fetched successfully"; // Success message
//         state.error = null; // Clear errors
//       })
//       .addCase(getBudgetById.rejected, (state, action) => {
//         state.error = action.payload; // Set error message
//         state.message = null; // Clear success message
//       })
//       // Update Budget
//       .addCase(updateBudget.fulfilled, (state, action) => {
//         const index = state.budgets.findIndex((budget) => budget.id === action.payload.id);
//         if (index !== -1) {
//           state.budgets[index] = action.payload; // Update the specific budget
//         }
//         state.message = "Budget updated successfully"; // Success message
//         state.error = null; // Clear errors
//       })
//       .addCase(updateBudget.rejected, (state, action) => {
//         state.error = action.payload; // Set error message
//         state.message = null; // Clear success message
//       })
//       // Handle loading states
//       .addMatcher(
//         (action) => action.type.endsWith('/pending'),
//         (state) => {
//           state.loading = true;
//           state.message = null;
//           state.error = null;
//         }
//       )
//       .addMatcher(
//         (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
//         (state) => {
//           state.loading = false;
//         }
//       );
//   },
// });

// // Selector to access the budgets state
// export const selectBudgets = (state) => state.budgets; // Return the whole budgets state

// export const { clearMessages } = budgetSlice.actions; // Export clearMessages action

// export default budgetSlice.reducer; // Export the reducer

//================================================================


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

const API_URL = 'http://localhost:5000/api/budget'; // Adjust according to your backend endpoint

// Fetch JWT token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// Async Thunks
export const createBudget = createAsyncThunk('budgets/create', async (budgetData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/create`, budgetData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Return response data (including success message)
  } catch (error) {
    return rejectWithValue(error.response.data.message); // Return error message from backend
  }
});

export const getBudgets = createAsyncThunk('budgets/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Return response data
  } catch (error) {
    return rejectWithValue(error.response.data.message); // Return error message
  }
});

export const getBudgetById = createAsyncThunk('budgets/getById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/get/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Return budget data
  } catch (error) {
    return rejectWithValue(error.response.data.message); // Return error message
  }
});

export const updateBudget = createAsyncThunk('budgets/update', async ({ budgetData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/update`, budgetData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data; // Return updated budget data
  } catch (error) {
    return rejectWithValue(error.response.data.message); // Return error message
  }
});

// Create slice
const budgetSlice = createSlice({
  name: 'budgets',
  initialState: {
    budgets: [], // List of budgets
    budget: null, // Selected budget
    loading: false, // Loading state
    error: null, // Error state
    message: null, // Success or information messages from the backend
  },
  reducers: {
    clearMessages: (state) => {
      state.message = null; // Clear success messages
      state.error = null;   // Clear error messages
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Budget
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload.budget); // Add created budget to the list
        state.message = action.payload.message; // Display success message from the backend
        state.error = null; // Clear any previous errors
        toast.success('Budget created successfully!'); // Toast notification
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.error = action.payload; // Set error message
        state.message = null; // Clear success message
        toast.error(action.payload); // Toast notification for error
      })
      // Get All Budgets
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.budgets = action.payload; // Set the list of budgets
        state.message = "Budgets fetched successfully"; // Success message
        state.error = null; // Clear errors
        toast.info('Budgets fetched successfully!'); // Toast notification
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.error = action.payload; // Set error message
        state.message = null; // Clear success message
        toast.error(action.payload); // Toast notification for error
      })
      // Get Budget By ID
      .addCase(getBudgetById.fulfilled, (state, action) => {
        state.budget = action.payload; // Set the selected budget
        state.message = "Budget fetched successfully"; // Success message
        state.error = null; // Clear errors
        toast.info('Budget fetched successfully!'); // Toast notification
      })
      .addCase(getBudgetById.rejected, (state, action) => {
        state.error = action.payload; // Set error message
        state.message = null; // Clear success message
        toast.error(action.payload); // Toast notification for error
      })
      // Update Budget
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex((budget) => budget.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload; // Update the specific budget
        }
        state.message = "Budget updated successfully"; // Success message
        state.error = null; // Clear errors
        toast.success('Budget updated successfully!'); // Toast notification
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.error = action.payload; // Set error message
        state.message = null; // Clear success message
        toast.error(action.payload); // Toast notification for error
      })
      // Handle loading states
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.message = null;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

// Selector to access the budgets state
export const selectBudgets = (state) => state.budgets; // Return the whole budgets state

export const { clearMessages } = budgetSlice.actions; // Export clearMessages action

export default budgetSlice.reducer; // Export the reducer
