import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeRadioCheckbox from './ThemeRadioCheckbox';

describe('ThemeRadioCheckbox', () => {
  test('renders correctly with given props', () => {
    render(
      <ThemeRadioCheckbox
        label="Test Label"
        type="radio"
        defaultChecked={true}
        dataTestId="test-label"
        classes="test-class"
        name="test-name"
      />
    );

    const inputElement = screen.getByTestId('test-label');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'radio');
    expect(inputElement).toHaveAttribute('name', 'test-name');
    expect(inputElement).toBeChecked();
  });

  test('calls onChangehandler when input changes', () => {
    const handleChange = jest.fn();
    render(
      <ThemeRadioCheckbox
        label="Test Label"
        type="checkbox"
        defaultChecked={false}
        classes="test-class"
        onChangehandler={handleChange}
      />
    );

    const inputElement = screen.getByText('Test Label');
    fireEvent.click(inputElement);
  });
});