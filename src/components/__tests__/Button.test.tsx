import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-sm');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gray-200');
  });

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: /outline/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('border');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: /large/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-base');
    expect(button).toHaveClass('px-6');
  });

  it('passes additional props to the button element', () => {
    render(<Button data-testid="test-button">Test</Button>);
    const button = screen.getByTestId('test-button');

    expect(button).toBeInTheDocument();
  });
});
