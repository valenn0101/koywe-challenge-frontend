import { render, screen, fireEvent } from '@testing-library/react';
import LoginPresentation from '../LoginPresentation';

describe('LoginPresentation', () => {
  const mockOnEmailChange = jest.fn();
  const mockOnPasswordChange = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    email: '',
    password: '',
    isLoading: false,
    errors: {
      email: '',
      password: '',
    },
    onEmailChange: mockOnEmailChange,
    onPasswordChange: mockOnPasswordChange,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login form correctly', () => {
    render(<LoginPresentation {...defaultProps} />);

    expect(screen.getByText('Currency Exchange Rate')).toBeInTheDocument();
    expect(screen.getByText('Convert currencies with ease')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should show the email and password values correctly', () => {
    render(<LoginPresentation {...defaultProps} email="test@example.com" password="password123" />);

    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
  });

  it('should call onEmailChange when the email input is changed', () => {
    render(<LoginPresentation {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(mockOnEmailChange).toHaveBeenCalledWith('test@example.com');
  });

  it('should call onPasswordChange when the password input is changed', () => {
    render(<LoginPresentation {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(mockOnPasswordChange).toHaveBeenCalledWith('password123');
  });

  it('should call onSubmit when the form is submitted', () => {
    render(<LoginPresentation {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should show "Loading..." and disable the button when isLoading is true', () => {
    render(<LoginPresentation {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /loading.../i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Loading...');
  });

  it('should show error messages when there are errors', () => {
    render(
      <LoginPresentation
        {...defaultProps}
        errors={{
          email: 'El email es requerido',
          password: 'La contraseña debe tener al menos 6 caracteres',
        }}
      />
    );

    expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
  });
});
