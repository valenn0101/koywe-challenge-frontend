import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../auth-context';
import axiosInstance from '@/lib/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  },
}));

jest.mock('nextjs-toast-notify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function TestComponent() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{String(isAuthenticated)}</div>
      <div data-testid="user-info">{user ? JSON.stringify(user) : 'no-user'}</div>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
}

const queryClient = new QueryClient();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('starts with isAuthenticated as false if there is no token', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByTestId('auth-status').textContent).toBe('false');
  });

  it('sets isAuthenticated to true if there is a token in localStorage', () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com' }));

    renderWithProviders(<TestComponent />);
    expect(screen.getByTestId('auth-status').textContent).toBe('true');
  });

  it('configures the axios interceptor when there is a token', () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    renderWithProviders(<TestComponent />);

    expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
    expect(axiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  it('executes logout and deletes the tokens', () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com' }));

    renderWithProviders(<TestComponent />);

    act(() => {
      screen.getByTestId('logout-button').click();
    });

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(screen.getByTestId('auth-status').textContent).toBe('false');
  });
});
