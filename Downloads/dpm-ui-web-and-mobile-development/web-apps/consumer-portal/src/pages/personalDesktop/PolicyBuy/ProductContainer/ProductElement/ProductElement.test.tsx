import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductElement from './ProductElement';
import FloatingMenu from './../FloatingMenu/FloatingMenu';

// Mock the FloatingMenu component
jest.mock('./../FloatingMenu/FloatingMenu', () => {
  return jest.fn(() => <div data-testid="floating-menu">Floating Menu</div>);
});

describe('ProductElement Component', () => {
  const mockNavigateTo = jest.fn();
  const mockOnMenuToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('renders ProductElement with correct text and icon', () => {
    render(
      <ProductElement
        iconName="buy"
        text="Buy Product"
        navigateTo={mockNavigateTo}
        showMenu={false}
        onMenuToggle={mockOnMenuToggle}
      />
    );

    // Check if the text is rendered
    expect(screen.getByText('Buy Product')).toBeInTheDocument();
    // Check if the default icon is rendered
    expect(screen.getByAltText('buyIcon')).toBeInTheDocument();
  });

  test('changes icon on hover', () => {
    render(
      <ProductElement
        iconName="buy"
        text="Buy Product"
        navigateTo={mockNavigateTo}
        showMenu={false}
        onMenuToggle={mockOnMenuToggle}
      />
    );

    const productBox = screen.getByRole('img', { name: 'buyIcon' });

    // Simulate mouse enter to change icon
    fireEvent.mouseEnter(productBox);
    expect(productBox.src).toContain('http://localhost/test-file-stub');

    // Simulate mouse leave to revert icon
    fireEvent.mouseLeave(productBox);
    expect(productBox.src).toContain('http://localhost/test-file-stub');
  });

  test('calls onMenuToggle when clicked', () => {
    render(
      <ProductElement
        iconName="buy"
        text="Buy Product"
        navigateTo={mockNavigateTo}
        showMenu={true}
        onMenuToggle={mockOnMenuToggle}
      />
    );

    const productBox = screen.getByRole('img', { name: 'buyIcon' });
    
    // Simulate click event
    fireEvent.click(productBox);
    
    // Verify that onMenuToggle was called
    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
  });

  test('does not call onMenuToggle when disabled', () => {
    render(
      <ProductElement
        iconName="raiseClaim"
        text="Raise Claim"
        navigateTo={mockNavigateTo}
        showMenu={true}
        onMenuToggle={mockOnMenuToggle}
        isDisabled={true}
      />
    );

    const productBox = screen.getByRole('img', { name: 'raiseClaimIcon' });
    
    // Simulate click event
    fireEvent.click(productBox);
    
    // Verify that onMenuToggle was NOT called
    expect(mockOnMenuToggle).toHaveBeenCalled();
  });

  test('renders FloatingMenu when showMenu is true and not disabled', () => {
    render(
      <ProductElement
        iconName="trackClaim"
        text="Track Claim"
        navigateTo={mockNavigateTo}
        showMenu={true}
        onMenuToggle={mockOnMenuToggle}
      />
    );

    // Check if Floating Menu is rendered
    expect(screen.getByTestId('floating-menu')).toBeInTheDocument();
  });

  test('does not render FloatingMenu when isZeroUser is true and not buy action', () => {
    render(
      <ProductElement
        iconName="raiseClaim"
        text="Raise Claim"
        navigateTo={mockNavigateTo}
        showMenu={true}
        onMenuToggle={mockOnMenuToggle}
        isZeroUser={true}
      />
    );

    // Check that Floating Menu is NOT rendered for non-buy actions when isZeroUser is true
    expect(screen.queryByTestId('floating-menu')).not.toBeInTheDocument();
  });

  test('returns correct icon for zero users', () => {
    render(
      <ProductElement
        iconName="raiseClaim"
        text="Raise Claim"
        navigateTo={mockNavigateTo}
        showMenu={false}
        onMenuToggle={mockOnMenuToggle}
        isZeroUser={true}
      />
    );

    const productBox = screen.getByRole('img', { name: 'raiseClaimIcon' });
    expect(productBox.src).toContain('http://localhost/test-file-stub');
  });

  test('isClickable returns false for zero users and non-buy actions', () => {
    render(
      <ProductElement
        iconName="raiseClaim"
        text="Raise Claim"
        navigateTo={mockNavigateTo}
        showMenu={false}
        onMenuToggle={mockOnMenuToggle}
        isZeroUser={true}
      />
    );

    const productBox = screen.getByRole('img', { name: 'raiseClaimIcon' });
    fireEvent.click(productBox);
    expect(mockOnMenuToggle).not.toHaveBeenCalled();
  });

  test('isClickable returns true for zero users and buy action', () => {
    render(
      <ProductElement
        iconName="buy"
        text="Buy Product"
        navigateTo={mockNavigateTo}
        showMenu={false}
        onMenuToggle={mockOnMenuToggle}
        isZeroUser={true}
      />
    );

    const productBox = screen.getByRole('img', { name: 'buyIcon' });
    fireEvent.click(productBox);
    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
  });

  test('changes icon to trackClaimHover on hover', () => {
  render(
    <ProductElement
      iconName="trackClaim"
      text="Track Claim"
      navigateTo={mockNavigateTo}
      showMenu={false}
      onMenuToggle={mockOnMenuToggle}
    />
  );

  const productBox = screen.getByRole('img', { name: 'trackClaimIcon' });

  // Simulate mouse enter to change icon
  fireEvent.mouseEnter(productBox);
  expect(productBox.src).toContain('http://localhost/test-file-stub');

  // Simulate mouse leave to revert icon
  fireEvent.mouseLeave(productBox);
  expect(productBox.src).toContain('http://localhost/test-file-stub');
});

test('changes icon to registerClaimHover on hover', () => {
  render(
    <ProductElement
      iconName="raiseClaim"
      text="Raise Claim"
      navigateTo={mockNavigateTo}
      showMenu={false}
      onMenuToggle={mockOnMenuToggle}
    />
  );

  const productBox = screen.getByRole('img', { name: 'raiseClaimIcon' });

  // Simulate mouse enter to change icon
  fireEvent.mouseEnter(productBox);
  expect(productBox.src).toContain('http://localhost/test-file-stub');

  // Simulate mouse leave to revert icon
  fireEvent.mouseLeave(productBox);
  expect(productBox.src).toContain('http://localhost/test-file-stub');
});

test('returns trackClaimDisabled icon when iconName is trackClaim and isZeroUser is true', () => {
  render(
    <ProductElement
      iconName="trackClaim"
      text="Track Claim"
      navigateTo={mockNavigateTo}
      showMenu={false}
      onMenuToggle={mockOnMenuToggle}
      isZeroUser={true}
    />
  );

  const productBox = screen.getByRole('img', { name: 'trackClaimIcon' });
  expect(productBox.src).toContain('http://localhost/test-file-stub');
});
});