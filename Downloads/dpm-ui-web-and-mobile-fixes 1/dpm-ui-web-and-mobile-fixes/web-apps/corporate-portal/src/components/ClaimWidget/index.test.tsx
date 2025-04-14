import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ClaimWidget } from "./index";
import { CardHeaderProps } from "./index";

const mockFormHeaderData: CardHeaderProps = {
  registerclaim: "Register Claim",
  registerclaimlink: "/register-claim",
  trackyourclaim: "Track Your Claim",
  trackyourclaimlink: "/track-claim",
  trackyourclaimdesc: "You can track your claims here.",
  iconimages: {
    url: "icon-url.png",
    alt: "Claim Icon",
    title: "Claim Icon Title",
  },
  formInputData: [
    {
      field_name: "name",
      field_type: "text",
      field_title: "Name",
      field_placeholder: "Enter your name",
      field_required: true,
      field_options: {},
      field_validation: {
        required: {
          "message": "true",
        }
      },
    },
    {
      field_name: "email",
      field_type: "email",
      field_title: "Email",
      field_placeholder: "Enter your email",
      field_required: true,
      field_options: {},
      field_validation: {
        required: {
          "message": "true",
        }
      },
    },
    {
      field_name: "description",
      field_type: "textarea",
      field_title: "Description",
      field_placeholder: "Describe your issue",
      field_required: false,
      field_options: {},
      field_validation: {},
    },
  ],
};

describe("ClaimWidget", () => {
  test("renders without crashing", () => {
    render(<ClaimWidget formHeaderData={mockFormHeaderData} />);
    expect(screen.getByText("Track Your Claim")).toBeInTheDocument();
    expect(screen.getByText("Register Claim")).toBeInTheDocument();
    expect(
      screen.getByText("You can track your claims here.")
    ).toBeInTheDocument();
    expect(screen.getByAltText("Claim Icon")).toBeInTheDocument();
  });

  test("enables the button only when required fields are filled", () => {
    render(<ClaimWidget formHeaderData={mockFormHeaderData} />); 
    const submitButton = screen.getByRole("button"); 
    expect(submitButton).toBeDisabled(); 
    
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "john@example.com" },
    });
 
    expect(submitButton).toBeEnabled();
  });

  test("displays input fields correctly", () => {
    render(<ClaimWidget formHeaderData={mockFormHeaderData} />);

    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Describe your issue")
    ).toBeInTheDocument();
  });
});
