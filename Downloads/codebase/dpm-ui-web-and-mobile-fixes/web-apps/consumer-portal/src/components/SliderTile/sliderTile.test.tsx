import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SliderTile from './SliderTile';

jest.mock('@dpm/shared-module', () => ({
  getAmountText: jest.fn((value) => `₹${value}`),
}));

const mockLanguageData = {
  sum_insured: 'sum_insured',
};

describe('SliderTile Component', () => {
  const defaultProps = {
    heading: 'Test Slider',
    sliderValue: 50,
    min: 0,
    max: 100,
    step: 10,
    onChange: jest.fn(),
    currencySymbol: '₹',
    minMaxValues: [0, 100],
    infoText: 'Info Text',
    infoImage: 'info-image.png',
    sliderType: 'sum_insured',
    languageData: mockLanguageData,
  };

  test('renders SliderTile with required props', () => {
    render(<SliderTile {...defaultProps} />);
    expect(screen.getByText('Test Slider')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('calls onChange when slider value changes', () => {
    render(<SliderTile {...defaultProps} />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 60 } });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('renders slider background dynamically', () => {
    render(<SliderTile {...defaultProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveStyle('background: linear-gradient(to right, #185A7D 50%, #E8EFF2 50%)');
  });

  test('renders min and max values', () => {
    render(<SliderTile {...defaultProps} />);
    expect(screen.getByText('₹0')).toBeInTheDocument();
    expect(screen.getByText('₹100')).toBeInTheDocument();
  });

  test('renders infoText and infoImage when provided', () => {
    render(<SliderTile {...defaultProps} />);
    expect(screen.getByText('Info Text')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'info-image.png');
  });

  test('does not render infoText and infoImage when not provided', () => {
    const { infoText, infoImage, ...propsWithoutInfo } = defaultProps;
    render(<SliderTile {...propsWithoutInfo} />);
    expect(screen.queryByText('Info Text')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

});