import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const getToken = () => {
  return localStorage.getItem('token');
};

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const createCategory = (categoryData) => API.post('/category/add', categoryData);
export const getCategories = () => API.get('/category/list');
export const updateCategory = (id, data) => API.put(`/category/edit/${id}`, data);
export const deleteCategory = (id) => API.delete(`/category/delete/${id}`);
export const getCategoryById = (id) => API.get(`/category/get/${id}`);

export const createCategoryThunk = createAsyncThunk('categories/create', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await createCategory(categoryData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getCategoriesThunk = createAsyncThunk('categories/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await getCategories();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const getCategoryByIdThunk = createAsyncThunk('categories/getById', async (id, { rejectWithValue }) => {
  try {
    const response = await getCategoryById(id);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateCategoryThunk = createAsyncThunk('categories/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateCategory(id, data);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteCategoryThunk = createAsyncThunk('categories/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await deleteCategory(id);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    message: null,
    currentCategory: null, // For editing
  },
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    setCurrentCategory(state, action) {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory(state) {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.category);
        state.message = action.payload.message;
        toast.success(action.payload.message); 
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message); 
      })
      .addCase(getCategoriesThunk.fulfilled, (state, action) => {
        state.categories = action.payload;
        toast.success("Categories fetched Successfully"); 
      })
      .addCase(getCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message); 
      })
      .addCase(getCategoryByIdThunk.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
        toast.success("Category fetched Successfully");
      })
      .addCase(getCategoryByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message); 
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat.id !== action.meta.arg);
        state.message = action.payload.message;
        toast.success(action.payload.message); 
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message); 
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat.id === action.meta.arg.id);
        if (index !== -1) {
          state.categories[index] = action.payload.category;
        }
        state.message = action.payload.message;
        toast.success(action.payload.message); 
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message); 
      });
  },
});

export const { clearMessage, setCurrentCategory, clearCurrentCategory } = categorySlice.actions;

export default categorySlice.reducer;
