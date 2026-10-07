import axios from 'axios';

// Single Axios instance pointing at the backend API.
//
// This is the authoritative setting on Vercel: a VITE_API_URL env var there
// would be inlined at build time and would override the value below.
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
