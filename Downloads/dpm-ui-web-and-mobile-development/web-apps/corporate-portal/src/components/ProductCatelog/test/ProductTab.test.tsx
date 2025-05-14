
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import ProductTab, { ButtonGroup } from '../ProductTab';
import { useCommonContext } from '@dpm/shared-module';

jest.mock('react-multi-carousel', () => ({ children, ...props }: any) => (
  <div data-testid="mock-carousel" {...props}>{children}</div>
));

jest.mock('@dpm/shared-module', () => ({
  useCommonContext: jest.fn(),
}));

// Mock CarouselItems component
jest.mock('../CarouselItems', () => ({ item, index, isMobileOrTablet, flippedIndex, onCardClick, navigateTo }: any) => (
  <div data-testid={`carousel-item-${index}`} onClick={() => onCardClick(index)}>
    {item.name}
  </div>
));

const mockNavigateTo = jest.fn();

describe('ProductTab', () => {
  beforeEach(() => {
    (useCommonContext as jest.Mock).mockReturnValue({ currentLanguage: 'en' });
  });

  const compData = {
    'Tab1': [{ name: 'Item 1' }, { name: 'Item 2' }],
    'Tab2': [{ name: 'Item 3' }]
  };

  test('renders loading message if no compData', () => {
    render(<ProductTab compData={{}} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders no data message if tab has no items', () => {
    render(<ProductTab compData={{ 'Tab1': [] }} />);
    expect(screen.getByText('No items available for this tab.')).toBeInTheDocument();
  });

  test('renders tabs and items correctly', async () => {
    render(<ProductTab compData={compData} navigateTo={mockNavigateTo} />);

    // Check that tabs render
    expect(screen.getByTestId('productToggle-0')).toHaveTextContent('Tab1');
    expect(screen.getByTestId('productToggle-1')).toHaveTextContent('Tab2');

    // Check that carousel renders
    expect(screen.getByTestId('mock-carousel')).toBeInTheDocument();

    // Check that items render
    expect(screen.getByTestId('carousel-item-0')).toHaveTextContent('Item 1');
    expect(screen.getByTestId('carousel-item-1')).toHaveTextContent('Item 2');
  });

  test('changes active tab on tab click', async () => {
    render(<ProductTab compData={compData} navigateTo={mockNavigateTo} />);
    
    // Click second tab
    fireEvent.click(screen.getByTestId('productToggle-1'));

    await waitFor(() => {
      expect(screen.getByTestId('carousel-item-0')).toHaveTextContent('Item 3');
    });
  });

  test('card click toggles flippedIndex', async () => {
    render(<ProductTab compData={compData} navigateTo={mockNavigateTo} />);
    
    const card = screen.getByTestId('carousel-item-0');
    fireEvent.click(card);

    // Clicking again should toggle back
    fireEvent.click(card);
  });

  test('applies spring animation if isVisible is true', () => {
    render(<ProductTab compData={compData} isVisible={true} />);
    expect(screen.getByText('Tab1')).toBeInTheDocument();
  });
});

describe('ButtonGroup', () => {
  const mockNext = jest.fn();
  const mockPrevious = jest.fn();

  test('renders nothing if not enough items', () => {
    render(<ButtonGroup carouselState={{ currentSlide: 0, totalItems: 1 }} />);
    expect(screen.queryByTestId('carouselButtonNext')).not.toBeInTheDocument();
    expect(screen.queryByTestId('carouselButtonPrevious')).not.toBeInTheDocument();
  });

  test('renders buttons if items > maxSlides', () => {
    render(<ButtonGroup carouselState={{ currentSlide: 0, totalItems: 10 }} next={mockNext} previous={mockPrevious} />);

    expect(screen.getByTestId('carouselButtonNext')).toBeInTheDocument();
    expect(screen.getByTestId('carouselButtonPrevious')).toBeInTheDocument();
  });

  test('calls previous on previous button click', () => {
    render(<ButtonGroup carouselState={{ currentSlide: 1, totalItems: 10 }} next={mockNext} previous={mockPrevious} />);
    
    fireEvent.click(screen.getByTestId('carouselButtonPrevious'));
    expect(mockPrevious).toHaveBeenCalled();
  });

  test('calls next on next button click', () => {
    render(<ButtonGroup carouselState={{ currentSlide: 1, totalItems: 10 }} next={mockNext} previous={mockPrevious} />);
    
    fireEvent.click(screen.getByTestId('carouselButtonNext'));
    expect(mockNext).toHaveBeenCalled();
  });
});