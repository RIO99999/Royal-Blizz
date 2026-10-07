import axios from 'axios';

// Single Axios instance pointing at the backend API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach the JWT token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
