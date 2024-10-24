import axios from 'axios';
import store from './store';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust your base URL
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
