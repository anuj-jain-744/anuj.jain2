import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductTab, { ButtonGroup } from '../ProductTab';
import CarouselItems from '../CarouselItems';

jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('reactjs-flip-card', () => ({
  __esModule: true,
  default: jest.fn(({ frontComponent, backComponent }) => (
    <div data-testid="mock-flip-card">
      <div className="front">{frontComponent}</div>
      <div className="back">{backComponent}</div>
    </div>
  )),
}));

describe('src/components/ProductCatelog/ProductTab.tsx - <ButtonGroup/>', () => {
  it('should render previous and next buttons', () => {
    render(<ButtonGroup next={jest.fn()} previous={jest.fn()} carouselState={{ currentSlide: 0, totalItems: 5 }} />);
    expect(screen.getByTestId('carouselButtonPrevious')).toBeInTheDocument();
    expect(screen.getByTestId('carouselButtonNext')).toBeInTheDocument();
  });

  it('should disable previous button on first slide', () => {
    render(<ButtonGroup next={jest.fn()} previous={jest.fn()} carouselState={{ currentSlide: 0, totalItems: 5 }} />);
    expect(screen.getByTestId('carouselButtonPrevious')).toHaveClass('disable');
  });

  it('should disable next button on last slide', () => {
    render(<ButtonGroup next={jest.fn()} previous={jest.fn()} carouselState={{ currentSlide: 5, totalItems: 8}} />);
    expect(screen.getByTestId('carouselButtonNext')).toHaveClass('disable');
  });

  it('should call next function on next button click', () => {
    const nextMock = jest.fn();
    render(<ButtonGroup next={nextMock} previous={jest.fn()} carouselState={{ currentSlide: 0, totalItems: 5 }} />);
    fireEvent.click(screen.getByTestId('carouselButtonNext'));
    expect(nextMock).toHaveBeenCalled();
  });

  it('should call previous function on previous button click', () => {
    const previousMock = jest.fn();
    render(<ButtonGroup next={jest.fn()} previous={previousMock} carouselState={{ currentSlide: 1, totalItems: 5 }} />);
    fireEvent.click(screen.getByTestId('carouselButtonPrevious'));
    expect(previousMock).toHaveBeenCalled();
  });
});