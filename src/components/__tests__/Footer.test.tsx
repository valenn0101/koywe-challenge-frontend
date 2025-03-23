import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  beforeEach(() => {
    const mockDate = new Date(2024, 0, 1);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should show the current year in the copyright', () => {
    render(<Footer />);

    expect(
      screen.getByText(/© 2024 KoyweCurrency. Todos los derechos reservados./)
    ).toBeInTheDocument();
  });

  it('should render correctly with the expected classes', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('mt-auto');
    expect(footer).toHaveClass('bg-gray-800');
    expect(footer).toHaveClass('py-6');
    expect(footer).toHaveClass('text-white');
  });

  it('should have a centered text element', () => {
    const { container } = render(<Footer />);

    const textContainer =
      container.querySelector('.text-center') || container.querySelector('.justify-center');
    expect(textContainer).toBeInTheDocument();
  });
});
