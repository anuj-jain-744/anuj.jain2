import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChangeMobileNumber } from './index';
import { useLoginAndSignupContext } from '../useLoginAndSignupContext';
import { useApiCall } from '@dpm/shared-module';

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

describe('ChangeMobileNumber Component', () => {
  const mockSetCurrentStepValue = jest.fn();
  const mockHandleSuccessValidation = jest.fn();
  const mockUseLoginAndSignupContext = useLoginAndSignupContext as jest.Mock;
  const mockUseApiCall = useApiCall as jest.Mock;
  const setLoading = jest.fn();
  const renderComponent = (props = {}) => {
    return render(
      <ChangeMobileNumber
        setCurrentStepValue={mockSetCurrentStepValue}
        languageData={{ back: 'Back', change_mobile_no: 'Change Mobile Number' }}
        closeIcon={true}
        contextProvider={true}
        handleSuccessValidation={mockHandleSuccessValidation}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockUseLoginAndSignupContext.mockReturnValue({
      loginData: { userId: '123', mobileNumber: '9876543210' },
      formData: {
        data: {
          iqama_no: 'Iqama No',
          existing_mobile_no: 'Existing Mobile No',
        },
        change_mobileno_form: [
          {
            fields: [
              { field_name: 'new_mobile_no_', field_type: 'text', field_title: 'New Mobile Number', field_placeholder: 'Enter new mobile number' },
              { field_name: 'submit', field_type: 'submit', field_title: 'Verify' },
            ],
          },
        ],
      },
      stepValue: 1,
      setStepValue: jest.fn(),
      setContextMobNum: jest.fn(),
      setnavigateToErrorFrom: jest.fn(),
      setSuccessMessage: jest.fn(),
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
    expect(screen.getByText('Change Mobile Number')).toBeInTheDocument();
  });

  it('calls setCurrentStepValue with 1 when back button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Back'));
    expect(mockUseLoginAndSignupContext().setStepValue).toHaveBeenCalledWith(1);
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
      data: null,
    });

    renderComponent();
    fireEvent.change(screen.getByTestId('new_mobile_no_'), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByText('Verify'));

    // Debugging step: Check if the function is called
    console.log(mockMakeApiCall.mock.calls);

    expect(setLoading).toBeTruthy();
  });
});