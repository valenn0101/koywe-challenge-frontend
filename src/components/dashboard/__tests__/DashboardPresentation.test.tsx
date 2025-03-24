import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPresentation from '../DashboardPresentation';

jest.mock('../components/WelcomeCard', () => {
  return function MockWelcomeCard({ userName }: { userName?: string }) {
    return <div data-testid="welcome-card">Welcome {userName}</div>;
  };
});

jest.mock('../components/CurrenciesList', () => {
  return function MockCurrenciesList({
    currencies,
    isLoading,
  }: {
    currencies: string[];
    isLoading: boolean;
  }) {
    return (
      <div data-testid="currencies-list">
        Currencies List: {currencies.join(', ')}
        {isLoading && <span>Loading...</span>}
      </div>
    );
  };
});

jest.mock('../components/CreateQuoteForm', () => {
  return function MockCreateQuoteForm({ currencies }: { currencies: string[] }) {
    return <div data-testid="create-quote-form">Create Quote Form: {currencies.join(', ')}</div>;
  };
});

jest.mock('../components/UserQuotes', () => {
  return function MockUserQuotes() {
    return <div data-testid="user-quotes">User Quotes</div>;
  };
});

describe('DashboardPresentation', () => {
  it('should render all components when data is loaded', () => {
    render(
      <DashboardPresentation
        userName="John Doe"
        currencies={['BTC', 'ETH', 'ARS']}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('welcome-card')).toBeInTheDocument();
    expect(screen.getByTestId('create-quote-form')).toBeInTheDocument();
    expect(screen.getByTestId('currencies-list')).toBeInTheDocument();
    expect(screen.getByTestId('user-quotes')).toBeInTheDocument();

    expect(screen.getByTestId('welcome-card')).toHaveTextContent('Welcome John Doe');
    expect(screen.getByTestId('create-quote-form')).toHaveTextContent(
      'Create Quote Form: BTC, ETH, ARS'
    );
    expect(screen.getByTestId('currencies-list')).toHaveTextContent(
      'Currencies List: BTC, ETH, ARS'
    );
  });

  it('should not show create quote form when loading', () => {
    render(<DashboardPresentation userName="John Doe" currencies={[]} isLoading={true} />);

    expect(screen.getByTestId('welcome-card')).toBeInTheDocument();
    expect(screen.queryByTestId('create-quote-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('currencies-list')).toHaveTextContent('Loading');
    expect(screen.getByTestId('user-quotes')).toBeInTheDocument();
  });

  it('should not show create quote form when currencies are empty', () => {
    render(<DashboardPresentation userName="John Doe" currencies={[]} isLoading={false} />);

    expect(screen.getByTestId('welcome-card')).toBeInTheDocument();
    expect(screen.queryByTestId('create-quote-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('currencies-list')).toBeInTheDocument();
    expect(screen.getByTestId('user-quotes')).toBeInTheDocument();
  });

  it('should render with undefined userName', () => {
    render(<DashboardPresentation currencies={['BTC', 'ETH', 'ARS']} isLoading={false} />);

    expect(screen.getByTestId('welcome-card')).toHaveTextContent('Welcome');
    expect(screen.getByTestId('create-quote-form')).toBeInTheDocument();
    expect(screen.getByTestId('currencies-list')).toBeInTheDocument();
    expect(screen.getByTestId('user-quotes')).toBeInTheDocument();
  });
});
