import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateQuoteForm from '../CreateQuoteForm';
import { useCreateQuote } from '@/hooks/useCurrencies';
import { useAuth } from '@/lib/providers/auth-context';
import { toast } from 'nextjs-toast-notify';

jest.mock('@/hooks/useCurrencies', () => ({
  useCreateQuote: jest.fn(),
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

describe('CreateQuoteForm', () => {
  const mockCurrencies = ['BTC', 'ETH', 'ARS'];
  const mockAccessToken = 'mock-token';
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      accessToken: mockAccessToken,
    });

    (useCreateQuote as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it('should render the form properly', () => {
    render(<CreateQuoteForm currencies={mockCurrencies} />);

    expect(screen.getByText('Crear Nueva Cotización')).toBeInTheDocument();
    expect(screen.getByLabelText('Monto')).toBeInTheDocument();
    expect(screen.getByLabelText('Moneda de Origen')).toBeInTheDocument();
    expect(screen.getByLabelText('Moneda de Destino')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Cotización' })).toBeInTheDocument();
  });

  it('should initialize with first two currencies', () => {
    render(<CreateQuoteForm currencies={mockCurrencies} />);

    const fromSelect = screen.getByLabelText('Moneda de Origen') as HTMLSelectElement;
    const toSelect = screen.getByLabelText('Moneda de Destino') as HTMLSelectElement;

    expect(fromSelect.value).toBe('BTC');
    expect(toSelect.value).toBe('ETH');
  });

  it('should automatically change the other currency when selecting the same', () => {
    render(<CreateQuoteForm currencies={mockCurrencies} />);

    const fromSelect = screen.getByLabelText('Moneda de Origen') as HTMLSelectElement;
    const toSelect = screen.getByLabelText('Moneda de Destino') as HTMLSelectElement;

    fireEvent.change(fromSelect, { target: { value: 'ETH' } });

    expect(fromSelect.value).toBe('ETH');
    expect(toSelect.value).not.toBe('ETH');
  });

  it('should submit form with correct values', async () => {
    mockMutateAsync.mockResolvedValueOnce({
      id: '1',
      amount: 1,
      from: 'BTC',
      to: 'ARS',
      exchangeRate: 50000,
      result: 50000,
      timestamp: new Date().toISOString(),
    });

    render(<CreateQuoteForm currencies={mockCurrencies} />);

    const amountInput = screen.getByLabelText('Monto') as HTMLInputElement;
    const fromSelect = screen.getByLabelText('Moneda de Origen') as HTMLSelectElement;
    const toSelect = screen.getByLabelText('Moneda de Destino') as HTMLSelectElement;
    const submitButton = screen.getByRole('button', { name: 'Crear Cotización' });

    fireEvent.change(amountInput, { target: { value: '2' } });
    fireEvent.change(fromSelect, { target: { value: 'BTC' } });
    fireEvent.change(toSelect, { target: { value: 'ARS' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        amount: 2,
        from: 'BTC',
        to: 'ARS',
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Cotización creada exitosamente',
        expect.any(Object)
      );
    });
  });

  it('should show error toast when amount is invalid', async () => {
    render(<CreateQuoteForm currencies={mockCurrencies} />);

    const amountInput = screen.getByLabelText('Monto') as HTMLInputElement;

    fireEvent.change(amountInput, { target: { value: '0' } });

    const form = amountInput.closest('form');
    form?.addEventListener('submit', e => e.preventDefault());

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('El monto debe ser mayor a 0', expect.any(Object));
    });
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    mockMutateAsync.mockResolvedValueOnce({
      id: '1',
      amount: 1,
      from: 'BTC',
      to: 'ARS',
      exchangeRate: 50000,
      result: 50000,
      timestamp: new Date().toISOString(),
    });

    render(<CreateQuoteForm currencies={mockCurrencies} />);

    const amountInput = screen.getByLabelText('Monto') as HTMLInputElement;
    const fromSelect = screen.getByLabelText('Moneda de Origen') as HTMLSelectElement;
    const toSelect = screen.getByLabelText('Moneda de Destino') as HTMLSelectElement;
    const submitButton = screen.getByRole('button', { name: 'Crear Cotización' });

    fireEvent.change(amountInput, { target: { value: '5' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(amountInput.value).toBe('1');
      expect(fromSelect.value).toBe('');
      expect(toSelect.value).toBe('');
    });
  });
});
