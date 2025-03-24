import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'nextjs-toast-notify';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupAuthInterceptors = (axiosInstance: any) => {
  const refreshTokens = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!refreshToken) {
        throw new Error('No hay refreshToken disponible');
      }

      if (!API_URL) {
        throw new Error('No se ha configurado NEXT_PUBLIC_API_URL');
      }

      const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: userData,
      } = response.data;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return true;
    } catch (error) {
      toast.error(`Error al renovar tokens: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
      return false;
    }
  };

  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(resolve => {
            addRefreshSubscriber((token: string) => {
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const success = await refreshTokens();
          isRefreshing = false;

          if (success) {
            const newAccessToken = localStorage.getItem('accessToken');
            if (newAccessToken) {
              onTokenRefreshed(newAccessToken);
              if (!originalRequest.headers) {
                originalRequest.headers = {};
              }
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosInstance(originalRequest);
            }
          }
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
