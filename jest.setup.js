import '@testing-library/jest-dom';
jest.mock('nextjs-toast-notify', () => ({
  __esModule: true,
  default: jest.fn(),
}));
