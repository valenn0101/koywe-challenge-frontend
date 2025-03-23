import { renderHook, waitFor } from '@testing-library/react';
import { useAuthQuery } from '../useAuthQuery';
import { useAuth } from '@/lib/providers/auth-context';
import axiosInstance from '@/lib/axios';
import { toast } from 'nextjs-toast-notify';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('nextjs-toast-notify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useAuthQuery', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: mockLogin,
      logout: mockLogout,
    });
  });

  it('returns the loginMutation function and other context values', () => {
    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    expect(result.current).toHaveProperty('loginMutation');
    expect(result.current).toHaveProperty('isAuthenticated', false);
    expect(result.current).toHaveProperty('user', null);
    expect(result.current.logout).toBe(mockLogout);
  });

  it('calls the login function of the AuthContext when loginMutation is successful', async () => {
    const mockResponse = {
      data: {
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      },
    };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    result.current.loginMutation.mutate({ email: 'test@example.com', password: 'password123' });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test-token', 'test-refresh-token', {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('shows an error toast when loginMutation fails', async () => {
    const mockError = {
      response: {
        status: 401,
        statusText: 'Unauthorized',
        data: { details: 'Credenciales inválidas' },
      },
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    result.current.loginMutation.mutate({ email: 'test@example.com', password: 'wrong-password' });

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Credenciales inválidas'),
        expect.any(Object)
      );
    });
  });

  it('handles errors without a server response correctly', async () => {
    const mockError = {
      request: {},
      message: 'Network Error',
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    result.current.loginMutation.mutate({ email: 'test@example.com', password: 'password123' });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('No se recibió respuesta del servidor'),
        expect.any(Object)
      );
    });
  });

  it('should return the registerMutation function', () => {
    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    expect(result.current).toHaveProperty('registerMutation');
    expect(result.current).toHaveProperty('isRegistering', false);
  });

  it('should execute the registration correctly when registerMutation is successful', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Registro exitoso',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      },
    };

    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    result.current.registerMutation.mutate({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(result.current.registerMutation.isSuccess).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('Cuenta creada exitosamente', expect.any(Object));
    });
  });

  it('should show an error toast when registerMutation fails', async () => {
    const mockError = {
      response: {
        status: 400,
        statusText: 'Bad Request',
        data: { details: 'El correo electrónico ya está registrado' },
      },
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    result.current.registerMutation.mutate({
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('El correo electrónico ya está registrado'),
        expect.any(Object)
      );
    });
  });

  it('should handle network errors correctly in registerMutation', async () => {
    const mockError = {
      request: {},
      message: 'Network Error',
    };

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuthQuery(), { wrapper });

    result.current.registerMutation.mutate({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('No se recibió respuesta del servidor'),
        expect.any(Object)
      );
    });
  });
});
