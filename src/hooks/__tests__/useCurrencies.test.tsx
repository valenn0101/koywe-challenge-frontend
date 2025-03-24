import { renderHook, waitFor } from '@testing-library/react';
import { useCurrencies, useCreateQuote, useDeleteQuote, useReloadQuote } from '../useCurrencies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuth } from '@/lib/providers/auth-context';
import { toast } from 'nextjs-toast-notify';
import axios from 'axios';

jest.mock('@/lib/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
}));

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
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

describe('useDeleteQuote', () => {
  const mockToken = 'mock-token';
  const mockQuoteId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      accessToken: mockToken,
    });
  });

  it('should delete quote successfully', async () => {
    (axiosInstance.delete as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useDeleteQuote(), { wrapper });

    result.current.mutate(mockQuoteId);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(axiosInstance.delete).toHaveBeenCalledWith(`/quote/${mockQuoteId}`, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(toast.success).toHaveBeenCalledWith('Cotización eliminada correctamente', {
      position: 'bottom-center',
      duration: 5000,
    });
  });

  it('should handle quote deletion error', async () => {
    const error = new Error('Failed to delete quote');
    (axiosInstance.delete as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useDeleteQuote(), { wrapper });

    result.current.mutate(mockQuoteId);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(toast.error).toHaveBeenCalledWith(`Error al eliminar la cotización: ${error}`);
  });

  it('should handle missing token error', async () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      accessToken: null,
    });

    const { result } = renderHook(() => useDeleteQuote(), { wrapper });

    result.current.mutate(mockQuoteId);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('No hay token de acceso disponible'));
  });
});

describe('useReloadQuote', () => {
  const mockToken = 'mock-token';
  const mockQuoteId = '123';
  const mockQuoteResponse = {
    id: '123',
    from: 'BTC',
    to: 'ARS',
    amount: 1,
    rate: 50000,
    convertedAmount: 50000,
    createdAt: '2024-03-24T00:00:00.000Z',
    expiresAt: '2024-03-24T01:00:00.000Z',
    userId: 1,
    timestamp: '2024-03-24T00:00:00.000Z',
    updatedAt: '2024-03-24T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      accessToken: mockToken,
    });
  });

  it('should reload quote successfully', async () => {
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({ data: mockQuoteResponse });

    const { result } = renderHook(() => useReloadQuote(), { wrapper });

    result.current.mutate(mockQuoteId);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(axiosInstance.get).toHaveBeenCalledWith(`/quote/${mockQuoteId}`, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(toast.success).toHaveBeenCalledWith('Cotización actualizada correctamente', {
      position: 'bottom-center',
      duration: 3000,
    });
  });

  it('should handle 404 error when reloading quote', async () => {
    const mockError = {
      response: {
        status: 404,
      },
    };

    // Mock la función isAxiosError para que devuelva true con el error 404
    jest.spyOn(axios, 'isAxiosError').mockImplementationOnce(() => true);
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useReloadQuote(), { wrapper });

    result.current.mutate(mockQuoteId);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(toast.error).toHaveBeenCalledWith('La cotización ha expirado y no está disponible', {
      position: 'bottom-center',
      duration: 5000,
    });
  });

  it('should handle generic error when reloading quote', async () => {
    const error = new Error('Failed to reload quote');

    // Mock la función isAxiosError para que devuelva false con errores genéricos
    jest.spyOn(axios, 'isAxiosError').mockImplementationOnce(() => false);
    (axiosInstance.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useReloadQuote(), { wrapper });

    result.current.mutate(mockQuoteId);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(toast.error).toHaveBeenCalledWith(
      'Error al recargar la cotización: Failed to reload quote',
      {
        position: 'bottom-center',
        duration: 5000,
      }
    );
  });

  it('should handle missing token error', async () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      accessToken: null,
    });

    const { result } = renderHook(() => useReloadQuote(), { wrapper });

    result.current.mutate(mockQuoteId);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error('No hay token de acceso disponible'));
  });
});
