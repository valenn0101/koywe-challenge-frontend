'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'nextjs-toast-notify';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  login: (accessToken: string, refreshToken: string, userData?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [requestInterceptor, setRequestInterceptor] = useState<number | null>(null);
  const [responseInterceptor, setResponseInterceptor] = useState<number | null>(null);

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

        const reqInterceptor = axiosInstance.interceptors.request.use(
          config => {
            if (storedAccessToken) {
              config.headers.Authorization = `Bearer ${storedAccessToken}`;
            }
            return config;
          },
          error => Promise.reject(error)
        );

        const resInterceptor = axiosInstance.interceptors.response.use(
          response => response,
          async error => {
            return Promise.reject(error);
          }
        );

        setRequestInterceptor(reqInterceptor);
        setResponseInterceptor(resInterceptor);
      }
    } catch (error) {
      toast.error(`Error al recuperar tokens: ${error}`, {
        duration: 4000,
        position: 'bottom-center',
      });
    }

    return () => {
      if (requestInterceptor !== null) {
        axiosInstance.interceptors.request.eject(requestInterceptor);
      }
      if (responseInterceptor !== null) {
        axiosInstance.interceptors.response.eject(responseInterceptor);
      }
    };
  }, []);

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
