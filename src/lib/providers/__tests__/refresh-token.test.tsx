import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../auth-context';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '@/lib/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('axios');
jest.mock('@/lib/axios', () => ({
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
  post: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('js-cookie', () => ({
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('nextjs-toast-notify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

function TestComponent() {
  const { refreshTokens, isAuthenticated, user } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{String(isAuthenticated)}</div>
      <div data-testid="user-info">{user ? JSON.stringify(user) : 'no-user'}</div>
      <button onClick={() => refreshTokens()} data-testid="refresh-button">
        Refresh Tokens
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

describe('RefreshToken Functionality', () => {
  const mockPush = jest.fn();
  const mockRefreshResponse = {
    data: {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (axios.post as jest.Mock).mockResolvedValue(mockRefreshResponse);
  });

  it('should update the tokens when refreshTokens is called successfully', async () => {
    localStorage.setItem('accessToken', 'old-access-token');
    localStorage.setItem('refreshToken', 'old-refresh-token');

    const { getByTestId } = renderWithProviders(<TestComponent />);

    expect(getByTestId('auth-status').textContent).toBe('true');

    act(() => {
      getByTestId('refresh-button').click();
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
      expect(localStorage.getItem('accessToken')).toBe('new-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
    });
  });

  it('should log out when the refresh token fails', async () => {
    localStorage.setItem('accessToken', 'old-access-token');
    localStorage.setItem('refreshToken', 'old-refresh-token');

    (axios.post as jest.Mock).mockRejectedValue(new Error('Token expirado'));

    const { getByTestId } = renderWithProviders(<TestComponent />);

    expect(getByTestId('auth-status').textContent).toBe('true');

    act(() => {
      getByTestId('refresh-button').click();
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should configure the axios interceptors correctly when starting', async () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    renderWithProviders(<TestComponent />);

    await waitFor(() => {
      expect(axiosInstance.interceptors.request.eject).toHaveBeenCalled();
      expect(axiosInstance.interceptors.response.eject).toHaveBeenCalled();
      expect(axiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(axiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });
});
