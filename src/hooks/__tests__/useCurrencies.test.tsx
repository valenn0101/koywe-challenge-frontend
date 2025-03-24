import { renderHook, waitFor } from '@testing-library/react';
import { useCurrencies, useCreateQuote } from '../useCurrencies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/lib/providers/auth-context';

jest.mock('@/lib/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useCurrencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch currencies correctly', async () => {
    const mockCurrencies = ['BTC', 'ETH', 'ARS'];
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockCurrencies });

    const { result } = renderHook(() => useCurrencies(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockCurrencies);
    expect(axiosInstance.get).toHaveBeenCalledWith('/quote/currencies/all');
  });

  it('should handle currencies fetch error', async () => {
    const error = new Error('Failed to fetch currencies');
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCurrencies(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useCreateQuote', () => {
  const mockToken = 'mock-token';
  const mockQuoteData = {
    amount: 1,
    from: 'BTC',
    to: 'ARS',
  };

  const mockQuoteResponse = {
    id: '1',
    amount: 1,
    from: 'BTC',
    to: 'ARS',
    exchangeRate: 50000,
    result: 50000,
    timestamp: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      accessToken: mockToken,
    });
  });

  it('should create quote successfully', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: mockQuoteResponse });

    const { result } = renderHook(() => useCreateQuote(), { wrapper });

    result.current.mutate(mockQuoteData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/quote', mockQuoteData, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result.current.data).toEqual(mockQuoteResponse);
  });

  it('should handle quote creation error', async () => {
    const error = new Error('Failed to create quote');
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateQuote(), { wrapper });

    result.current.mutate(mockQuoteData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should handle missing token error', async () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      accessToken: null,
    });

    const originalConsoleError = console.error;
    console.error = jest.fn();

    const { result } = renderHook(() => useCreateQuote(), { wrapper });

    result.current.mutate(mockQuoteData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('No hay token de acceso disponible'));

    console.error = originalConsoleError;
  });

  it('should set token in axios defaults', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({ data: mockQuoteResponse });

    const { result } = renderHook(() => useCreateQuote(), { wrapper });

    result.current.mutate(mockQuoteData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(axiosInstance.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
  });
});
