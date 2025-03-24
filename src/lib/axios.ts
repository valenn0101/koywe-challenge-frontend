import axios from 'axios';
import { setupAuthInterceptors } from './interceptors/auth-interceptor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

setupAuthInterceptors(axiosInstance);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Error en la petición:', error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
