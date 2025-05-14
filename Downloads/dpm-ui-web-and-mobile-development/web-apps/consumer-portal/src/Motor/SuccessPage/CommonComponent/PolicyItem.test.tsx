import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyItem from './PolicyItem'; 

describe('PolicyItem Component', () => {
  test('renders PolicyItem with correct label and value', () => {
    const label = 'Policy Number';
    const value = '12345';

    render(<PolicyItem label={label} value={value} />);

    // Check if the label is rendered correctly
    expect(screen.getByText(label)).toBeInTheDocument();

    // Check if the value is rendered correctly
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  test('applies premium class names when isPremium is true', () => {
    const label = 'Premium Amount';
    const value = '1000';

    render(<PolicyItem label={label} value={value} isPremium={true} />);

    // Check if the correct premium class names are applied
    const labelElement = screen.getByText(label);
    const valueElement = screen.getByText(value);

    expect(labelElement).toHaveClass('premium-label');
    expect(valueElement).toHaveClass('premium-value');
  });

  test('applies default class names when isPremium is false', () => {
    const label = 'Policy Number';
    const value = '12345';

    render(<PolicyItem label={label} value={value} isPremium={false} />);

    // Check if the correct policy class names are applied
    const labelElement = screen.getByText(label);
    const valueElement = screen.getByText(value);

    expect(labelElement).toHaveClass('policy-label');
    expect(valueElement).toHaveClass('policy-value');
  });

});
