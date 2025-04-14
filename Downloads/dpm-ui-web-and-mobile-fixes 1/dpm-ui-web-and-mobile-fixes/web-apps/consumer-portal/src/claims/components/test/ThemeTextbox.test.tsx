import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeTextbox from '../ThemeTextbox';

describe('ThemeTextbox Component', () => {
  test('renders ThemeTextbox with required props', () => {
    render(<ThemeTextbox type="text" name="username" placeholder="Enter username" />);
    
    const inputElement = screen.getByPlaceholderText('Enter username');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveAttribute('name', 'username');
  });

  test('renders ThemeTextbox with optional props', () => {
    render(
      <ThemeTextbox
        type="password"
        name="password"
        placeholder="Enter password"
        value="testpassword"
        maxLengthIs={10}
        errorValue="Error message"
      />
    );

    const inputElement = screen.getByPlaceholderText('Enter password');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'password');
    expect(inputElement).toHaveAttribute('name', 'password');
    expect(inputElement).toHaveAttribute('value', 'testpassword');
    expect(inputElement).toHaveAttribute('maxLength', '10');

    const errorElement = screen.getByText('Error message');
    expect(errorElement).toBeInTheDocument();
  });

  test('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    render(
      <ThemeTextbox
        type="text"
        name="username"
        placeholder="Enter username"
        onChangehandler={handleChange}
      />
    );

    const inputElement = screen.getByPlaceholderText('Enter username');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('calls onBlur handler when input loses focus', () => {
    const handleBlur = jest.fn();
    render(
      <ThemeTextbox
        type="text"
        name="username"
        placeholder="Enter username"
        onBlurhandler={handleBlur}
      />
    );

    const inputElement = screen.getByPlaceholderText('Enter username');
    fireEvent.blur(inputElement);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});