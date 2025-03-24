import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CurrenciesList from '../CurrenciesList';

jest.mock('../CurrencyCard', () => {
  return function MockCurrencyCard({ currency }: { currency: string }) {
    return <div data-testid={`currency-card-${currency}`}>{currency}</div>;
  };
});

describe('CurrenciesList', () => {
  const mockCurrencies = ['BTC', 'ETH', 'ARS'];

  it('should render all currencies', () => {
    render(<CurrenciesList currencies={mockCurrencies} isLoading={false} />);

    expect(screen.getByText('Monedas Disponibles')).toBeInTheDocument();
    expect(screen.getByTestId('currency-card-BTC')).toBeInTheDocument();
    expect(screen.getByTestId('currency-card-ETH')).toBeInTheDocument();
    expect(screen.getByTestId('currency-card-ARS')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoading is true', () => {
    render(<CurrenciesList currencies={mockCurrencies} isLoading={true} />);

    expect(screen.getByText('Monedas Disponibles')).toBeInTheDocument();
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByTestId('currency-card-BTC')).not.toBeInTheDocument();
  });

  it('should toggle currencies visibility when header is clicked', () => {
    render(<CurrenciesList currencies={mockCurrencies} isLoading={false} />);

    const header = screen.getByText('Monedas Disponibles').closest('div');

    expect(screen.getByTestId('currency-card-BTC')).toBeInTheDocument();

    fireEvent.click(header as HTMLElement);

    expect(screen.queryByTestId('currency-card-BTC')).not.toBeInTheDocument();

    fireEvent.click(header as HTMLElement);

    expect(screen.getByTestId('currency-card-BTC')).toBeInTheDocument();
  });

  it('should render no currencies when array is empty', () => {
    render(<CurrenciesList currencies={[]} isLoading={false} />);

    expect(screen.getByText('Monedas Disponibles')).toBeInTheDocument();
    expect(screen.queryByTestId(/currency-card/)).not.toBeInTheDocument();
  });
});
