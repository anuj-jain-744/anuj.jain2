import React from "react";
import { render } from "@testing-library/react";
import UserResponse from "./UserResponse";

describe("UserResponse Component", () => {
  const mockProps = {
    languageData: {}, // Add relevant mock data if necessary
    conversation: {
      user: "testUser",
      name: "John Doe",
      message: "This is a test message.",
      dateTime: "2025-06-16 10:00 AM",
    },
  };

  it("should render the user's name", () => {
    const { getByText } = render(<UserResponse {...mockProps} />);
    expect(getByText("John Doe")).toBeInTheDocument();
  });

  it("should render the conversation message", () => {
    const { getByText } = render(<UserResponse {...mockProps} />);
    expect(getByText("This is a test message.")).toBeInTheDocument();
  });

  it("should render the conversation date and time", () => {
    const { getByText } = render(<UserResponse {...mockProps} />);
    expect(getByText("2025-06-16 10:00 AM")).toBeInTheDocument();
  });

  it("should render the user profile image", () => {
    const { getByAltText } = render(<UserResponse {...mockProps} />);
    expect(getByAltText("user dp")).toBeInTheDocument();
  });
});