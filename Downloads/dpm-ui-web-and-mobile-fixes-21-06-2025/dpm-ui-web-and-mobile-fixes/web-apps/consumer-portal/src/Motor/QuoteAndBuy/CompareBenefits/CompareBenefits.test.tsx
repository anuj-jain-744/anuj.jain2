import { render, screen, fireEvent } from "@testing-library/react";
import CompareBenefits from "./index";
import data from "./CompareBenefits.json";

describe("CompareBenefits Component", () => {
  const mockOnClose = jest.fn();

  it("should render the modal when showCompareBenefits is true", () => {
    render(<CompareBenefits showCompareBenefits={true} onClose={mockOnClose} />);

    // Check if the modal is displayed
    expect(screen.getByText(data.compare)).toBeInTheDocument();
    expect(screen.getByText(data.benefit)).toBeInTheDocument();
  });

  it("should call onClose when the close button is clicked", () => {
    render(<CompareBenefits showCompareBenefits={true} onClose={mockOnClose} />);

    // Simulate clicking the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    // Verify that onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should render benefits data correctly", () => {
    render(<CompareBenefits showCompareBenefits={true} onClose={mockOnClose} />);

    // Check if benefits data is rendered
    data.benefits.forEach((benefit) => {
      expect(screen.getByText(benefit.name)).toBeInTheDocument();
    });
  });

  it("should not render the modal when showCompareBenefits is false", () => {
    render(<CompareBenefits showCompareBenefits={false} onClose={mockOnClose} />);

    // Check that modal content is not displayed
    expect(screen.queryByText(data.compare)).not.toBeInTheDocument();
  });
});