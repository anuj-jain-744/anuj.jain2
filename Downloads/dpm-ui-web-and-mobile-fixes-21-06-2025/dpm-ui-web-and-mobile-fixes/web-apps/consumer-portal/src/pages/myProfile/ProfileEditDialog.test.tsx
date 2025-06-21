import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileEditDialog from './ProfileEditDialog';
import { RootState } from '@dpm/shared-module';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('components/ThemeTextbox/ThemeTextbox', () => ({
  __esModule: true,
  default: jest.fn(({ onChangehandler, value, errorMessage }) => (
    <>
        <input
        data-testid="theme-textbox"
        onChange={onChangehandler}
        value={value}
        aria-label="ThemeTextbox"
        />
        {errorMessage && <div>{errorMessage}</div>}
    
    </>
    
  )),
}));


const mockDispatch = jest.fn();

const mockDashboardLanguageData = {
  update_email_id: 'Update Email ID',
  existing_email_id: 'Existing Email ID',
  new_email_id: 'New Email ID',
  update_mobile_number: 'Update Mobile Number',
  existing_mobile_no: 'Existing Mobile Number',
  new_mobile_no: 'New Mobile Number',
  please_provide_valid_email_id: 'Please provide a valid email ID',
  please_provide_valid_mobile_number: 'Please provide a valid mobile number',
  cancel: 'Cancel',
  update: 'Update',
};


describe('ProfileEditDialog', () => {
  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        dashbaordLanguageData: { languageData: mockDashboardLanguageData },
        auth: {
          userInfo: {
            email: 'user@example.com',
            mobileNumber: '0551234567',
          },
        },
      } as RootState)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders and updates email', async() => {
    render(
      <ProfileEditDialog
        showDialog={true}
        updateContact="email"
        setUpdatedDetails={jest.fn()}
        setShowDialog={jest.fn()}
      />
    );

    expect(screen.getByText('Update Email ID')).toBeInTheDocument();
    expect(screen.getByText('Existing Email ID')).toBeInTheDocument();
    // await waitFor(()=>expect(screen.getByText('user@example.com')).toBeInTheDocument())
    
    expect(screen.getByText('New Email ID')).toBeInTheDocument();

    const input = screen.getByTestId('theme-textbox');
    fireEvent.change(input, { target: { value: 'new@example.com' } });

    expect(input).toHaveValue('new@example.com');
  });

  test('renders and updates mobile number', () => {
    render(
      <ProfileEditDialog
        showDialog={true}
        updateContact="mobile"
        setUpdatedDetails={jest.fn()}
        setShowDialog={jest.fn()}
      />
    );

    expect(screen.getByText('Update Mobile Number')).toBeInTheDocument();
    expect(screen.getByText('Existing Mobile Number')).toBeInTheDocument();
    expect(screen.getByText('New Mobile Number')).toBeInTheDocument();

    const input = screen.getByTestId('theme-textbox');
    fireEvent.change(input, {  target: { value: '0587654321' } });

    expect(input).toHaveValue('0587654321');
  });

  test('displays error message for invalid email', () => {
    render(
      <ProfileEditDialog
       showDialog={true}
        updateContact="email"
        setUpdatedDetails={jest.fn()}
        setShowDialog={jest.fn()}
      />
    );

    const input = screen.getByTestId('theme-textbox');
    fireEvent.change(input, {errorMessage: 'Please provide a valid email ID', target: { value: 'invalid-email' } });

    expect(screen.getByText('Please provide a valid email ID')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeDisabled();
  });

  test('displays error message for invalid mobile number', () => {
    render(
      <ProfileEditDialog
       showDialog={true}
        updateContact="mobile"
        setUpdatedDetails={jest.fn()}
        setShowDialog={jest.fn()}
      />
    );

    const input = screen.getByTestId('theme-textbox');
    fireEvent.change(input, {errorMessage: 'Please provide a valid mobile number', target: { value: 'invalid-mobile' } });

    expect(screen.getByText('Please provide a valid mobile number')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeDisabled();
  });

  test('handles close button click', () => {
    render(
      <ProfileEditDialog
        showDialog={true}
        updateContact="email"
        setUpdatedDetails={jest.fn()}
        setShowDialog={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
  });
});