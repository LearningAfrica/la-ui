import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';

export const useApiClient = () => {

const VITE_API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      // If 401 and not login or register logout
      if (
        error.response.status === 401 &&
        !['/auth/login/', '/auth/register/'].includes(error.config.url)
      ) {
        useAuth().logout(); // Adjust based on your auth storage
        window.location.href = '/login'; // Redirect to login page
      }
    }
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

// Interceptor to add authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuth().access_token; // Adjust based on your auth storage
    if (token) {
      config.headers['Authorization'] = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

return apiClient;
}
// export default apiClient;
