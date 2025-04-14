import { render, screen, fireEvent } from '@testing-library/react';
import ThemeTextarea from '../ThemeTextarea';

describe('ThemeTextarea Component', () => {
  test('renders with placeholder text', () => {
    render(<ThemeTextarea placeholder="Enter text here" />);
    const textareaElement = screen.getByPlaceholderText('Enter text here');
    expect(textareaElement).toBeInTheDocument();
  });

  test('applies custom classes', () => {
    render(<ThemeTextarea placeholder="Enter text here" classes="custom-class" />);
    const textareaElement = screen.getByPlaceholderText('Enter text here');
    expect(textareaElement).toHaveClass('custom-class');
  });

  test('calls onChange handler when text is entered', () => {
    const handleChange = jest.fn();
    render(<ThemeTextarea placeholder="Enter text here" onChangehandler={handleChange} />);
    const textareaElement = screen.getByPlaceholderText('Enter text here');
    fireEvent.change(textareaElement, { target: { value: 'New text' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders without crashing when optional props are not provided', () => {
    render(<ThemeTextarea placeholder="Enter text here" />);
    const textareaElement = screen.getByPlaceholderText('Enter text here');
    expect(textareaElement).toBeInTheDocument();
  });
});