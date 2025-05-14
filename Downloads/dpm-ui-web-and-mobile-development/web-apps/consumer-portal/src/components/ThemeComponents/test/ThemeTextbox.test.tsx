import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ThemeTextbox from '../ThemeTextbox';

describe('ThemeTextbox Component', () => {
  test('renders the input with correct type and placeholder', () => {
    const { getByPlaceholderText } = render(
      <ThemeTextbox type="text" name="test" placeholder="Enter text" />
    );
    const inputElement = getByPlaceholderText('Enter text');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('calls onChangehandler when input value changes', () => {
    const handleChange = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemeTextbox type="text" name="test" placeholder="Enter text" onChangehandler={handleChange} />
    );
    const inputElement = getByPlaceholderText('Enter text');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('calls onBlurhandler when input loses focus', () => {
    const handleBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemeTextbox type="text" name="test" placeholder="Enter text" onBlurhandler={handleBlur} />
    );
    const inputElement = getByPlaceholderText('Enter text');
    fireEvent.blur(inputElement);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('displays error message when errorValue is provided', () => {
    const { getByText } = render(
      <ThemeTextbox type="text" name="test" placeholder="Enter text" errorValue="Error message" />
    );
    const errorElement = getByText('Error message');
    expect(errorElement).toBeInTheDocument();
  });

  test('sets maxLength attribute when maxLengthIs is provided', () => {
    const { getByPlaceholderText } = render(
      <ThemeTextbox type="text" name="test" placeholder="Enter text" maxLengthIs={10} />
    );
    const inputElement = getByPlaceholderText('Enter text');
    expect(inputElement).toHaveAttribute('maxLength', '10');
  });

  test('calls onKeyDown when a key is pressed', () => {
    const handleKeyDown = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemeTextbox type="text" name="test" placeholder="Enter text" onKeyDown={handleKeyDown} />
    );
    const inputElement = getByPlaceholderText('Enter text');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  test('renders with the correct data-testid attribute', () => {
    const { getByTestId } = render(
      <ThemeTextbox type="text" name="test" placeholder="Enter text" dataTestId="textbox-testid" />
    );
    const inputElement = getByTestId('textbox-testid');
    expect(inputElement).toBeInTheDocument();
  });
});