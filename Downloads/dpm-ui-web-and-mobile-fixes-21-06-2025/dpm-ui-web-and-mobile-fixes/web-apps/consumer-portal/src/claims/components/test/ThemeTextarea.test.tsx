import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeTextarea from '../ThemeTextarea';

describe('ThemeTextarea Component', () => {
  test('renders with given placeholder and classes', () => {
    render(<ThemeTextarea placeholder="Enter text" classes="custom-class" />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('custom-class');
  });

  test('calls onChangehandler when text is entered', () => {
    const handleChange = jest.fn();
    render(<ThemeTextarea placeholder="Enter text" onChangehandler={handleChange} />);
    
    const textarea = screen.getByPlaceholderText('Enter text');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});