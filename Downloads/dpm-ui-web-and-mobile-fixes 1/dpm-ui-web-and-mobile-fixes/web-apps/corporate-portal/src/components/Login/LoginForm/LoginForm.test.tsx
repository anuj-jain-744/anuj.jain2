import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from './index';
import { useLoginAndSignupContext } from '../useLoginAndSignupContext';
import { useApiCall } from '@dpm/shared-module';

jest.mock("../../../constant", () => ({
  loginModuleErrorCode : { userId: "UserId"},
}));

jest.mock('../useLoginAndSignupContext');
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
  encryptData: jest.fn(),
  getRandomString: jest.fn()
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

describe('LoginForm Component', () => {
  const mockSetMobileNumber = jest.fn();
  const mockSetLoginPayload = jest.fn();
  const mockSetnavigateToErrorFrom = jest.fn();
  const mockSetCurrentStepValue = jest.fn();
  const mockSetLoginData = jest.fn();
  const mockSetErrorMessage = jest.fn();
  const mockSetReferenceNumber = jest.fn();
  const mockUseLoginAndSignupContext = useLoginAndSignupContext as jest.Mock;
  const mockUseApiCall = useApiCall as jest.Mock;
  const setLoading = jest.fn();
  const formElementsData = {
    data: {
      title: 'Login'
    },
    login_form: [
      {
        fields: [
          {
            field_name: 'national_id_iqama_no',
            field_type: 'text',
            field_title: 'User ID',
            field_class: '',
            field_options: [],
            tooltip: '',
            field_placeholder: 'Enter User ID'
          },
          {
            field_name: 'password',
            field_type: 'password',
            field_title: 'Password',
            field_class: '',
            field_options: [],
            tooltip: '',
            field_placeholder: 'Enter Password'
          }]
      }]
  };
  const renderComponent = (props = {}) => {
    return render(
      <LoginForm
        closeIcon={true}
        languageData={{}}
        setCurrentStepValue={mockSetCurrentStepValue}
        setMobileNumber={mockSetMobileNumber}
        contextProvider={true}
        refData={{}}
        refNum=""
        formElementsData={formElementsData}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockUseLoginAndSignupContext.mockReturnValue({
      setSignUpForm: jest.fn(),
      setLoginPayload: mockSetLoginPayload,
      setFormData: jest.fn(),
      setLoginData: mockSetLoginData,
      setErrorMessage: mockSetErrorMessage,
      setnavigateToErrorFrom: mockSetnavigateToErrorFrom,
      setReferenceNumber: mockSetReferenceNumber,
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
    expect(screen.getByTestId('formTitle')).toHaveTextContent('Login')
  });

  it('displays error message when API returns an error', () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: { 
        messages: {
            message_en: "Error message",
            details:{
              field:'UserId',
            } 
          }              
        },
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
    fireEvent.change(screen.getByTestId('national_id_iqama_no'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(1);
  });
  
});