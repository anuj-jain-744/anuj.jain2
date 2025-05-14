import { render, screen, fireEvent } from "@testing-library/react";
import ShowOptions from "./ShowOptions"; // Adjust the import path accordingly
import "@testing-library/jest-dom";

describe("ShowOptions Component", () => {
  const handleOptionsMock = jest.fn();

  const mockProps = {
    options: ["Apple", "Banana", "Grape"],
    handleOptions: handleOptionsMock,
    searchInput: "Ap", // Input to highlight text in options
  };

  beforeEach(() => {
    handleOptionsMock.mockClear(); // Reset mock before each test
  });

  it("should render options correctly", () => {
    render(<ShowOptions {...mockProps} />);

    // Check if the options are rendered correctly
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Grape")).toBeInTheDocument();
  });

  it("should highlight matching text based on searchInput", () => {
    render(<ShowOptions {...mockProps} />);

    // Check if "Ap" is highlighted in the option "Apple"
    const highlightedApple = screen.getByText("Apple");
    expect(highlightedApple.innerHTML).toContain("<span>Ap</span>ple"); // Ensure the "Ap" part is wrapped in a <span>

    // Check if no text is highlighted in "Banana"
    const highlightedBanana = screen.getByText("Banana");
    expect(highlightedBanana.innerHTML).not.toContain("<span>Ap</span>"); // "Ap" shouldn't be in Banana
  });

  it("should call handleOptions with correct arguments when an option is clicked", () => {
    render(<ShowOptions {...mockProps} />);

    // Find the "Apple" option and simulate a click
    const appleOption = screen.getByText("Apple");
    fireEvent.click(appleOption);

    // Ensure handleOptions was called with the correct arguments
    expect(handleOptionsMock).toHaveBeenCalledWith("Apple", true);

    // Simulate a click for the "Banana" option
    const bananaOption = screen.getByText("Banana");
    fireEvent.click(bananaOption);

    // Ensure handleOptions was called with the correct arguments for "Banana"
    expect(handleOptionsMock).toHaveBeenCalledWith("Banana", true);
  });

  it("should render options with correct classes", () => {
    render(<ShowOptions {...mockProps} />);

    // Check that options have the expected class
    const optionElements = screen.getAllByRole("span");
    optionElements.forEach((option) => {
      expect(option).toHaveClass("walaa-regular-400");
    });
  });

  it("should render the highlighted text within the span", () => {
    render(<ShowOptions {...mockProps} />);

    // Check if the highlighted part of the text is wrapped in <span> tags
    const option = screen.getByText("Apple");
    const span = option.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe("Ap"); // "Ap" should be inside the <span> tag
  });

  it("should not highlight text if no matching input is found", () => {
    render(<ShowOptions {...mockProps} searchInput="xyz" />);

    // Check if no text is highlighted when searchInput doesn't match any option
    const option = screen.getByText("Apple");
    expect(option.innerHTML).toBe("Apple"); // No span should be added
  });
});
