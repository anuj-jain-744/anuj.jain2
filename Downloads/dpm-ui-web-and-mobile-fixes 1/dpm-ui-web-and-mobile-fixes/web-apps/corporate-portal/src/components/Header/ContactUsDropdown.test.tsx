import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactUsDropdown from "./ContactUsDropdown"; // Make sure the path is correct
import { sanitizeHtml } from "@dpm/shared-module";

// Mock the sanitizeHtml function
jest.mock("@dpm/shared-module", () => ({
  sanitizeHtml: jest.fn(),
}));

// Mock the IconsSet
jest.mock("../../utils/icons", () => ({
  IconsSet: {
    call: "mocked-call-icon-url",
    email: "mocked-email-icon-url",
  },
}));

describe("ContactUsDropdown", () => {
  const mockNavigateTo = jest.fn();

  it("should render correctly when class is 'call'", () => {
    // Mock return value of sanitizeHtml
    (sanitizeHtml as jest.Mock).mockReturnValue("<p>Test Content</p>");

    const props = {
      attributes: { class: ["call"] },
      link_content: "<p>Test Content</p>",
      idx: 1,
      menuUrl: "/menu-url",
      linkName: "Test Link",
      navigateTo: mockNavigateTo,
    };

    render(<ContactUsDropdown {...props} />);

    // Check if content is sanitized and rendered correctly
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.queryByAltText("shuffle-icon")).not.toBeInTheDocument();
  });

  it("should render correctly when class is not 'call' and handle click", () => {
    // Mock return value of sanitizeHtml
    (sanitizeHtml as jest.Mock).mockReturnValue("<p>Test Content</p>");

    const props = {
      attributes: { class: ["email"] },
      link_content: "<p>Test Content</p>",
      idx: 1,
      menuUrl: "/menu-url",
      linkName: "Email Us",
      navigateTo: mockNavigateTo,
    };

    render(<ContactUsDropdown {...props} />);

    // Check if the icon image and link name are rendered
    expect(screen.getByAltText("shuffle-icon")).toHaveAttribute(
      "src",
      "mocked-email-icon-url"
    );
    expect(screen.getByText("Email Us")).toBeInTheDocument();

    // Simulate the click
    fireEvent.click(screen.getByText("Email Us"));

    // Check if the navigateTo function is called with correct argument
    expect(mockNavigateTo).toHaveBeenCalledWith("/menu-url");
  });
});
