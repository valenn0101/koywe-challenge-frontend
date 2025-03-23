import { renderHook, waitFor } from '@testing-library/react';
import { useCurrencies } from '../useCurrencies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { ReactNode } from 'react';

jest.mock('@/lib/axios', () => ({
  get: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'QueryClientProviderWrapper';

  return Wrapper;
};

describe('useCurrencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data correctly when the API responds successfully', async () => {
    const mockData = ['BTC', 'ETH', 'USDT'];
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: mockData,
    });

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(axiosInstance.get).toHaveBeenCalledWith('/quote/currencies/all');
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Error de red');
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
  });

  it('should set isLoading to true while loading data', () => {
    (axiosInstance.get as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
