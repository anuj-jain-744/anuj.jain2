import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteAlert from "./index";

describe("DeleteAlert Component", () => {
  const mockHandleAlertClose = jest.fn();

  it("should render the DeleteAlert component with the correct title", () => {
    render(<DeleteAlert title="Test Alert" handleAlertClose={mockHandleAlertClose} />);

    // Check if the title is rendered
    expect(screen.getByText("Test Alert")).toBeInTheDocument();

    // Check if the CheckCircleIcon is rendered using data-testid
    expect(screen.getByTestId("CheckCircleIcon")).toBeInTheDocument();

    // Check if the close button is rendered
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("should call handleAlertClose when the close button is clicked", () => {
    render(<DeleteAlert title="Test Alert" handleAlertClose={mockHandleAlertClose} />);

    // Simulate clicking the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Verify that the handleAlertClose function was called
    expect(mockHandleAlertClose).toHaveBeenCalledTimes(1);
  });
});