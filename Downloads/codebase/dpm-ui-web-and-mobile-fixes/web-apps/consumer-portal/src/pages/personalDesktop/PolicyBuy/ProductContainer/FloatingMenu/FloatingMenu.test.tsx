import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingMenu from './FloatingMenu';

// Mock the Product component
jest.mock('./Product', () => {
  return jest.fn(({ iconName, action }) => (
    <div data-testid="product" data-action={action}>
      {iconName}
    </div>
  ));
});

describe('FloatingMenu Component', () => {
  const mockNavigateTo = jest.fn();
  const mockOnMenuToggle = jest.fn();
  const languageData = {
    motor: 'Motor',
    travel: 'Travel',
    home: 'Home',
    medical: 'Medical',
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('renders FloatingMenu component with products', () => {
    render(
      <FloatingMenu
        navigateTo={mockNavigateTo}
        languageData={languageData}
        onMenuToggle={mockOnMenuToggle}
        actionName="Test Action"
      />
    );

    // Check if the menu is rendered
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Check if all products are rendered with correct icons
    expect(screen.getAllByTestId('product')).toHaveLength(4);
    expect(screen.getByText('Motor')).toBeInTheDocument();
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Medical')).toBeInTheDocument();
  });

  test('calls onMenuToggle when mouse leaves', () => {
    render(
      <FloatingMenu
        navigateTo={mockNavigateTo}
        languageData={languageData}
        onMenuToggle={mockOnMenuToggle}
        actionName="Test Action"
      />
    );

    // Simulate mouse leave event
    fireEvent.mouseLeave(screen.getByRole('menu'));

    // Verify that onMenuToggle was called
    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
  });

  test('does not render menu when isHovered is false', () => {
    const { rerender } = render(
      <FloatingMenu
        navigateTo={mockNavigateTo}
        languageData={languageData}
        onMenuToggle={mockOnMenuToggle}
        actionName="Test Action"
      />
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByRole('menu'));

    rerender(
      <FloatingMenu
        navigateTo={mockNavigateTo}
        languageData={languageData}
        onMenuToggle={mockOnMenuToggle}
        actionName="Test Action"
      />
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('sets isHovered to true on mouse enter', () => {
    render(
      <FloatingMenu
        navigateTo={mockNavigateTo}
        languageData={languageData}
        onMenuToggle={mockOnMenuToggle}
        actionName="Test Action"
      />
    );

    const menu = screen.getByRole('menu');

    // Simulate mouse enter event
    fireEvent.mouseEnter(menu);

    // Verify that the menu is still rendered
    expect(menu).toBeInTheDocument();
  });

  test('sets isHovered to false and calls onMenuToggle on mouse leave', () => {
    render(
      <FloatingMenu
        navigateTo={mockNavigateTo}
        languageData={languageData}
        onMenuToggle={mockOnMenuToggle}
        actionName="Test Action"
      />
    );

    const menu = screen.getByRole('menu');

    // Simulate mouse leave event
    fireEvent.mouseLeave(menu);

    // Verify that onMenuToggle was called
    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);

    // Verify that the menu is not rendered
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});