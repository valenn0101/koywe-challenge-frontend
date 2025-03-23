import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/lib/providers/auth-context';
import { toast } from 'nextjs-toast-notify';
import { AxiosError } from 'axios';

interface LoginCredentials {
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

export function useAuthQuery() {
  const auth = useAuth();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: data => {
      auth.login(data.accessToken, data.refreshToken, data.user);
    },
    onError: (error: AxiosError<{ details: string }>) => {
      console.log(error);

      const errorMessage = error.response?.data?.details || 'Error desconocido';
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

  return {
    loginMutation,
    isAuthenticated: auth.isAuthenticated,
    isLoading: loginMutation.isPending,
    user: auth.user,
    logout: auth.logout,
  };
}
