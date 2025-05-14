import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeRadioCheckbox from '../ThemeRadioCheckbox';

describe('ThemeRadioCheckbox', () => {
  test('renders the component with the correct label', () => {
    render(<ThemeRadioCheckbox label="Test Label" type="radio" classes="test-class" dataTestId="test-id" />);
    const element = screen.getByTestId('test-id');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('type', 'radio');
    waitFor(() => expect(screen.getByText('Test Label')).toBeInTheDocument());
  });

  test('applies the correct classes', () => {
    render(<ThemeRadioCheckbox label="Test Label" type="radio" classes="test-class" dataTestId="test-id" />);
    const element = screen.getByTestId('test-id');
    expect(element).toHaveClass('form-check-input');
  });

  test('handles the onChange event', () => {
    const handleChange = jest.fn();
    render(<ThemeRadioCheckbox label="Test Label" type="radio" classes="test-class" dataTestId="test-id" onChangehandler={handleChange} />);
    const element = screen.getByTestId('test-id');
    fireEvent.click(element);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('is disabled when the disabled prop is true', () => {
    render(<ThemeRadioCheckbox label="Test Label" type="radio" classes="test-class" dataTestId="test-id" disabled />);
    const element = screen.getByTestId('test-id');
    expect(element).toBeDisabled();
  });

  test('is checked when the checked prop is true', () => {
    render(<ThemeRadioCheckbox label="Test Label" type="radio" classes="test-class" dataTestId="test-id" checked />);
    const element = screen.getByTestId('test-id');
    expect(element).toBeChecked();
  });

  test('has the correct defaultChecked value', () => {
    render(<ThemeRadioCheckbox label="Test Label" type="radio" classes="test-class" dataTestId="test-id" defaultChecked />);
    const element = screen.getByTestId('test-id');
    expect(element).toBeChecked();
  });

  test('has the correct name attribute', () => {
    render(<ThemeRadioCheckbox label="Test Label" type="radio" classes="test-class" dataTestId="test-id" name="test-name" />);
    const element = screen.getByTestId('test-id');
    expect(element).toHaveAttribute('name', 'test-name');
  });
});