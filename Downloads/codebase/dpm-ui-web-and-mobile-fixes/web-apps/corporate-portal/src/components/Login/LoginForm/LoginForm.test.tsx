import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "./index";
import { useApiCall } from "@dpm/shared-module";
import { useLoginAndSignupContext } from "../useLoginAndSignupContext";

// Mock dependencies
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  encryptData: jest.fn(() => "encryptedPassword"),
  getRandomString: jest.fn(() => "randomSessionId"),
}));

jest.mock("../useLoginAndSignupContext", () => ({
  useLoginAndSignupContext: jest.fn(),
}));

jest.mock("../../../constant", () => ({
  loginModuleErrorCode: {
    DTXSGOT4002: "DTXSGOT4002",
    DTXSLOG4003: "DTXSLOG4003",
    DTXSGOT4004: "DTXSGOT4004",
    DTXSLOG4001: "DTXSLOG4001",
    userId: "userId",
  },
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


describe("LoginForm Component", () => {
  const mockMakeApiCall = jest.fn();
  const mockSetLoginPayload = jest.fn();
  const mockSetCurrentStepValue = jest.fn();
  const mockSetMobileNumber = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      isLoading: false,
      errors: null,
      data: null,
    });
    
    (useLoginAndSignupContext as jest.Mock).mockReturnValue({
      setSignUpForm: jest.fn(),
      warningMessage: "",
      setWarningMessage: jest.fn(),
      setLoginPayload: mockSetLoginPayload,
      setFormData: jest.fn(),
      setLoginData: jest.fn(),
      navigateToErrorFrom: 0,
      setnavigateToErrorFrom: jest.fn(),
      setReferenceNumber: jest.fn(),
    });
  });

  const mockProps = {
    formElementsData: {
      data: { title: "Login" },
      login_form: [
        {
          fields: [
            {
              field_name: "national_id_iqama_no",
              field_type: "text",
              field_title: "National ID/Iqama No",
              field_class: "form-control",
              field_options: [],
              tooltip: "Enter your ID",
            },
            {
              field_name: "password",
              field_type: "password",
              field_title: "Password",
              field_class: "form-control",
              field_options: [],
              tooltip: "Enter your password",
            },
          ],
        },
      ],
    },
    closeIcon: jest.fn(),
    languageData: {},
    setCurrentStepValue: mockSetCurrentStepValue,
    setMobileNumber: mockSetMobileNumber,
    contextProvider: true,
    refData: {},
    refNum: "",
  };

  it('renders the form title', () => {
    const mockProps = {
      formElementsData: {
        data: { title: "Login" },
        login_form: [
          {
            fields: [
              { field_name: "national_id_iqama_no", field_type: "text" },
              { field_name: "password", field_type: "password" },
            ],
          },
        ],
      },
      closeIcon: true,
      languageData: {},
      setCurrentStepValue: jest.fn(),
      setMobileNumber: jest.fn(),
      contextProvider: true,
      refData: {},
      refNum: "",
    };

    render(<LoginForm {...mockProps} />);
    expect(screen.getByTestId('formTitle')).toHaveTextContent('Login')
  });

  it('renders the close icon when closeIcon is true', () => {
    const mockProps = {
      formElementsData: {
        data: { title: "Login" },
        login_form: [
          {
            fields: [
              { field_name: "national_id_iqama_no", field_type: "text" },
              { field_name: "password", field_type: "password" },
            ],
          },
        ],
      },
      closeIcon: true,
      languageData: {},
      setCurrentStepValue: jest.fn(),
      setMobileNumber: jest.fn(),
      contextProvider: true,
      refData: {},
      refNum: "",
    };

    render(<LoginForm {...mockProps} />);
    expect(screen.getByTestId('close-icon')).toBeInTheDocument(); // Updated data-testid
  });


  it("renders the mocked FormsField component", () => {
    const mockProps = {
      formElementsData: {
        data: { title: "Login" },
        login_form: [
          {
            fields: [
              { field_name: "national_id_iqama_no", field_type: "text" },
              { field_name: "password", field_type: "password" },
            ],
          },
        ],
      },
      closeIcon: true,
      languageData: {},
      setCurrentStepValue: jest.fn(),
      setMobileNumber: jest.fn(),
      contextProvider: true,
      refData: {},
      refNum: "",
    };

    render(<LoginForm {...mockProps} />);
    expect(screen.getAllByTestId("national_id_iqama_no")).toHaveLength(1); // Two mocked FormsField components
  });
  it('calls makeApiCall with correct payload when form is valid', () => {
    const mockProps = {
      formElementsData: {
        data: { title: "Login" },
        login_form: [
          {
            fields: [
              { field_name: "national_id_iqama_no", field_type: "text" },
              { field_name: "password", field_type: "password" },
            ],
          },
        ],
      },
      closeIcon: true,
      languageData: {},
      setCurrentStepValue: jest.fn(),
      setMobileNumber: jest.fn(),
      contextProvider: true,
      refData: {},
      refNum: "",
    };

    render(<LoginForm {...mockProps} />);
    fireEvent.change(screen.getByTestId('national_id_iqama_no'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByTestId('submitBtn'));
    // Verify makeApiCall is called with the correct payload
    expect(mockMakeApiCall).toHaveBeenCalledWith({
      "encryptedPass": "encryptedPassword",
      "sessionSecretId": "randomSessionId",
      "userId": "1234567890",
    });
  });
});