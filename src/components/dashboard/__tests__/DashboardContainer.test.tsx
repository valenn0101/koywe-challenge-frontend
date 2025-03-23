import { render, screen } from '@testing-library/react';
import DashboardContainer from '../DashboardContainer';
import { useAuth } from '@/lib/providers/auth-context';
import { useCurrencies } from '@/hooks/useCurrencies';

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/useCurrencies', () => ({
  useCurrencies: jest.fn(),
}));

describe('DashboardContainer', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
    });

    (useCurrencies as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the DashboardPresentation component with the correct props when there is no user', () => {
    render(<DashboardContainer />);

    expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument();
  });

  it('should pass the user name to the presentation component', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '123',
        email: 'usuario@ejemplo.com',
        name: 'Pedro',
      },
    });

    render(<DashboardContainer />);

    expect(screen.getByText('¡Bienvenido, Pedro!')).toBeInTheDocument();
  });

  it('should pass the currencies to the presentation component', () => {
    (useCurrencies as jest.Mock).mockReturnValue({
      data: ['BTC', 'ETH'],
      isLoading: false,
    });

    render(<DashboardContainer />);

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('should pass isLoading=true to the presentation component when the data is loading', () => {
    (useCurrencies as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<DashboardContainer />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should pass an empty array when data is undefined', () => {
    (useCurrencies as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(<DashboardContainer />);

    expect(screen.queryByText('BTC')).not.toBeInTheDocument();
    expect(screen.queryByText('ETH')).not.toBeInTheDocument();
  });
});
