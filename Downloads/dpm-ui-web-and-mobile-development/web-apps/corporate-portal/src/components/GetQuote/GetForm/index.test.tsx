import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GetForm } from "./index"; // Update the path as necessary
import SuccessMessage from "../SuccessMessage"; // Mock this component to avoid rendering the real one

// Mocking SuccessMessage component
jest.mock("../SuccessMessage", () => ({ successMessage }) => (
  <div>{successMessage}</div>
));

describe("GetForm Component", () => {
  const mockFormFields = [
    {
      field_name: "email",
      field_title: "Email",
      field_type: "email",
      field_placeholder: "Enter your email",
    },
    {
      field_name: "phone",
      field_title: "Phone",
      field_type: "number",
      field_placeholder: "Enter your phone",
    },
    {
      field_name: "message",
      field_title: "Message",
      field_type: "textarea",
      field_placeholder: "Enter your message",
    },
    {
      field_name: "submitButton",
      field_title: "Submit",
      field_type: "button",
      field_placeholder: "Submit",
    },
  ];

  const successMessage = "Your request was successful!";
  const buttonText = "Submit";

  // 1. Test for Rendering Fields
  test("renders the form with dynamic fields", () => {
    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockFormFields} successMessage={successMessage} />);

    // Check that email, phone, and message fields are rendered
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  // 2. Test for Email Validation
  test("validates email input", async () => {
    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockFormFields} successMessage={successMessage} />);

    const emailField = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailField, { target: { value: "invalid-email" } });

    // Check if the submit button is disabled
    expect(screen.getByRole("button")).toBeDisabled();

    fireEvent.change(emailField, { target: { value: "valid@gmail.com" } });

    // Check if the submit button is enabled
    expect(screen.getByRole("button")).toBeEnabled();
  });

  // 3. Test for Phone Validation
  test("validates phone number input", async () => {
    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockFormFields} successMessage={successMessage} />);

    const phoneField = screen.getByPlaceholderText(/Enter your phone/i);
    fireEvent.change(phoneField, { target: { value: "12345" } });

    // Check if the submit button is disabled
    expect(screen.getByRole("button")).toBeDisabled();

    fireEvent.change(phoneField, { target: { value: "1234567890" } });

    // Check if the submit button is enabled
    expect(screen.getByRole("button")).toBeEnabled();
  });

  // 4. Test for Handling Form Submission
  test("handles form submission", async () => {
    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockFormFields} successMessage={successMessage} />);

    // Fill out the form with valid values
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "valid@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your message/i), { target: { value: "Test message" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button"));

    // Wait for the success message to appear
    await waitFor(() => expect(screen.getByText(successMessage)).toBeInTheDocument());
  });

  // 5. Test for Success Message Display
  test("displays the success message after form submission", async () => {
    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockFormFields} successMessage={successMessage} />);

    // Fill out the form with valid values
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "valid@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your message/i), { target: { value: "Test message" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button"));

    // Wait for the success message to appear
    await waitFor(() => expect(screen.getByText(successMessage)).toBeInTheDocument());

    // Check if the modal is no longer visible after form submission
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // 6. Test for Modal Close Button
  test("handles modal close", () => {
    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockFormFields} successMessage={successMessage} />);

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    // Ensure the modal is no longer visible
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // 7. Test for Button Disabled State (Before and After Valid Input)
  test("submit button is disabled until form is valid", () => {
    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockFormFields} successMessage={successMessage} />);

    // Ensure the submit button is initially disabled
    expect(screen.getByRole("button")).toBeDisabled();

    // Fill out a valid form
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: "valid@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your message/i), { target: { value: "Test message" } });

    // Ensure the submit button is enabled
    expect(screen.getByRole("button")).toBeEnabled();
  });

  // 8. Test for Rendering Select Fields
  test("renders select fields correctly", () => {
    const mockSelectField = [
      {
        field_name: "productType",
        field_title: "Product Type",
        field_type: "select",
        field_options: { option1: "Product 1", option2: "Product 2" },
      },
    ];

    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockSelectField} successMessage={successMessage} />);

    // Check if the select field is rendered correctly
    expect(screen.getByLabelText(/Product Type/i)).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
  });

  // 9. Test for Rendering Radio Fields
  test("renders radio fields correctly", () => {
    const mockRadioField = [
      {
        field_name: "availability",
        field_title: "Availability",
        field_type: "radios",
        field_options: { available: "Available", notAvailable: "Not Available" },
      },
    ];

    render(<GetForm productTitle="Test Product" buttonText={buttonText} formFields={mockRadioField} successMessage={successMessage} />);

    // Check if the radio buttons are rendered correctly
    expect(screen.getByLabelText(/Availability/i)).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Not Available")).toBeInTheDocument();
  });
});
