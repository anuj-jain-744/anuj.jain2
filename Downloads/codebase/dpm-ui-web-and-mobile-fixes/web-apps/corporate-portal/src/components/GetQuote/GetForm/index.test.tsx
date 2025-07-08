import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GetForm from "./index";


jest.mock("../../../constant", () => ({
  commonKeywords: {
    invalidEmail: "Invalid email address",
    requiredField: "This field is required",
    successMessage: "Form submitted successfully!",
  },
}));

const mockMakeApiCall = jest.fn();
jest.mock("@dpm/shared-module", () => ({
  useApiCall: () => ({
    makeApiCall: mockMakeApiCall,
    data: null,
    error: null,
    isLoading: false,
  }),
}));


describe("GetForm Component", () => {
  const mockExtendedFields = [
    {
      field_name: "full_name",
      field_title: "Full Name",
      field_type: "text",
      field_placeholder: "Enter your full name",
      field_validation: {
        required: { message: "Full Name is required" },
        maxLength: { value: 100, message: "Full Name must be less than 100 characters" },
      },
    },
    {
      field_name: "email_id",
      field_title: "Email",
      field_type: "email",
      field_placeholder: "Enter your email",
      field_validation: {
        required: { message: "Email is required" },
        emailValid: { message: "Invalid email format" },
      },
    },
    {
      field_name: "additional_information",
      field_title: "Additional Information",
      field_type: "textarea",
      field_placeholder: "Enter additional information",
      field_validation: {
        maxLength: { value: 255, message: "Additional Information must be less than 255 characters" },
      },
    },
  ];

  it("renders all fields correctly", () => {
    const mockSetShow = jest.fn();    

    const mockProps = {
      buttonText: "Submit",
      products: { class_name: "Test Product" },
      formFields: [
        { field_name: "full_name", field_type: "textfield", field_title: "Full Name", field_placeholder: "Enter full name" },
        { field_name: "company_name", field_type: "textfield", field_title: "Company Name", field_placeholder: "Enter company name" },
        { field_name: "email", field_type: "email", field_title: "Email", field_placeholder: "Enter email" },
      ],
      successMessage: "Form submitted successfully!",
      show: true,
      setShow: mockSetShow,
    };
    render(<GetForm {...mockProps} />);
    
    // Check if all fields are rendered
    expect(screen.getByPlaceholderText("Enter full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  xit("validates required fields on submit", () => {
    const mockSetShow = jest.fn();    

    const mockProps = {
      buttonText: "Submit",
      products: { class_name: "Test Product" },
      formFields: [
        { field_name: "full_name", field_type: "textfield", field_title: "Full Name", field_placeholder: "Enter full name" },
        { field_name: "company_name", field_type: "textfield", field_title: "Company Name", field_placeholder: "Enter company name" },
        { field_name: "email", field_type: "email", field_title: "Email", field_placeholder: "Enter email" },
      ],
      successMessage: "Form submitted successfully!",
      show: true,
      setShow: mockSetShow,
    };
    render(<GetForm {...mockProps} />);
    
    const submitButton = screen.getAllByText("Submit");
    fireEvent.click(submitButton[1]);

    // Check validation messages
    expect(screen.getByText("Full Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  xit("validates email format", () => {
    const mockSetShow = jest.fn();    

    const mockProps = {
      buttonText: "Submit",
      products: { class_name: "Test Product" },
      formFields: [
        { field_name: "full_name", field_type: "textfield", field_title: "Full Name", field_placeholder: "Enter full name" },
        { field_name: "company_name", field_type: "textfield", field_title: "Company Name", field_placeholder: "Enter company name" },
        { field_name: "email", field_type: "email", field_title: "Email", field_placeholder: "Enter email" },
      ],
      successMessage: "Form submitted successfully!",
      show: true,
      setShow: mockSetShow,
    };
    render(<GetForm {...mockProps} />);
    
    const emailInput = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    const { container } = render(<GetForm {...mockProps} />);
    const submitButtons = container.querySelectorAll(".get-quote-button"); // Replace with the actual class name
    submitButtons.forEach((button) => fireEvent.click(button));

    // Check validation message for invalid email
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  xit("validates max length for fields", () => {
    const mockSetShow = jest.fn();    

    const mockProps = {
      buttonText: "Submit",
      products: { class_name: "Test Product" },
      formFields: [
        { field_name: "full_name", field_type: "textfield", field_title: "Full Name", field_placeholder: "Enter full name" },
        { field_name: "company_name", field_type: "textfield", field_title: "Company Name", field_placeholder: "Enter company name" },
        { field_name: "email", field_type: "email", field_title: "Email", field_placeholder: "Enter email" },
      ],
      successMessage: "Form submitted successfully!",
      show: true,
      setShow: mockSetShow,
    };
    render(<GetForm {...mockProps} />);
    
    const fullNameInput = screen.getByPlaceholderText("Enter full name");
    fireEvent.change(fullNameInput, { target: { value: "a".repeat(101) } });

    const submitButton = screen.getAllByText("Submit");
    fireEvent.click(submitButton[1]);

    // Check validation message for exceeding max length
    expect(screen.getByText("Full Name must be less than 100 characters")).toBeInTheDocument();
  });

  xit("submits the form with valid inputs", () => {
    const mockSetShow = jest.fn();    

    const mockProps = {
      buttonText: "Submit",
      products: { class_name: "Test Product" },
      formFields: [
        { field_name: "full_name", field_type: "textfield", field_title: "Full Name", field_placeholder: "Enter full name" },
        { field_name: "company_name", field_type: "textfield", field_title: "Company Name", field_placeholder: "Enter company name" },
        { field_name: "email", field_type: "email", field_title: "Email", field_placeholder: "Enter email" },
      ],
      successMessage: "Form submitted successfully!",
      show: true,
      setShow: mockSetShow,
    };
    render(<GetForm {...mockProps} />);
    
    const fullNameInput = screen.getByPlaceholderText("Enter full name");
    const emailInput = screen.getByPlaceholderText("Enter email");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });

    const submitButton = screen.getAllByText("Submit");
    fireEvent.click(submitButton[1]);

    // Check that no validation messages are displayed
    expect(screen.queryByText("Full Name is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Invalid email format")).not.toBeInTheDocument();
    expect(screen.queryByText("Full Name must be less than 100 characters")).not.toBeInTheDocument();
  });
});