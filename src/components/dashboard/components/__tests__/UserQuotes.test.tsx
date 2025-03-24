import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserQuotes from '../UserQuotes';
import { useUserQuotes, useDeleteQuote } from '@/hooks/useCurrencies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/hooks/useCurrencies', () => ({
  useUserQuotes: jest.fn(),
  useDeleteQuote: jest.fn(),
}));

const mockQuotes = [
  {
    id: '1',
    from: 'BTC',
    to: 'ARS',
    amount: 1,
    rate: 50000,
    convertedAmount: 50000,
    createdAt: '2024-03-24T00:00:00.000Z',
    expiresAt: '2024-03-24T01:00:00.000Z',
  },
];

const mockDeleteQuote = {
  mutate: jest.fn(),
  isPending: false,
};

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

describe('UserQuotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteQuote as jest.Mock).mockReturnValue(mockDeleteQuote);
  });

  it('should render loading state', () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
      data: [],
    });

    render(<UserQuotes />, { wrapper });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render error state', () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      data: [],
    });

    render(<UserQuotes />, { wrapper });
    expect(screen.getByText('Error al cargar las cotizaciones')).toBeInTheDocument();
  });

  it('should render empty state', () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    render(<UserQuotes />, { wrapper });
    expect(screen.getByText('No tienes ninguna cotización')).toBeInTheDocument();
  });

  it('should render quotes correctly', () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuotes,
    });

    render(<UserQuotes />, { wrapper });

    expect(screen.getByText('Tus Cotizaciones')).toBeInTheDocument();
    expect(screen.getByText('BTC → ARS')).toBeInTheDocument();
    expect(screen.getByText('1 BTC')).toBeInTheDocument();
    expect(screen.getByText('50000.00000000')).toBeInTheDocument();
    expect(screen.getByText('50000.00000000 ARS')).toBeInTheDocument();
  });

  it('should handle quote deletion', async () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuotes,
    });

    render(<UserQuotes />, { wrapper });

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteQuote.mutate).toHaveBeenCalledWith('1');
    });
  });

  it('should disable delete button while deletion is pending', () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuotes,
    });

    (useDeleteQuote as jest.Mock).mockReturnValue({
      ...mockDeleteQuote,
      isPending: true,
    });

    render(<UserQuotes />, { wrapper });

    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeDisabled();
  });
});
