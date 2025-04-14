import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; 
import "@testing-library/dom";
import CounterComponent from '.';

describe('CounterComponent', () => {
  const mockOnTotalChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('renders CounterComponent with initial state', () => {
    render(<CounterComponent maxLimit={5} totalLimit={0} onTotalChange={mockOnTotalChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('0');
    expect(screen.getByRole('button', { name: '-' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '+' })).toBeEnabled();
  });

  test('increments count within limits', () => {
    render(<CounterComponent maxLimit={5} totalLimit={0} onTotalChange={mockOnTotalChange} />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);
    expect(screen.getByRole('textbox')).toHaveValue('1');
    expect(mockOnTotalChange).toHaveBeenCalledWith(1);
  });

  test('prevents increment when maxLimit is reached', () => {
    render(<CounterComponent maxLimit={1} totalLimit={0} onTotalChange={mockOnTotalChange} />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(screen.getByRole('textbox')).toHaveValue('1');
    expect(window.alert).toHaveBeenCalledWith('Maximum limit for this category is 1');
  });

  test('prevents increment when totalLimit is 8 or more', () => {
    render(<CounterComponent maxLimit={5} totalLimit={8} onTotalChange={mockOnTotalChange} />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);
    expect(screen.getByRole('textbox')).toHaveValue('0');
    expect(window.alert).toHaveBeenCalledWith('Total count cannot exceed 8');
  });

  test('decrements count within limits', () => {
    render(<CounterComponent maxLimit={5} totalLimit={0} onTotalChange={mockOnTotalChange} />);
    const incrementButton = screen.getByRole('button', { name: '+' });
    const decrementButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);
    expect(screen.getByRole('textbox')).toHaveValue('0');
    expect(mockOnTotalChange).toHaveBeenCalledWith(-1);
  });

  test('prevents decrement when count is 0', () => {
    render(<CounterComponent maxLimit={5} totalLimit={0} onTotalChange={mockOnTotalChange} />);
    const decrementButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(decrementButton);
    expect(screen.getByRole('textbox')).toHaveValue('0');
    expect(mockOnTotalChange).not.toHaveBeenCalled();
  });
});