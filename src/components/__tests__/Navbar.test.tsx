import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { useAuth } from '@/lib/providers/auth-context';

jest.mock('@/lib/providers/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('Navbar', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show the login button when the user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });

    render(<Navbar />);

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
  });

  it('should show the user name and logout button when the user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Usuario Prueba', email: 'test@example.com', id: '1' },
      logout: mockLogout,
    });

    render(<Navbar />);

    expect(screen.getByText('Usuario Prueba')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
  });

  it('should show the email if there is no user name when the user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', id: '1' },
      logout: mockLogout,
    });

    render(<Navbar />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should call the logout function when the logout button is clicked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Usuario Prueba', email: 'test@example.com', id: '1' },
      logout: mockLogout,
    });

    render(<Navbar />);

    fireEvent.click(screen.getByText('Cerrar Sesión'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
