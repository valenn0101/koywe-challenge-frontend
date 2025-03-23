import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '@/lib/providers/auth-context';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should show a spinner while verifying authentication', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });

  it('should redirect to the main page if the user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should show the content if the user is authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    });

    render(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
    });
  });
});
