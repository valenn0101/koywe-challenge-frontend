import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/lib/providers/auth-context';
import { toast } from 'nextjs-toast-notify';
import { AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export function useAuthQuery() {
  const auth = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      try {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
        return response.data;
      } catch (error) {
        toast.error(`Error al iniciar sesión: ${error}`, {
          duration: 4000,
          position: 'bottom-center',
        });
        throw error;
      }
    },
    onSuccess: data => {
      try {
        auth.login(data.accessToken, data.refreshToken, data.user);
        toast.success(`Bienvenido${data.user?.name ? ` ${data.user.name}` : ''}`, {
          duration: 3000,
          position: 'bottom-center',
        });
      } catch (error) {
        toast.error(`Error al iniciar sesión: ${error}`, {
          duration: 4000,
          position: 'bottom-center',
        });
      }
    },
    onError: (error: AxiosError<{ details: string }>) => {
      let errorMessage = 'Error desconocido';

      if (error.response) {
        errorMessage =
          error.response.data?.details ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor';
      } else {
        errorMessage = error.message || 'Error de configuración de solicitud';
      }

      toast.error(`Error al iniciar sesión: ${errorMessage}`, {
        duration: 4000,
        progress: false,
        position: 'bottom-center',
        transition: 'bottomToTopBounce',
        icon: '',
        sound: false,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterCredentials): Promise<RegisterResponse> => {
      try {
        const response = await axiosInstance.post<RegisterResponse>('/auth/register', userData);
        return response.data;
      } catch (error) {
        toast.error(`Error al registrar usuario: ${error}`, {
          duration: 4000,
          position: 'bottom-center',
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente', {
        duration: 3000,
        position: 'bottom-center',
      });
    },
    onError: (error: AxiosError<{ details: string; message: string }>) => {
      let errorMessage = 'Error desconocido';

      if (error.response) {
        errorMessage =
          error.response.data?.details ||
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor';
      } else {
        errorMessage = error.message || 'Error de configuración de solicitud';
      }

      toast.error(`Error al registrar: ${errorMessage}`, {
        duration: 4000,
        position: 'bottom-center',
      });
    },
  });

  return {
    loginMutation,
    registerMutation,
    isAuthenticated: auth.isAuthenticated,
    isLoading: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    user: auth.user,
    logout: auth.logout,
  };
}
