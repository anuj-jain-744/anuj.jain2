import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AlertBox } from "./index";

describe("AlertBox Component", () => {
  const mockSetShowAlertModal = jest.fn();

  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
    showAlertModal: true,
    setShowAlertModal: mockSetShowAlertModal,
  };

  it("renders AlertBox component with title and description", () => {
    render(<AlertBox {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });


  it("calls setShowAlertModal with false when close icon is clicked", () => {
    render(<AlertBox {...defaultProps} />);

    const closeIcon = document.querySelector('.icons-material-icons-close');

    if (closeIcon) {
        fireEvent.click(closeIcon);
        expect(mockSetShowAlertModal).toHaveBeenCalledWith(false);
    } else {
        throw new Error("Close icon not found");
    }
});

  it("does not render AlertBox when showAlertModal is false", () => {
    render(<AlertBox {...defaultProps} showAlertModal={false} />);

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });
});