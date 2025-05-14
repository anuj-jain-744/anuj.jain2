import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductContainer from './ProductContainer';
import * as reactRedux from 'react-redux';

// Mock ProductElement component
jest.mock('./ProductElement/ProductElement', () => {
  return jest.fn(({ text, onMenuToggle }) => (
    <div data-testid="mock-product-element" onClick={onMenuToggle}>
      {text}
    </div>
  ));
});

// Mock useAddress hook
jest.mock('hook/home/useAddress', () => ({
  useAddress: jest.fn(() => ({
    data: { data: { addresses: [{ id: 'address1' }] } },
    isLoading: false,
    error: null,
  })),
}));

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock react-router-dom's useNavigate hook
const mockedUsedNavigate = jest.fn(); // Define the mock for navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('ProductContainer Component', () => {
  beforeEach(() => {
    // Mock useSelector to return specific values
    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        auth: { userInfo: { userId: '12345' } },
        policy: { policies: [{ policyNo: '001', endorsementNo: 'A123' }] },
      })
    );

    // Mock useDispatch to return a mock dispatch function
    (reactRedux.useDispatch as jest.Mock).mockReturnValue(jest.fn());

    jest.clearAllMocks(); // Clear previous mocks
  });

  test('renders ProductContainer with mocked ProductElements', () => {
    render(
      <Router>
        <ProductContainer languageData={{ buy_policy: 'Buy Policy', raise_a_claim: 'Raise a Claim', track_claim: 'Track Claim' }} />
      </Router>
    );

    // Check if mocked ProductElements are rendered
    const productElements = screen.getAllByTestId('mock-product-element');
    expect(productElements).toHaveLength(3); // Ensure three ProductElements are rendered
  });

  test('renders correct text for each product', () => {
    render(
      <Router>
        <ProductContainer languageData={{ buy_policy: 'Buy Policy', raise_a_claim: 'Raise a Claim', track_claim: 'Track Claim' }} />
      </Router>
    );

    // Check if correct text is rendered for each product
    expect(screen.getByText('Buy Policy')).toBeInTheDocument();
    expect(screen.getByText('Raise a Claim')).toBeInTheDocument();
    expect(screen.getByText('Track Claim')).toBeInTheDocument();
  });

  test('calls handleMenuToggle and navigates to /track-claim when Track Claim is clicked', () => {
    render(
      <Router>
        <ProductContainer languageData={{ buy_policy: 'Buy Policy', raise_a_claim: 'Raise a Claim', track_claim: 'Track Claim' }} />
      </Router>
    );

    // Find the Track Claim element and click it
    const trackClaimElement = screen.getByText('Track Claim');
    
    fireEvent.click(trackClaimElement);

    // Check if navigate was called with the correct URL
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/track-claim');
  });

  test('toggles active menu on product click', () => {
    render(
      <Router>
        <ProductContainer languageData={{ buy_policy: 'Buy Policy', raise_a_claim: 'Raise a Claim', track_claim: 'Track Claim' }} />
      </Router>
    );

    const buyElement = screen.getByText('Buy Policy');

    // Click to toggle menu for Buy Policy
    fireEvent.click(buyElement);

  });
});
