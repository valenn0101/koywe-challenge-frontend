import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/lib/providers/auth-context';
import { CreateQuoteRequest, Quote } from '@/types/quote';
import { toast } from 'nextjs-toast-notify';
import axios from 'axios';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await axiosInstance.get<string[]>('/quote/currencies/all');
      return response.data;
    },
  });
}

export function useCreateQuote() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: CreateQuoteRequest) => {
      if (!accessToken) {
        throw new Error('No hay token de acceso disponible');
      }
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const response = await axiosInstance.post<Quote>('/quote', quoteData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userQuotes'] });
    },
  });
}

export function useUserQuotes() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['userQuotes'],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('No hay token de acceso disponible');
      }

      const response = await axiosInstance.get<Quote[]>('/quote/user/all', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    },
    refetchInterval: 30000,
    staleTime: 1000 * 60,
  });
}

export function useDeleteQuote() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string) => {
      if (!accessToken) {
        throw new Error('No hay token de acceso disponible');
      }

      const response = await axiosInstance.delete(`/quote/${quoteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userQuotes'] });
      toast.success('Cotización eliminada correctamente', {
        position: 'bottom-center',
        duration: 5000,
      });
    },
    onError: error => {
      toast.error(`Error al eliminar la cotización: ${error}`);
    },
  });
}

export function useReloadQuote() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string) => {
      if (!accessToken) {
        throw new Error('No hay token de acceso disponible');
      }

      try {
        const response = await axiosInstance.get<Quote>(`/quote/${quoteId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          throw new Error('404: Cotización no encontrada o expirada');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userQuotes'] });
      toast.success('Cotización actualizada correctamente', {
        position: 'bottom-center',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      if (error.message && error.message.includes('404')) {
        toast.error('La cotización ha expirado y no está disponible', {
          position: 'bottom-center',
          duration: 5000,
        });
      } else {
        toast.error(`Error al recargar la cotización: ${error.message}`, {
          position: 'bottom-center',
          duration: 5000,
        });
      }
    },
  });
}
