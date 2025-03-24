import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardContainer from '../DashboardContainer';
import { useAuth } from '@/lib/providers/auth-context';
import { useCurrencies } from '@/hooks/useCurrencies';

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/useCurrencies', () => ({
  useCurrencies: jest.fn(),
}));

interface MockDashboardPresentationProps {
  userName?: string;
  currencies: string[];
  isLoading: boolean;
}

jest.mock('../DashboardPresentation', () => {
  return function MockDashboardPresentation(props: MockDashboardPresentationProps) {
    return (
      <div data-testid="dashboard-presentation">
        <div data-testid="user-name">{props.userName}</div>
        <div data-testid="currencies">{props.currencies.join(', ')}</div>
        <div data-testid="is-loading">{props.isLoading.toString()}</div>
      </div>
    );
  };
});

describe('DashboardContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass user data to presentation component', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'John Doe', id: '1', email: 'john@example.com' },
    });

    (useCurrencies as jest.Mock).mockReturnValue({
      data: ['BTC', 'ETH', 'ARS'],
      isLoading: false,
    });

    render(<DashboardContainer />);

    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('currencies')).toHaveTextContent('BTC, ETH, ARS');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('should handle loading state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });

    (useCurrencies as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<DashboardContainer />);

    expect(screen.getByTestId('user-name')).toBeEmptyDOMElement();
    expect(screen.getByTestId('currencies')).toHaveTextContent('');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
  });

  it('should handle empty currencies', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'John Doe', id: '1', email: 'john@example.com' },
    });

    (useCurrencies as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<DashboardContainer />);

    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('currencies')).toHaveTextContent('');
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
  });

  it('should provide undefined data with fallback to empty array', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { name: 'John Doe', id: '1', email: 'john@example.com' },
    });

    (useCurrencies as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(<DashboardContainer />);

    expect(screen.getByTestId('currencies')).toHaveTextContent('');
  });
});
