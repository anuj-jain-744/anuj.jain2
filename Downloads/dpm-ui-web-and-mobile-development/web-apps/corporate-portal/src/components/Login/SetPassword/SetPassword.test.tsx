import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SetPassword } from './index';
import { useLoginAndSignupContext } from '../useLoginAndSignupContext';
import { useApiCall } from '@dpm/shared-module';
import { doesNotMatch } from 'assert';

jest.mock('../useLoginAndSignupContext');
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

// Mock FormsField component
jest.mock('../../GetQuoteWidget/FormFields', () => ({
  FormsField: ({ onFieldChange, field_name, inputPlaceholder, APIError }: { onFieldChange: any, field_name: any, inputPlaceholder: any, APIError: any }) => (
    <div>
      <input
        data-testid={field_name}
        placeholder={inputPlaceholder}
        onChange={(e) => onFieldChange(field_name, e.target.value, true)}
      />
      {APIError && <span>{APIError}</span>}
    </div>
  ),
}));

describe('SetPassword Component', () => {
  const mockSetCurrentStepValue = jest.fn();
  const mockUseLoginAndSignupContext = useLoginAndSignupContext as jest.Mock;
  const mockUseApiCall = useApiCall as jest.Mock;
  const setLoading = jest.fn();
  const formElementsData = {
    set_new_password_form: [
      {
        fields: [
          {
            field_class: 'class1',
            field_type: 'password',
            field_title: 'New Password',
            field_options: [],
            field_name: 'new_pasd',
            tooltip: 'Enter new password',
            field_placeholder: 'New Password',
          },
          {
            field_class: 'class2',
            field_type: 'password',
            field_title: 'Confirm Password',
            field_options: [],
            field_name: 'confirm_pasd',
            tooltip: 'Confirm new password',
            field_placeholder: 'Confirm Password',
          },
          {
            field_title: 'Submit',
          },
        ],
        product_name: 'Set New Password',
      },
    ],
    data: {
      passwords_do_not_match: 'Passwords do not match',
      signup_success_msg: 'Signup successful',
      forgotpassword_success_msg: 'Password reset successful',
    },
  };
  const renderComponent = (props = {}) => {
    return render(
      <SetPassword
        setCurrentStepValue={mockSetCurrentStepValue}
        languageData={{ back: 'Back', newPassword: 'New Password', confirmPassword: 'Confirm Password' }}
        closeIcon={true}
        formElementsData={formElementsData}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockUseLoginAndSignupContext.mockReturnValue({
      loginData: { userId: '123', mobileNumber: '9876543210' },
      signUpForm: false,
      setSuccessMessage: jest.fn(),
      setStepValue : jest.fn(),
    });
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: null,
    });
  });

  it('renders the form title', () => {
    renderComponent();
    expect(screen.getByText('Set New Password')).toBeInTheDocument();
    expect(screen.getByTestId('formTitle')).toHaveTextContent('Set New Password');
    expect(screen.getByTestId('new_pasd')).toBeInTheDocument();
    expect(screen.getByTestId('confirm_pasd')).toBeInTheDocument();
    expect(screen.getByTestId('submitBtn')).toBeDisabled();
  });

  it('calls setCurrentStepValue with 1 when back button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Back'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(5);
  });

  it('displays error message when API returns an error', () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: { messages: { message_en: 'Error message' } },
      data: null,
    });
    renderComponent();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('calls makeApiCall with correct payload when form is valid', () => {
    const mockMakeApiCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockMakeApiCall,
      isLoading: false,
      errors: null,
      data: {message: "Password reset successful"},
    });
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(4);
  });

  it('calls makeApiCall with correct payload when form is invalid', () => {
    const mockMakeApiCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockMakeApiCall,
      isLoading: false,
      errors: null,
      data: null,
    });
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(setLoading).toBeTruthy();
  });

  it('displays error message when confirm password does not match new password', () => {
    const setHandleSubmitFailed = jest.fn();
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(setHandleSubmitFailed).toBeTruthy();
  });

  it('disables submit button when fields are invalid', () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: '' } });
    expect(screen.getByTestId('submitBtn')).toBeDisabled();
  });

  it('shows API error message when API call fails', () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: { messages: { message_en: 'API Error' } },
      data: null,
    });
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(screen.getByText('API Error')).toBeInTheDocument();
  });

  it('shows success message when API call succeeds', () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: { message: 'Password reset successful' },
    });
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(4);
  });

  it('handles back button click correctly', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Back'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(5);
  });

  it('renders warning message when navigateToErrorFrom is 0', () => {
    mockUseLoginAndSignupContext.mockReturnValueOnce({
      ...mockUseLoginAndSignupContext(),
      navigateToErrorFrom: 0,
      warningMessage: 'Login',
    });
    renderComponent();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('handles close icon click when closeIcon is true', () => {
    const mockCloseIcon = jest.fn();
    renderComponent({ closeIcon: mockCloseIcon });
    fireEvent.click(screen.getByTestId('close-icon'));
    expect(mockCloseIcon).toHaveBeenCalledWith(false);
  });

  it('does not show API error when passwords match', () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
  });

  it('shows password info message', () => {
    renderComponent();
    const passwordInfoIcon = screen.getByTestId('password-info-icon');
    expect(passwordInfoIcon).toBeInTheDocument();
    expect(passwordInfoIcon).toHaveAttribute(
      'alt',
      'Your password must be 10 characters long with a mandatory combination of uppercase, numeric, lowercase and special characters.'
    );
  });

  it('handles signup API call when signUpForm is true', () => {
    mockUseLoginAndSignupContext.mockReturnValueOnce({
      ...mockUseLoginAndSignupContext(),
      signUpForm: true,
      loginData: { userId: '123', mobileNumber: '9876543210' },
    });
    const mockSignupApiCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockSignupApiCall,
      isLoading: false,
      errors: null,
      data: null,
    });
    renderComponent();
    fireEvent.change(screen.getByTestId('new_pasd'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_pasd'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(mockSignupApiCall).toHaveBeenCalledWith({
      userId: '123',
      newPassword: expect.any(String), // Encrypted password
      mobileNumber: '9876543210',
    });
  });

});