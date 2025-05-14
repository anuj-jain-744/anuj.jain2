import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ForgotPasswordAndSignUp } from "./index";
import { useLoginAndSignupContext } from "../useLoginAndSignupContext";
import { FormsField } from "../../GetQuoteWidget/FormFields";
import { LoaderOverlay } from "../../Loader";

// Mock dependencies
jest.mock("../useLoginAndSignupContext", () => ({
  useLoginAndSignupContext: jest.fn(),
}));

jest.mock("../../GetQuoteWidget/FormFields", () => ({
  FormsField: jest.fn(({ onFieldChange }) => (
    <input
      data-testid="mock-field"
      onChange={(e) =>
        onFieldChange("mockField", e.target.value, e.target.value !== "")
      }
    />
  )),
}));

jest.mock("../../Loader", () => ({
  LoaderOverlay: () => <div data-testid="loader-overlay" />,
}));

describe("ForgotPasswordAndSignUp Component", () => {
  const mockSetCurrentStepValue = jest.fn();
  const mockCloseIcon = jest.fn();
  const mockMakeApiCall = jest.fn();

  const mockLoginContext = {
    signUpForm: true,
    setnavigateToErrorFrom: jest.fn(),
    setLoginData: jest.fn(),
  };

  const mockFormElementsData = {
    forgot_password_form: [
      {
        fields: [
          { field_name: "national_id_iqama_no_", field_type: "text" },
          { field_name: "mobile_no", field_type: "text" },
          { field_name: "dob", field_type: "text" },
          { field_name: "submit", field_title: "Continue" },
        ],
      },
    ],
    data: {
      signup_title: "Sign Up",
      welcome_message: "Welcome to the platform",
    },
  };

  const mockLanguageData = {
    back: "Back",
  };

  beforeEach(() => {
    (useLoginAndSignupContext as jest.Mock).mockReturnValue(mockLoginContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(
      <ForgotPasswordAndSignUp
        setCurrentStepValue={mockSetCurrentStepValue}
        closeIcon={mockCloseIcon}
        formElementsData={mockFormElementsData}
        languageData={mockLanguageData}
      />
    );

    expect(screen.getByTestId("formTitle")).toHaveTextContent("Sign Up");
    expect(screen.getByText("Welcome to the platform")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  xit("handles field changes and enables the submit button when all fields are valid", () => {
    render(
      <ForgotPasswordAndSignUp
        setCurrentStepValue={mockSetCurrentStepValue}
        closeIcon={mockCloseIcon}
        formElementsData={mockFormElementsData}
        languageData={mockLanguageData}
      />
    );

    const fields = screen.getAllByTestId("mock-field");
    fields.forEach((field) => {
      fireEvent.change(field, { target: { value: "validValue" } });
    });

    const submitButton = screen.getByTestId("submitBtn");
    expect(submitButton).not.toBeDisabled();
  });

  it("disables the submit button when fields are invalid", () => {
    render(
      <ForgotPasswordAndSignUp
        setCurrentStepValue={mockSetCurrentStepValue}
        closeIcon={mockCloseIcon}
        formElementsData={mockFormElementsData}
        languageData={mockLanguageData}
      />
    );

    const fields = screen.getAllByTestId("mock-field");
    fireEvent.change(fields[0], { target: { value: "" } });

    const submitButton = screen.getByTestId("submitBtn");
    expect(submitButton).toBeDisabled();
  });

  it("calls handleSubmit when the submit button is clicked", async () => {
    render(
      <ForgotPasswordAndSignUp
        setCurrentStepValue={mockSetCurrentStepValue}
        closeIcon={mockCloseIcon}
        formElementsData={mockFormElementsData}
        languageData={mockLanguageData}
      />
    );

    const fields = screen.getAllByTestId("mock-field");
    fields.forEach((field) => {
      fireEvent.change(field, { target: { value: "validValue" } });
    });

    const submitButton = screen.getByTestId("submitBtn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginContext.setnavigateToErrorFrom).toHaveBeenCalledWith(5);
    });
  });

  it("displays the loader when loading is true", () => {
    render(
      <ForgotPasswordAndSignUp
        setCurrentStepValue={mockSetCurrentStepValue}
        closeIcon={mockCloseIcon}
        formElementsData={mockFormElementsData}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByTestId("submitBtn"));
    expect(screen.getByTestId("loader-overlay")).toBeInTheDocument();
  });

  it("calls closeIcon when the close button is clicked", () => {
    render(
      <ForgotPasswordAndSignUp
        setCurrentStepValue={mockSetCurrentStepValue}
        closeIcon={mockCloseIcon}
        formElementsData={mockFormElementsData}
        languageData={mockLanguageData}
      />
    );

    fireEvent.click(screen.getByTestId("close-icon"));
    expect(mockCloseIcon).toHaveBeenCalled();
  });
  
});