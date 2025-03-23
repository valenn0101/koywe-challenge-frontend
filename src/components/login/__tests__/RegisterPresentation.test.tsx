import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPresentation from '../RegisterPresentation';

describe('RegisterPresentation', () => {
  const mockOnNameChange = jest.fn();
  const mockOnEmailChange = jest.fn();
  const mockOnPasswordChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnBackToLogin = jest.fn();

  const defaultProps = {
    name: '',
    email: '',
    password: '',
    isLoading: false,
    errors: {
      name: '',
      email: '',
      password: '',
    },
    onNameChange: mockOnNameChange,
    onEmailChange: mockOnEmailChange,
    onPasswordChange: mockOnPasswordChange,
    onSubmit: mockOnSubmit,
    onBackToLogin: mockOnBackToLogin,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<RegisterPresentation {...defaultProps} />);

    expect(screen.getByText('Currency Exchange Rate')).toBeInTheDocument();
    expect(screen.getByText('Convert currencies with ease')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show the correct values for name, email and password', () => {
    render(
      <RegisterPresentation
        {...defaultProps}
        name="John Doe"
        email="test@example.com"
        password="password123!"
      />
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123!');
  });

  it('should call onNameChange when the name input is modified', () => {
    render(<RegisterPresentation {...defaultProps} />);

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(mockOnNameChange).toHaveBeenCalledWith('John Doe');
  });

  it('should call onEmailChange when the email input is modified', () => {
    render(<RegisterPresentation {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(mockOnEmailChange).toHaveBeenCalledWith('test@example.com');
  });

  it('should call onPasswordChange when the password input is modified', () => {
    render(<RegisterPresentation {...defaultProps} />);

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });

    expect(mockOnPasswordChange).toHaveBeenCalledWith('password123!');
  });

  it('should call onSubmit when the form is submitted', () => {
    render(<RegisterPresentation {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    const form = submitButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should call onBackToLogin when the Sign In button is clicked', () => {
    render(<RegisterPresentation {...defaultProps} />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(mockOnBackToLogin).toHaveBeenCalled();
  });

  it('should show "Loading..." and disable the button when isLoading is true', () => {
    render(<RegisterPresentation {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /loading/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Loading...');
  });

  it('should show error messages when there are errors', () => {
    render(
      <RegisterPresentation
        {...defaultProps}
        errors={{
          name: 'El nombre es requerido',
          email: 'El email es requerido',
          password: 'La contraseña debe tener al menos 8 caracteres',
        }}
      />
    );

    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(screen.getByText('El email es requerido')).toBeInTheDocument();
    expect(screen.getByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument();
  });
});
