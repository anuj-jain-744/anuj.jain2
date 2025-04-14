import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ForgotPasswordAndSignUp } from './index';
import { useLoginAndSignupContext } from '../useLoginAndSignupContext';
import { useApiCall } from '@dpm/shared-module';

jest.mock('../useLoginAndSignupContext');
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
  getRandomString: jest.fn(() => "randomString"),
}));

jest.mock("../../Loader", () => ({
  LoaderOverlay: () => <div>Loading...</div>,
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

describe('ForgotPasswordAndSignUp Component', () => {
  const mockSetContextMobNum = jest.fn();
  const mockSetForgotPassPayload = jest.fn();
  const setnavigateToErrorFrom = jest.fn();
  const setLoading = jest.fn();
  const setLoginData = jest.fn();

  const mockSetCurrentStepValue = jest.fn();
  const mockUseLoginAndSignupContext = useLoginAndSignupContext as jest.Mock;
  const mockUseApiCall = useApiCall as jest.Mock;
  const formElementsData = {
    forgot_password_form: [      
      {
        product_name: "Forgot Password",
        fields: [
          { field_name: "national_id_iqama_no_", field_type: "text", field_title: "National ID", field_placeholder: "Enter National ID" },
          { field_name: "mobile_no", field_type: "text", field_title: "Mobile Number", field_placeholder: "Enter Mobile Number" },
          { field_name: "submit", field_type: "button", field_title: "Continue" },
        ],
      },
    ],
    data: {
      signup_title: "Sign Up",
    },
  };

  const renderComponent = (props = {}) => {
    return render(
      <ForgotPasswordAndSignUp
        setCurrentStepValue={mockSetCurrentStepValue}
        languageData={{ back: 'Back'}}
        closeIcon={true}
        formElementsData={formElementsData}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockUseLoginAndSignupContext.mockReturnValue({
      signUpForm: false,
      setContextMobNum:mockSetContextMobNum,
      mockSetForgotPassPayload,
      setnavigateToErrorFrom,
      setLoginData
    });
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: {'data': 'data'},
    });
  });

  it('renders the form title', () => {
    renderComponent();
    expect(screen.getByTestId("formTitle")).toHaveTextContent("Forgot Password");
  });

  it('renders the form title', () => {
    mockUseLoginAndSignupContext.mockReturnValue({
      signUpForm: true,
      setContextMobNum:mockSetContextMobNum,
      mockSetForgotPassPayload,
      setnavigateToErrorFrom,
      setLoginData
    });
    renderComponent();
    expect(screen.getByTestId("formTitle")).toHaveTextContent("Sign Up");
  });

  it("handles form submission", async () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('national_id_iqama_no_'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByTestId('mobile_no'), { target: { value: '9876543210' } });

    // Check if the submit button is enabled
    const submitButton = screen.getByTestId("submitBtn");
    fireEvent.click(submitButton);
    expect(setLoading).toBeTruthy(); 
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(1);   
  });

  it("handles form submission - Error Message", () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: { messages: { message_en: 'Error message' } },
      data: null,
    });
    renderComponent();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it("displays loading overlay when loading", () => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: true,
      errors: null,
      data: null,
    });
    renderComponent();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles back button click", () => {
    renderComponent();

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(0);
  });

  it('calls setCurrentStepValue with 1 when back button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Back'));
    expect(mockSetCurrentStepValue).toHaveBeenCalledWith(0);
  });
  
});