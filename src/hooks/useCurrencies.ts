import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      const response = await axiosInstance.get<string[]>('/quote/currencies/all');
      return response.data;
    },
  });
}
