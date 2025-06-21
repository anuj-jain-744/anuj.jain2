import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleButton from './ToggleButton';

describe('ToggleButton', () => {
  test('renders with default props', () => {
    render(<ToggleButton />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('displays custom labels', () => {
    render(<ToggleButton leftLabel="On" rightLabel="Off" />);
    expect(screen.getByText('On')).toBeInTheDocument();
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  test('calls onChange with true when left label is clicked', () => {
    const handleChange = jest.fn();
    render(<ToggleButton onChange={handleChange} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('calls onChange with false when right label is clicked', () => {
    const handleChange = jest.fn();
    render(<ToggleButton onChange={handleChange} />);
    fireEvent.click(screen.getByText('No'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  test('applies correct styles based on isActive prop', () => {
    const { rerender } = render(<ToggleButton isActive={true} />);
    expect(screen.getByText('Yes')).toHaveClass('text');
    expect(screen.getByText('No')).toHaveClass('text');

    rerender(<ToggleButton isActive={false} />);
    expect(screen.getByText('Yes')).toHaveClass('text');
    expect(screen.getByText('No')).toHaveClass('text');
  });
});