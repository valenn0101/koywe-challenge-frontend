import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserQuotes from '../UserQuotes';
import { useUserQuotes, useDeleteQuote, useReloadQuote } from '@/hooks/useCurrencies';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/hooks/useCurrencies', () => ({
  useUserQuotes: jest.fn(),
  useDeleteQuote: jest.fn(),
  useReloadQuote: jest.fn(),
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
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // Expira en 1 hora
  },
  {
    id: '2',
    from: 'ETH',
    to: 'USD',
    amount: 2,
    rate: 2000,
    convertedAmount: 4000,
    createdAt: '2024-03-24T00:00:00.000Z',
    expiresAt: new Date(Date.now() - 3600000).toISOString(), // Ya expirada
  },
];

const mockDeleteQuote = {
  mutate: jest.fn(),
  isPending: false,
};

const mockReloadQuote = {
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
    (useReloadQuote as jest.Mock).mockReturnValue(mockReloadQuote);
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

    expect(screen.getByText('ETH → USD')).toBeInTheDocument();
    expect(screen.getByText('2 ETH')).toBeInTheDocument();
    expect(screen.getByText('2000.00000000')).toBeInTheDocument();
    expect(screen.getByText('4000.00000000 USD')).toBeInTheDocument();
  });

  it('should handle quote deletion', async () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuotes,
    });

    render(<UserQuotes />, { wrapper });

    const deleteButtons = screen.getAllByTestId('delete-quote-btn');
    fireEvent.click(deleteButtons[0]);

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

    const deleteButtons = screen.getAllByTestId('delete-quote-btn');
    expect(deleteButtons[0]).toBeDisabled();
  });

  it('should handle quote reload', async () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuotes,
    });

    render(<UserQuotes />, { wrapper });

    const reloadButtons = screen.getAllByTestId('reload-quote-btn');
    fireEvent.click(reloadButtons[0]);

    await waitFor(() => {
      expect(mockReloadQuote.mutate).toHaveBeenCalledWith('1');
    });
  });

  it('should disable reload button while reload is pending', () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuotes,
    });

    (useReloadQuote as jest.Mock).mockReturnValue({
      ...mockReloadQuote,
      isPending: true,
    });

    render(<UserQuotes />, { wrapper });

    const reloadButtons = screen.getAllByTestId('reload-quote-btn');
    expect(reloadButtons[0]).toBeDisabled();
  });

  it('should show expired quote with disabled reload button', () => {
    (useUserQuotes as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuotes,
    });

    render(<UserQuotes />, { wrapper });

    const expiredLabel = screen.getAllByText('Expirado');
    expect(expiredLabel.length).toBe(1);

    // Obtenemos todos los botones de recarga
    const reloadButtons = screen.getAllByTestId('reload-quote-btn');

    // El segundo botón debería estar deshabilitado (cotización expirada)
    expect(reloadButtons[1]).toBeDisabled();
    expect(reloadButtons[1]).toHaveAttribute(
      'title',
      'No se puede recargar una cotización expirada'
    );
    expect(reloadButtons[1]).toHaveClass('cursor-not-allowed');
  });
});
