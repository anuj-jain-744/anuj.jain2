import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomCarousel } from './index';
import { useCommonContext } from '@dpm/shared-module';

// Mock useCommonContext
jest.mock('@dpm/shared-module', () => ({
  useCommonContext: jest.fn(),
}));

// Mock ButtonGroup
jest.mock('../../pages/Sustainability/buttonGroup', () => ({
  ButtonGroup: () => <div>Mock Button Group</div>,
}));

// Mock Carousel
jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockCarouselItems = [
  {
    title: 'Item 1',
    body: 'Description 1',
    image_url: 'https://via.placeholder.com/150',
    image_alt: 'Image 1',
  },
  {
    title: 'Item 2',
    body: 'Description 2',
    image_url: 'https://via.placeholder.com/150',
    image_alt: 'Image 2',
  },
];

describe('CustomCarousel', () => {
  beforeEach(() => {
    (useCommonContext as jest.Mock).mockReturnValue({ currentLanguage: 'en' });
  });

  it('renders the carousel with items', () => {
    render(<CustomCarousel title="Test Carousel" carouselItems={mockCarouselItems} />);

    expect(screen.getByText('Test Carousel')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByAltText('Image 2')).toBeInTheDocument();
  });
});