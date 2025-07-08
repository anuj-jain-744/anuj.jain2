import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeRadioCheckbox from '../ThemeRadioCheckbox';

describe('ThemeRadioCheckbox', () => {
  test('renders correctly with given props', () => {
    render(
      <ThemeRadioCheckbox
        label="Test Label"
        type="radio"
        defaultChecked={true}
        classes="test-class"
        name="test-name"
      />
    );

    waitFor(() => {
    const inputElement = screen.getByLabelText('Test Label');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('test-class');
    expect(inputElement).toHaveAttribute('type', 'radio');
    expect(inputElement).toHaveAttribute('name', 'test-name');
    expect(inputElement).toBeChecked();

    });
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

    waitFor(() => {
        const inputElement = screen.getByLabelText('Test Label');
        fireEvent.click(inputElement);
        expect(handleChange).toHaveBeenCalledTimes(1);
     });
  });
});