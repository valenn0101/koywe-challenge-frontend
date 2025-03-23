import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPresentation from '../DashboardPresentation';

// Mock react-icons para que no cause problemas en los tests
jest.mock('react-icons/fa', () => ({
  FaCoins: () => <div data-testid="fa-coins">FaCoins</div>,
  FaUser: () => <div data-testid="fa-user">FaUser</div>,
  FaBitcoin: () => <div data-testid="fa-bitcoin">FaBitcoin</div>,
  FaEthereum: () => <div data-testid="fa-ethereum">FaEthereum</div>,
  FaDollarSign: () => <div data-testid="fa-dollar-sign">FaDollarSign</div>,
  FaMoneyBillWave: () => <div data-testid="fa-money-bill-wave">FaMoneyBillWave</div>,
  FaArrowRight: () => <div data-testid="fa-arrow-right">FaArrowRight</div>,
  FaDog: () => <div data-testid="fa-dog">FaDog</div>,
  FaChevronDown: () => <div data-testid="fa-chevron-down">FaChevronDown</div>,
  FaChevronUp: () => <div data-testid="fa-chevron-up">FaChevronUp</div>,
}));

jest.mock('react-icons/si', () => ({
  SiDogecoin: () => <div data-testid="si-dogecoin">SiDogecoin</div>,
  SiStellar: () => <div data-testid="si-stellar">SiStellar</div>,
}));

jest.mock('react-icons/gi', () => ({
  GiCrystalGrowth: () => <div data-testid="gi-crystal-growth">GiCrystalGrowth</div>,
}));

describe('DashboardPresentation', () => {
  const defaultProps = {
    userName: '',
    currencies: ['BTC', 'ETH', 'USDT'],
    isLoading: false,
  };

  it('should render the dashboard with the user name', () => {
    render(<DashboardPresentation {...defaultProps} userName="Juan" />);

    expect(screen.getByText('¡Bienvenido, Juan!')).toBeInTheDocument();
  });

  it('should show a loading spinner when isLoading is true', () => {
    render(<DashboardPresentation {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('fa-chevron-up')).toBeInTheDocument();
    expect(screen.queryByText('BTC')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Monedas Disponibles' })).toBeInTheDocument();

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should show the currencies correctly', () => {
    render(<DashboardPresentation {...defaultProps} />);

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('USDT')).toBeInTheDocument();

    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Tether')).toBeInTheDocument();
  });

  it('should be able to fold and unfold the currencies section', () => {
    render(<DashboardPresentation {...defaultProps} />);

    expect(screen.getByTestId('fa-chevron-up')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();

    const header = screen.getByRole('heading', { name: 'Monedas Disponibles' }).parentElement
      ?.parentElement;
    if (header) {
      fireEvent.click(header);
    }

    expect(screen.getByTestId('fa-chevron-down')).toBeInTheDocument();
    expect(screen.queryByText('BTC')).not.toBeInTheDocument();

    if (header) {
      fireEvent.click(header);
    }

    expect(screen.getByTestId('fa-chevron-up')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('should show different icons for different currencies', () => {
    const currencies = ['BTC', 'ETH', 'USDT', 'XEM', 'DOGE', 'SHIB', 'XLM', 'ARS', 'CLP'];
    render(<DashboardPresentation {...defaultProps} currencies={currencies} />);

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('USDT')).toBeInTheDocument();
    expect(screen.getByText('XEM')).toBeInTheDocument();
    expect(screen.getByText('DOGE')).toBeInTheDocument();
    expect(screen.getByText('SHIB')).toBeInTheDocument();
    expect(screen.getByText('XLM')).toBeInTheDocument();
    expect(screen.getByText('ARS')).toBeInTheDocument();
    expect(screen.getByText('CLP')).toBeInTheDocument();
  });
});
