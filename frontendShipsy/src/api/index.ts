
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:3000/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        API.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        return API(originalRequest);
      } catch (refreshError) {
        // Redirect to login if refresh token is invalid
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
