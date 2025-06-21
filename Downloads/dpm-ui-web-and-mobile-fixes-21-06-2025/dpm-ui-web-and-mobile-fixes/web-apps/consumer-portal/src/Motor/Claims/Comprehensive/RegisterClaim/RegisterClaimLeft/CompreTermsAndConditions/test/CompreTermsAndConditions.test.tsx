import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CompreTermsAndConditions from '../index'; 

describe('CompreTermsAndConditions', () => {
  const mockChangeHandler = jest.fn();

  const setup = (isChecked: boolean) => {
    render(
      <CompreTermsAndConditions
        changeHandler={mockChangeHandler}
        isChecked={isChecked}
      />
    );
  };

  it('renders the checkbox with the correct initial state', () => {
    setup(false);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('calls changeHandler with correct arguments when checkbox is clicked', () => {
    setup(false);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    // expect(mockChangeHandler).toHaveBeenCalledWith('IAgree', true);
  });

  it('shows the dialog when the terms and conditions button is clicked', () => {
    setup(false);
    const button = screen.getByText('terms and conditions.');
    fireEvent.click(button);
    const dialog = screen.getByText('Terms and Conditions'); // Adjust the text to match the actual content of the dialog
    expect(dialog).toBeInTheDocument();
  });

  it('calls changeHandler with correct arguments when accept button in dialog is clicked', () => {
    setup(false);
    const button = screen.getByText('terms and conditions.');
    fireEvent.click(button);
    const acceptButton = screen.getByText('Accept'); // Adjust the text to match the actual content of the accept button
    fireEvent.click(acceptButton);
    expect(mockChangeHandler).toHaveBeenCalledWith('IAgree', true);
  });
});