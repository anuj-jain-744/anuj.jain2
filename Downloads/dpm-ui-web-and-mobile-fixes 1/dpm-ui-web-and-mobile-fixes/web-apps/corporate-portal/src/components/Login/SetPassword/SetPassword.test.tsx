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
            field_name: 'new_password',
            tooltip: 'Enter new password',
            field_placeholder: 'New Password',
          },
          {
            field_class: 'class2',
            field_type: 'password',
            field_title: 'Confirm Password',
            field_options: [],
            field_name: 'confirm_password',
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
    expect(screen.getByTestId('new_password')).toBeInTheDocument();
    expect(screen.getByTestId('confirm_password')).toBeInTheDocument();
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
    fireEvent.change(screen.getByTestId('new_password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_password'), { target: { value: 'password' } });
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
    fireEvent.change(screen.getByTestId('new_password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_password'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(setLoading).toBeTruthy();
  });

  it('displays error message when confirm password does not match new password', () => {
    const setHandleSubmitFailed = jest.fn();
    renderComponent();
    fireEvent.change(screen.getByTestId('new_password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByTestId('confirm_password'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(setHandleSubmitFailed).toBeTruthy();
  });
});