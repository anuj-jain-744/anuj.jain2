// __tests__/GetForm.test.tsx
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import GetForm from "./index"; // Adjust path accordingly
import { useApiCall } from "@dpm/shared-module";

// Mock SuccessMessage component
jest.mock("../SuccessMessage", () => ({ successMessage }: any) => (
  <div data-testid="success-message">{successMessage}</div>
));

jest.mock("../../../constant", () => ({
  commonKeywords: {
    invalidEmail: "Invalid email address",
    requiredField: "This field is required",
    successMessage: "Form submitted successfully!",
  },
}));

// Mock API call hook
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

const mockMakeApiCall = jest.fn();

const fieldData = [
  {
    field_name: "full_name",
    field_title: "Full Name",
    field_type: "textfield",
    field_placeholder: "Enter your full name",
    field_validation: {
      required: { message: "Name is required" },
    },
  },
  {
    field_name: "company_name",
    field_title: "Company",
    field_type: "textfield",
    field_placeholder: "Enter company name",
    field_validation: {
      required: { message: "Company is required" },
    },
  },
  {
    field_name: "phone_number",
    field_title: "Phone",
    field_type: "number",
    field_placeholder: "Enter phone",
    field_validation: {
      required: { message: "Phone is required" },
    },
  },
  {
    field_name: "email",
    field_title: "Email",
    field_type: "email",
    field_placeholder: "Enter email",
    field_validation: {
      required: { message: "Email is required" },
    },
  },
  {
    field_name: "number_of_employees",
    field_title: "Employees",
    field_type: "number",
    field_placeholder: "Enter employee count",
    field_validation: {
      required: { message: "Employee count required" },
    },
  },
  {
    field_name: "time_preference",
    field_title: "Time Preference",
    field_type: "select",
    field_placeholder: "",
    field_options: {
      morning: "Morning",
      evening: "Evening",
    },
    field_validation: {
      required: { message: "Time preference required" },
    },
  },
  {
    field_name: "region",
    field_title: "Region",
    field_type: "radios",
    field_placeholder: "",
    field_options: {
      us: "US",
      eu: "EU",
    },
    field_validation: {
      required: { message: "Region required" },
    },
  },
  {
    field_name: "additional_information",
    field_title: "Additional Info",
    field_type: "textarea",
    field_placeholder: "Tell us more",
    field_validation: {
      required: { message: "Additional info required" },
    },
  },
  {
    field_name: "submit",
    field_type: "button",
    field_placeholder: "Submit",
  },
];

describe("GetForm", () => {
  beforeEach(() => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: null,
      error: null,
      isLoading: false,
    });
  });

  const renderForm = () =>
    render(
      <GetForm
        show={true}
        setShow={jest.fn()}
        buttonText="Request Quote"
        formFields={fieldData}
        successMessage="Submitted!"
        products={{ class_name: "Test Product" }}
      />
    );

  it("renders all fields and handles input", async () => {
    renderForm();

    // Fill text fields
    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter company name"), {
      target: { value: "Acme Inc." },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter phone"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter employee count"), {
      target: { value: "10" },
    });

    // Select dropdown
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "morning" },
    });

    // Radio button
    fireEvent.click(screen.getByText("US"));

    // Textarea
    fireEvent.change(screen.getByPlaceholderText("Tell us more"), {
      target: { value: "Additional details here." },
    });

    // Button click
    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMakeApiCall).toHaveBeenCalledWith({
        fullName: "John Doe",
        companyName: "Acme Inc.",
        email: "john@example.com",
        phone: "1234567890",
        numberOfEmployees: "10",
        timePreference: "morning",
        region: "us",
        additionalInformation: "Additional details here.",
        productName: "Test Product",
      });
    });
  });

  it("shows validation errors if required fields are empty", async () => {
    renderForm();
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);
  });

  it("displays success message on successful API call", async () => {
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: { message: "Success" },
      error: null,
      isLoading: false,
    });

    renderForm();

    await waitFor(() => {
      expect(screen.getByTestId("success-message")).toHaveTextContent("Submitted!");
    });
  });
});
