import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeRadioCheckbox from '../ThemeRadioChexkbox';

describe('ThemeRadioCheckbox', () => {
  test('renders with given props', () => {
    render(
      <ThemeRadioCheckbox
        label="Test Label"
        type="radio"
        defaultChecked={true}
        classes="test-class"
        name="test-name"
        id="test-id"
        value="test-value"
        disabled={false}
        checked={true}
        datatestid="test-datatestid"
      />
    );

    const inputElement = screen.getByTestId('test-datatestid');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'radio');
    expect(inputElement).toHaveAttribute('name', 'test-name');
    expect(inputElement).toHaveAttribute('id', 'test-id');
    expect(inputElement).toHaveAttribute('value', 'test-value');
    expect(inputElement).toBeChecked();
    expect(inputElement).not.toBeDisabled();
  });

  test('calls onChangehandler when input is changed', () => {
    const handleChange = jest.fn();
    render(
      <ThemeRadioCheckbox
        label="Test Label"
        type="checkbox"
        onChangehandler={handleChange}
        datatestid="test-datatestid"
      />
    );

    const inputElement = screen.getByTestId('test-datatestid');
    fireEvent.click(inputElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});