import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/lib/providers/auth-context';
import { CreateQuoteRequest, Quote } from '@/types/quote';

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
