import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeCard from '../WelcomeCard';

describe('WelcomeCard', () => {
  it('should render with user name when provided', () => {
    render(<WelcomeCard userName="John Doe" />);

    expect(screen.getByText('¡Bienvenido, John Doe!')).toBeInTheDocument();
    expect(screen.getByText(/plataforma de cotización de monedas/)).toBeInTheDocument();
  });

  it('should render without user name when not provided', () => {
    render(<WelcomeCard />);

    expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument();
    expect(screen.queryByText('¡Bienvenido, !')).not.toBeInTheDocument();
  });

  it('should include welcome message and description', () => {
    render(<WelcomeCard />);

    const welcomeText = screen.getByText(/Bienvenido a la plataforma de cotización de monedas/);
    expect(welcomeText).toBeInTheDocument();
    expect(screen.getByText(/encontrarás la lista de monedas disponibles/)).toBeInTheDocument();
  });

  it('should render user icon', () => {
    render(<WelcomeCard />);

    const iconContainer = screen.getByText('¡Bienvenido!').closest('div');
    expect(iconContainer).toBeInTheDocument();
  });
});
