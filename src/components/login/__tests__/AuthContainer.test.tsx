import { render, screen, fireEvent } from '@testing-library/react';
import AuthContainer from '../AuthContainer';
import LoginContainer from '../LoginContainer';
import RegisterContainer from '../RegisterContainer';

jest.mock('../LoginContainer', () => jest.fn());
jest.mock('../RegisterContainer', () => jest.fn());

describe('AuthContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (LoginContainer as jest.Mock).mockImplementation(({ onRegisterClick }) => (
      <div data-testid="login-container">
        <button data-testid="register-button" onClick={onRegisterClick}>
          Mock Register
        </button>
      </div>
    ));

    (RegisterContainer as jest.Mock).mockImplementation(({ onSwitchToLogin }) => (
      <div data-testid="register-container">
        <button data-testid="login-button" onClick={onSwitchToLogin}>
          Mock Login
        </button>
      </div>
    ));
  });

  it('should render the LoginContainer by default', () => {
    render(<AuthContainer />);

    expect(screen.getByTestId('login-container')).toBeInTheDocument();
    expect(screen.queryByTestId('register-container')).not.toBeInTheDocument();
  });

  it('should change to the RegisterContainer when the register button is clicked', () => {
    render(<AuthContainer />);

    const registerButton = screen.getByTestId('register-button');
    fireEvent.click(registerButton);

    expect(screen.queryByTestId('login-container')).not.toBeInTheDocument();
    expect(screen.getByTestId('register-container')).toBeInTheDocument();
  });

  it('should go back to the LoginContainer when the login button is clicked', () => {
    render(<AuthContainer />);

    const registerButton = screen.getByTestId('register-button');
    fireEvent.click(registerButton);

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    expect(screen.getByTestId('login-container')).toBeInTheDocument();
    expect(screen.queryByTestId('register-container')).not.toBeInTheDocument();
  });
});
