'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { toast } from 'nextjs-toast-notify';
import Cookies from 'js-cookie';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (accessToken: string, refreshToken: string, userData?: User) => void;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        setupAxiosInterceptors();
      }
    } catch (error) {
      toast.error(`Error al recuperar tokens: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  }, []);

  const refreshTokens = async (): Promise<boolean> => {
    try {
      if (!refreshToken) {
        throw new Error('No hay refreshToken disponible');
      }

      const response = await axios.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: userData,
      } = response.data;

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      Cookies.set('accessToken', newAccessToken, { expires: 7 });

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setIsAuthenticated(true);

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      return true;
    } catch (error) {
      toast.error(`Error al renovar tokens: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
      logout();
      return false;
    }
  };

  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
  };

  const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  const setupAxiosInterceptors = () => {
    try {
      axiosInstance.interceptors.request.eject(0);
      axiosInstance.interceptors.response.eject(0);

      axiosInstance.interceptors.request.use(
        config => {
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
        error => {
          return Promise.reject(error);
        }
      );

      axiosInstance.interceptors.response.use(
        response => response,
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

              if (success && accessToken) {
                onTokenRefreshed(accessToken);
                if (!originalRequest.headers) {
                  originalRequest.headers = {};
                }
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              isRefreshing = false;
              return Promise.reject(refreshError);
            }
          }

          return Promise.reject(error);
        }
      );
    } catch (error) {
      toast.error(`Error al configurar interceptores: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  };

  const login = (newAccessToken: string, newRefreshToken: string, userData?: User) => {
    try {
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      Cookies.set('accessToken', newAccessToken, { expires: 7 });

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setIsAuthenticated(true);

      setupAxiosInterceptors();

      router.push('/dashboard');
    } catch (error) {
      toast.error(`Error al iniciar sesión: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      Cookies.remove('accessToken');

      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setUser(null);

      queryClient.clear();

      toast.success('Sesión cerrada correctamente', {
        duration: 3000,
        position: 'bottom-center',
      });

      router.push('/');
    } catch (error) {
      toast.error(`Error al cerrar sesión: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        refreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
