import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { toast } from 'sonner';

const api: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    switch (status) {
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied. You do not have permission.');
        break;
      case 429:
        toast.error('Too many requests. Please wait a moment.');
        break;
      case 500: case 502: case 503:
        toast.error('Server error. Please try again later.');
        break;
      default:
        if (!error.response) toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;

export const checkApiHealth = async (): Promise<boolean> => {
  try { await api.get('/health', { timeout: 5000 }); return true; }
  catch { return false; }
};
