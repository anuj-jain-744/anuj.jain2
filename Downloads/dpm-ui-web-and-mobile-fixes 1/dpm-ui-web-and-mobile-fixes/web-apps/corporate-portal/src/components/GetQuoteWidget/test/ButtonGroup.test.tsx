import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import  { ButtonGroup } from '../index';

jest.mock('../../../constant', () => ({
  VITE_BACKEND_BASE_URL: 'http://34.166.69.105/walaa/web/',
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
    render(<ButtonGroup next={jest.fn()} previous={jest.fn()} carouselState={{ currentSlide: 5, totalItems: 7}} />);
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