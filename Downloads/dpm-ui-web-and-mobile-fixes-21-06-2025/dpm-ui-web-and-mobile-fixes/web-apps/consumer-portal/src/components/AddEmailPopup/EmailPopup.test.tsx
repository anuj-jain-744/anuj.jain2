import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddEmailPopup } from './EmailPopup';

const mockHandleClose = jest.fn();
const mockHandleAddEmail = jest.fn();

const languageData = {
  add_email: 'Add Email',
  new_email_id: 'New Email ID',
  please_provide_valid_email_id: 'Please provide a valid email ID',
  cancel: 'Cancel',
  add: 'Add'
};

describe('AddEmailPopup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <AddEmailPopup
        showEmailModal={true}
        handleClose={mockHandleClose}
        handleAddEmail={mockHandleAddEmail}
        languageData={languageData}
      />
    );

  it('renders modal with labels and input', () => {
    setup();

    expect(screen.getByText('Add Email')).toBeInTheDocument();
    expect(screen.getByText('New Email ID')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeDisabled();
  });

  it('validates invalid email and shows error', () => {
    setup();
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.blur(input);

    expect(screen.getByText('Please provide a valid email ID')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeDisabled();
  });

  it('accepts valid email and enables Add button', () => {
    setup();
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.blur(input);

    expect(screen.queryByText('Please provide a valid email ID')).not.toBeInTheDocument();
    expect(screen.getByText('Add')).toBeEnabled();
  });

  it('calls handleAddEmail with valid email', () => {
    setup();
    const input = screen.getByRole('textbox');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.blur(input);
    fireEvent.click(addButton);

    expect(mockHandleAddEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('calls handleClose on cancel click', () => {
    setup();
    fireEvent.click(screen.getByText('Cancel'));

    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('calls handleClose on close icon click', () => {
    setup();
    const closeIcon = screen.getByAltText('close icon');
    fireEvent.click(closeIcon);

    expect(mockHandleClose).toHaveBeenCalled();
  });
});
