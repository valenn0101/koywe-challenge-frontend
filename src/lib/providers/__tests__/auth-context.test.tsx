import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../auth-context';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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
  const auth = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{auth.isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user-email">{auth.user?.email || 'no-user'}</div>
      <button onClick={() => auth.logout()} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  const mockPush = jest.fn();
  const mockUse = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (axiosInstance.interceptors.request.use as jest.Mock).mockImplementation(mockUse);

    window.localStorage.clear();
  });

  it('starts with isAuthenticated as false if there is no token', () => {
    render(<TestComponent />, { wrapper });
    expect(screen.getByTestId('auth-status').textContent).toBe('false');
    expect(screen.getByTestId('user-email').textContent).toBe('no-user');
  });

  it('sets isAuthenticated to true if there is a token in localStorage', () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    render(<TestComponent />, { wrapper });
    expect(screen.getByTestId('auth-status').textContent).toBe('true');
  });

  it('configures the axios interceptor when there is a token', () => {
    localStorage.setItem('accessToken', 'test-token');
    render(<TestComponent />, { wrapper });

    expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  it('executes logout and deletes the tokens', async () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    render(<TestComponent />, { wrapper });
    expect(screen.getByTestId('auth-status').textContent).toBe('true');

    act(() => {
      screen.getByTestId('logout-button').click();
    });

    await waitFor(() => {
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
