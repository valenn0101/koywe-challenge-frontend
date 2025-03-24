import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CurrencyCard from '../CurrencyCard';
import getCurrencyInfo from '@/helper/getCurrencyInfo';

jest.mock('@/helper/getCurrencyInfo', () => jest.fn());

describe('CurrencyCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrencyInfo as jest.Mock).mockReturnValue({
      name: 'Bitcoin',
      color: 'bg-orange-100',
      icon: <span data-testid="mock-icon">BTC-Icon</span>,
    });
  });

  it('should render currency information correctly', () => {
    render(<CurrencyCard currency="BTC" />);

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(getCurrencyInfo).toHaveBeenCalledWith('BTC');
  });

  it('should apply the correct color class', () => {
    render(<CurrencyCard currency="BTC" />);

    const card = screen.getByRole('heading', { name: 'BTC' }).closest('.rounded-lg');
    expect(card).toHaveClass('bg-orange-100');
  });

  it('should render arrow button', () => {
    render(<CurrencyCard currency="BTC" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should work with different currencies', () => {
    (getCurrencyInfo as jest.Mock).mockReturnValue({
      name: 'Ethereum',
      color: 'bg-blue-100',
      icon: <span data-testid="mock-icon">ETH-Icon</span>,
    });

    render(<CurrencyCard currency="ETH" />);

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    const card = screen.getByRole('heading', { name: 'ETH' }).closest('.rounded-lg');
    expect(card).toHaveClass('bg-blue-100');
  });
});
