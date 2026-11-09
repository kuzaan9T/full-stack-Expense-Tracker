import axios from 'axios';
import { useAuthStore } from '@/store/auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { token, logout } = useAuthStore.getState();
    if (error.response?.status === 401 && token) logout();
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.request && !error.response) return 'Cannot reach the server. Is the backend running?';
  return error?.message || fallback;
};
