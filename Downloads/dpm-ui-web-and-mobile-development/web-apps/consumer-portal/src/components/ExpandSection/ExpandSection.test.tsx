import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExpandSection from "./ExpandSection";

describe("ExpandSection Component", () => {
  const mockOnClick = jest.fn();

  it("renders without crashing", () => {
    render(<ExpandSection onClick={mockOnClick} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays the text prop correctly", () => {
    const text = "Expand Me";
    render(<ExpandSection onClick={mockOnClick} text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("renders the icon when provided", () => {
    const icon = <span data-testid="icon">Icon</span>;
    render(<ExpandSection onClick={mockOnClick} icon={icon} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render the icon when not provided", () => {
    render(<ExpandSection onClick={mockOnClick} />);
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
  });

  it("calls the onClick handler when clicked", () => {
    render(<ExpandSection onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});