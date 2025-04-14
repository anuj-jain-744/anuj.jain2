import { render, screen, fireEvent } from "@testing-library/react";
import ShowChipButtons from "./ShowChipButtons"; // Adjust the import path accordingly
import "@testing-library/jest-dom";
import ThemeButton from "../ThemeButton";

// Mock ThemeButton component to avoid testing its implementation
jest.mock("../ThemeButton", () => ({
  __esModule: true,
  default: ({
    name,
    handleClick,
  }: {
    name: string;
    handleClick: () => void;
  }) => (
    <button onClick={handleClick} className="chip-button">
      {name}
    </button>
  ),
}));

describe("ShowChipButtons Component", () => {
  const handleOptionsMock = jest.fn();

  const mockProps = {
    title: "Mock Title",
    keywords: ["keyword1", "keyword2", "keyword3"],
    handleOptions: handleOptionsMock,
  };

  beforeEach(() => {
    handleOptionsMock.mockClear(); // Reset mock before each test
  });

  it("should render the title correctly", () => {
    render(<ShowChipButtons {...mockProps} />);

    // Check if the title is rendered correctly
    expect(screen.getByText("Mock Title")).toBeInTheDocument();
  });

  it("should render the correct number of ThemeButton components based on keywords", () => {
    render(<ShowChipButtons {...mockProps} />);

    // Check that there are as many buttons as keywords in the list
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(mockProps.keywords.length);
  });

  it("should call handleOptions with correct arguments when a button is clicked", () => {
    render(<ShowChipButtons {...mockProps} />);

    // Find the first button (which corresponds to "keyword1") and simulate a click
    const firstButton = screen.getByText("keyword1");
    fireEvent.click(firstButton);

    // Ensure handleOptions was called with the correct arguments
    expect(handleOptionsMock).toHaveBeenCalledWith("keyword1", true);

    // Simulate a click for the second button (keyword2)
    const secondButton = screen.getByText("keyword2");
    fireEvent.click(secondButton);

    // Ensure handleOptions was called with the correct arguments for the second button
    expect(handleOptionsMock).toHaveBeenCalledWith("keyword2", true);
  });

  it("should render the correct classes on buttons", () => {
    render(<ShowChipButtons {...mockProps} />);

    // Check if each ThemeButton has the expected class
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("chip-button");
    });
  });
});
