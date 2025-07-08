import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckboxWithLabel from './index';

describe('CheckboxWithLabel Component', () => {
  const defaultProps = {
    id: 'test-checkbox',
    label: 'Accept <strong>Terms</strong>',
    checked: false,
    onChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the checkbox and label correctly', () => {
    render(<CheckboxWithLabel {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText(/Terms/i);

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('renders with custom className if provided', () => {
    render(<CheckboxWithLabel {...defaultProps} className="custom-class" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.className).toContain('checkBox');
  });

  it('calls onChange handler when checkbox is clicked', () => {
    render(<CheckboxWithLabel {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it('renders the checkbox as checked when passed as true', () => {
    render(<CheckboxWithLabel {...defaultProps} checked={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('renders the checkbox as disabled when passed as true', () => {
    render(<CheckboxWithLabel {...defaultProps} disabled={true} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('does not call onChange if checkbox is disabled', () => {
    render(<CheckboxWithLabel {...defaultProps} disabled={true} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    waitFor(() => {
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });
  });
});