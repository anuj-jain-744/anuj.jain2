import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DialogBox from "./DialogBox";

describe("DialogBox Component", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    onClose: mockOnClose,
    title: "Test Title",
    description: "Test Description",
    subDescription: "Test SubDescription",
    iconType: "warning",
    totalButtons: 2,
    buttonOneText: "Cancel",
    buttonTwoText: "Confirm",
    onConfirm: mockOnConfirm,
  };

  it("renders correctly with default props", () => {
    render(<DialogBox {...defaultProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test SubDescription")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByAltText("warning")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    render(<DialogBox {...defaultProps} />);
    const closeButton = screen.getByText("Cancel");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    render(<DialogBox {...defaultProps} />);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("renders only one button when totalButtons is 1", () => {
    render(<DialogBox {...defaultProps} totalButtons={1} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
  });

  it("renders the correct icon based on iconType", () => {
    render(<DialogBox {...defaultProps} iconType="warning" />);
    expect(screen.getByAltText("warning")).toBeInTheDocument();
  });
});