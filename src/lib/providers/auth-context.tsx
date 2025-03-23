'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { toast } from 'nextjs-toast-notify';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);

        setupAxiosInterceptor(storedAccessToken);
      }
    } catch (error) {
      console.error('Error al recuperar tokens:', error);
      toast.error('Error al recuperar información de sesión', {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  }, []);

  const setupAxiosInterceptor = (token: string) => {
    try {
      axiosInstance.interceptors.request.use(
        config => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        error => {
          toast.error('Error en la solicitud HTTP', {
            duration: 4000,
            position: 'bottom-center',
          });
          return Promise.reject(error);
        }
      );
    } catch (error) {
      console.error('Error al configurar interceptor:', error);
      toast.error('Error al configurar el cliente HTTP', {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  };

  const login = (newAccessToken: string, newRefreshToken: string, userData?: User) => {
    try {
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setIsAuthenticated(true);
      if (userData) {
        setUser(userData);
      }

      setupAxiosInterceptor(newAccessToken);

      toast.success('Sesión iniciada correctamente', {
        duration: 3000,
        position: 'bottom-center',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error en el proceso de login:', error);
      toast.error('Error al iniciar sesión', {
        duration: 4000,
        position: 'bottom-center',
      });
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setUser(null);

      toast.success('Sesión cerrada correctamente', {
        duration: 3000,
        position: 'bottom-center',
      });

      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión', {
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
