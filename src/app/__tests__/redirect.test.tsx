import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';
import { useAuth } from '@/lib/providers/auth-context';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/login/AuthContainer', () => {
  const MockAuthContainer = () => <div data-testid="auth-container">Mock Auth Container</div>;
  MockAuthContainer.displayName = 'AuthContainer';
  return MockAuthContainer;
});

describe('Home page redirection', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should show the loading spinner initially', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<Home />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-container')).not.toBeInTheDocument();
  });

  it('should redirect to the dashboard if the user is authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(<Home />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show the AuthContainer content if the user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-container')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
