import React from 'react';
import { render, screen } from '@testing-library/react';
import DashbboardBanner from './DashboardBanner'; 
import * as reactRedux from 'react-redux';

// Mock ProductContainer component
jest.mock('./ProductContainer/ProductContainer', () => {
  return jest.fn(() => <div data-testid="mock-product-container">Mock Product Container</div>);
});

// Mock WelcomeContainer component
jest.mock('./WelcomeContainer/WelcomeContainer', () => {
  return jest.fn(({ name }) => <div data-testid="mock-welcome-container">Welcome, {name}</div>);
});

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('DashbboardBanner Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mocking useSelector to return specific values
    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        motorLanguage: { /* mock language data */ },
        auth: { userInfo: { name: 'John Doe' } },
      })
    );
  });

  test('renders DashbboardBanner with correct components', () => {
    render(<DashbboardBanner />);

    // Check if the ProductContainer is rendered
    const productContainer = screen.getByTestId('mock-product-container');
    expect(productContainer).toBeInTheDocument();

    // Check if the WelcomeContainer is rendered with the correct name
    const welcomeContainer = screen.getByTestId('mock-welcome-container');
    expect(welcomeContainer).toBeInTheDocument();
    expect(welcomeContainer).toHaveTextContent('Welcome, John Doe');
  });

  test('renders banner image', () => {
    render(<DashbboardBanner />);

    // Check if the banner image is rendered correctly
    const bannerImage = screen.getByTestId('bannerVeriation');
    expect(bannerImage).toBeInTheDocument();
  });
});
