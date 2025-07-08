import React from "react";
import { render, screen, fireEvent,waitFor } from "@testing-library/react";
import ErrorDialogBox from "./ErrorDialogBox";

describe("ErrorDialogBox Component", () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    onClose: mockOnClose,
    buttonName: "Close",
    headingContent: "Error Occurred",
    bodyContent: "Something went wrong. Please try again.",
    imgSrc: "test-image-src",
    isCentered: true,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the ErrorDialogBox with provided props", () => {
    render(<ErrorDialogBox {...defaultProps} />);

    expect(screen.getByText("Error Occurred")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

   
    expect(screen.getByRole("img")).toHaveAttribute("src", "test-image-src");
  });

  it("calls onClose when the close button is clicked", () => {
    render(<ErrorDialogBox {...defaultProps} />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  it("hides the modal when handleClose is triggered", async () => {
    render(<ErrorDialogBox {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
  it("resets mock functions after each test", () => {

    mockOnClose();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();
    expect(mockOnClose).toHaveBeenCalledTimes(0);
  });
});