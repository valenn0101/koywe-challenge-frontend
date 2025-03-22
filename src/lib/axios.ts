import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para peticiones
axiosInstance.interceptors.request.use(
  config => {
    // Aquí podrías agregar tokens de autenticación, etc.
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Manejo centralizado de errores
    return Promise.reject(error);
  }
);

export default axiosInstance;
