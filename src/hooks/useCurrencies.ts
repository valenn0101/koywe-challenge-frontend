import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/lib/providers/auth-context';

interface CreateQuoteRequest {
  amount: number;
  from: string;
  to: string;
}

interface Quote {
  id: string;
  amount: number;
  from: string;
  to: string;
  exchangeRate: number;
  result: number;
  timestamp: string;
}

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
  });
}
