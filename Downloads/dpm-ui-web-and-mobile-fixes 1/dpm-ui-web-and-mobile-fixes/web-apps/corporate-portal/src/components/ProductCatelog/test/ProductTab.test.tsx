import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductTab from '../ProductTab';

// Mock Carousel and CarouselItems components
jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: React.forwardRef(({ children }: { children: React.ReactNode }, ref) => (
    <div>{children}</div>
  )),
}));

jest.mock('../CarouselItems', () => ({
  __esModule: true,
  default: ({ item, index, isMobileOrTablet, flippedIndex, onCardClick }: any) => (
    <div data-testid={`carousel-item-${index}`} onClick={() => onCardClick(index)}>
      {item.name}
    </div>
  ),
}));

const mockCompData = {
  Tab1: [{ name: 'Item 1' }, { name: 'Item 2' }],
  Tab2: [{ name: 'Item 3' }, { name: 'Item 4' }],
};

describe('ProductTab', () => {
  test('renders tabs and items correctly', () => {
    render(<ProductTab compData={mockCompData} />);

    // Check if tabs are rendered
    expect(screen.getByText('Tab1')).toBeInTheDocument();
    expect(screen.getByText('Tab2')).toBeInTheDocument();

    // Check if items for the first tab are rendered
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('switches tabs correctly', () => {
    render(<ProductTab compData={mockCompData} />);

    // Click on the second tab
    fireEvent.click(screen.getByText('Tab2'));

    // Check if items for the second tab are rendered
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Item 4')).toBeInTheDocument();
  });
});