import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubscribeEmail from "./index";

const mockSetEmail = jest.fn();

const mockLanguageData = {
  your_email_id_is_important: "Your email is important!",
  email_id_label: "Email ID",
  placeholder_enter_email_id: "Enter your email ID",
  value_is_required: "Email is required",
  email_is_invalid: "Invalid email address",
};

describe("SubscribeEmail Component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <SubscribeEmail languageData={mockLanguageData} email="" setEmail={mockSetEmail} />
      </MemoryRouter>
    );
    
    expect(screen.getByText("Your email is important!"));
    expect(screen.getByLabelText(/Email ID/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email ID/i)).toBeInTheDocument();
  });

  test("shows required error on empty input", () => {
    render(
      <MemoryRouter>
        <SubscribeEmail languageData={mockLanguageData} email="" setEmail={mockSetEmail} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email ID/i);
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.keyUp(emailInput);

    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
  });

  test("shows invalid email error on incorrect input", () => {
    render(
      <MemoryRouter>
        <SubscribeEmail languageData={mockLanguageData} email="" setEmail={mockSetEmail} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email ID/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.keyUp(emailInput);

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
  });

  test("calls setEmail on valid input", () => {
    render(
      <MemoryRouter>
        <SubscribeEmail languageData={mockLanguageData} email="" setEmail={mockSetEmail} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your email ID/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.keyUp(emailInput);

    expect(mockSetEmail).toHaveBeenCalledWith("test@example.com");
    expect(screen.queryByText(/Invalid email address/i)).not.toBeInTheDocument();
  });
});