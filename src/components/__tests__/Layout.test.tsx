import { render } from '@testing-library/react';
import Layout from '../Layout';

// Mock de los componentes Navbar y Footer
jest.mock('../Navbar', () => {
  const MockNavbar = () => <div data-testid="mock-navbar">Mock Navbar</div>;
  MockNavbar.displayName = 'Navbar';
  return MockNavbar;
});

jest.mock('../Footer', () => {
  const MockFooter = () => <div data-testid="mock-footer">Mock Footer</div>;
  MockFooter.displayName = 'Footer';
  return MockFooter;
});

describe('Layout', () => {
  it('should render Navbar, content and Footer', () => {
    const { getByTestId, getByText } = render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    expect(getByTestId('mock-navbar')).toBeInTheDocument();
    expect(getByTestId('mock-footer')).toBeInTheDocument();
    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('the content is inside the main with flex-1 class', () => {
    const { getByText } = render(
      <Layout>
        <div data-testid="test-content">Test content</div>
      </Layout>
    );

    const content = getByText('Test content');
    const mainElement = content.closest('main');

    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-1');
  });

  it('the main container has the flex and min-h-screen class', () => {
    const { container } = render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex');
    expect(mainContainer).toHaveClass('min-h-screen');
    expect(mainContainer).toHaveClass('flex-col');
  });
});
