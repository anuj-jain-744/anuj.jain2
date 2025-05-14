// GetQuote.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GetQuote } from "./index";

jest.mock("./GetForm/index", () => () => <div data-testid="get-form">GetForm Component</div>);

describe("GetQuote Component", () => {
  const defaultProps = {
    carIcon: "/path/to/carIcon.svg",
    arrowIcon: "/path/to/arrowIcon.svg",
    verifiedIcon: "/path/to/verifiedIcon.svg",
    introText: "Get a quote for your product",
    disclaimerText: "Terms and conditions apply.",
    buttonLabel: "Request a Quote",
    products: "Product A",
    configdata: "ProductA",
    fieldsData: [
      {
        field_name: "fullName",
        field_title: "Full Name",
        field_type: "text",
        field_required: true,
        field_placeholder: "Enter your full name",
      },
    ],
    successMessage: "Thank you for your request!",
  };

  test("renders the component with default props", () => {
    render(<GetQuote {...defaultProps} />);

    // Check if intro text is rendered
    expect(screen.getByText(defaultProps.introText)).toBeInTheDocument();

    // Check if button label is rendered
    expect(screen.getByText(defaultProps.buttonLabel)).toBeInTheDocument();

    // Check if disclaimer text is rendered
    expect(screen.getByText(defaultProps.disclaimerText)).toBeInTheDocument();

    // Check if verified icon is rendered
    const verifiedIcon = screen.getByAltText("Verified Icon");
    expect(verifiedIcon).toHaveAttribute("src", defaultProps.verifiedIcon);

    // Check if arrow icon is rendered
    const arrowIcon = screen.getByAltText("Arrow Right");
    expect(arrowIcon).toHaveAttribute("src", defaultProps.arrowIcon);
  });

  test("shows GetForm component when button is clicked", () => {
    render(<GetQuote {...defaultProps} />);

    // Ensure GetForm is not rendered initially
    expect(screen.queryByTestId("get-form")).not.toBeInTheDocument();

    // Click the button
    const button = screen.getByText(defaultProps.buttonLabel);
    fireEvent.click(button);

    // Ensure GetForm is rendered
    expect(screen.getByTestId("get-form")).toBeInTheDocument();
  });

  test("loads dynamic icon based on configdata", async () => {
    jest.mock("../../../src/assets/Header/activeIcons/activeProductAIcon.svg", () => ({
      default: "/path/to/dynamicIcon.svg",
    }));

    render(<GetQuote {...defaultProps} />);

    // Wait for the dynamic icon to load
    const dynamicIcon = await screen.findByAltText("ProductA icon");
    expect(dynamicIcon).toHaveAttribute("src", "/path/to/dynamicIcon.svg");
  });

  test("renders all props correctly", () => {
    render(<GetQuote {...defaultProps} />);

    // Check if intro text is rendered
    expect(screen.getByText(defaultProps.introText)).toBeInTheDocument();

    // Check if disclaimer text is rendered
    expect(screen.getByText(defaultProps.disclaimerText)).toBeInTheDocument();

    // Check if button label is rendered
    expect(screen.getByText(defaultProps.buttonLabel)).toBeInTheDocument();
  });
});