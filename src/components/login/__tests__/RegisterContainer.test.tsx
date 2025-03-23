import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterContainer from '../RegisterContainer';
import { useAuthQuery } from '@/hooks/useAuthQuery';

jest.mock('@/hooks/useAuthQuery', () => ({
  useAuthQuery: jest.fn(),
}));

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('RegisterContainer', () => {
  const mockMutateAsync = jest.fn();
  const mockOnSwitchToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthQuery as jest.Mock).mockReturnValue({
      registerMutation: {
        mutateAsync: mockMutateAsync,
        isPending: false,
      },
    });
  });

  it('should render the presentation component correctly', () => {
    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should update the state when the inputs are changed', () => {
    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('Password123!');
  });

  it('should show validation error when the name is too short', async () => {
    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'Jo' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const nameError = screen.getByText(content => content.includes('al menos 3 caracteres'));
      expect(nameError).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should show validation error when the email is invalid', async () => {
    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const emailError = screen.getByText(content => content.includes('correo electrónico válido'));
      expect(emailError).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should show validation error when the password is too short', async () => {
    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pass' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const passwordError = screen.getByText(content => content.includes('al menos 8 caracteres'));
      expect(passwordError).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should show error if the password does not have special characters', async () => {
    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const passwordError = screen.getByText(content => content.includes('carácter especial'));
      expect(passwordError).toBeInTheDocument();
    });

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('should call registerMutation.mutateAsync when the form is valid', async () => {
    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });

  it('should call onSwitchToLogin after a successful registration', async () => {
    mockMutateAsync.mockResolvedValueOnce({});

    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockOnSwitchToLogin).toHaveBeenCalled();
    });
  });

  it('should show "Loading..." when isPending is true', () => {
    (useAuthQuery as jest.Mock).mockReturnValue({
      registerMutation: {
        mutateAsync: mockMutateAsync,
        isPending: true,
      },
    });

    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const loadingButton = screen.getByRole('button', { name: /loading/i });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveTextContent('Loading...');
  });

  it('should handle errors when the mutation fails', async () => {
    const mockError = new Error('Test error');
    mockMutateAsync.mockRejectedValueOnce(mockError);

    render(<RegisterContainer onSwitchToLogin={mockOnSwitchToLogin} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(mockOnSwitchToLogin).not.toHaveBeenCalled();
    });
  });
});
