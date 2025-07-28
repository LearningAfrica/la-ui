import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor to add authentication token if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken'); // Adjust based on your auth storage
  if (token) {
    config.headers['Authorization'] = `JWT ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
