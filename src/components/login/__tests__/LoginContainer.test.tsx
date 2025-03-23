import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginContainer from '../LoginContainer';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { toast } from 'nextjs-toast-notify';

jest.mock('@/hooks/useAuthQuery', () => ({
  useAuthQuery: jest.fn(),
}));

jest.mock('nextjs-toast-notify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('LoginContainer', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthQuery as jest.Mock).mockReturnValue({
      loginMutation: {
        mutate: mockMutate,
        isPending: false,
      },
    });
  });

  it('should render the login form correctly', () => {
    render(<LoginContainer />);

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should update the state when the inputs are changed', () => {
    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123!');
  });

  it('should show validation errors when the form is invalid', async () => {
    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const emailErrorText = screen.getByText('Por favor ingrese un correo electrónico válido');
      const passwordErrorText = screen.getByText('La contraseña debe tener al menos 8 caracteres');

      expect(emailErrorText).toBeInTheDocument();
      expect(passwordErrorText).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should show an error if the password does not have special characters', async () => {
    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password12345' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const passwordErrorText = screen.getByText(
        'La contraseña debe incluir al menos un carácter especial'
      );
      expect(passwordErrorText).toBeInTheDocument();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should call loginMutation.mutate when the form is valid', async () => {
    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });

  it('should show "Loading..." when isPending is true', () => {
    (useAuthQuery as jest.Mock).mockReturnValue({
      loginMutation: {
        mutate: mockMutate,
        isPending: true,
      },
    });

    render(<LoginContainer />);

    const loadingButton = screen.getByRole('button', { name: /loading/i });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveTextContent('Loading...');
  });

  it('handles errors when the mutation fails', async () => {
    const mockError = new Error('Test error');
    mockMutate.mockRejectedValueOnce(mockError);

    render(<LoginContainer />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
