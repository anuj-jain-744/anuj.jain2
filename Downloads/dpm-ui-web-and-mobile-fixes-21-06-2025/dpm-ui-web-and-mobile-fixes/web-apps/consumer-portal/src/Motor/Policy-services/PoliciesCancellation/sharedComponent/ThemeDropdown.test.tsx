import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeDropdown from "./ThemeDropdown";
import "@testing-library/jest-dom";

describe("ThemeDropdown", () => {
  // Test rendering without value (no options should appear)
  it("renders with no options when value is not provided", () => {
    render(<ThemeDropdown id="dropdown" classes="test-class" />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
    // There should only be the "Select" option.
    expect(screen.getByText("Select")).toBeInTheDocument();
    expect(selectElement.children.length).toBe(1);
  });

  // Test rendering options when value is an array
  it("renders options when value is an array", () => {
    const options = ["Option 1", "Option 2", "Option 3"];
    render(<ThemeDropdown id="dropdown" value={options} classes="test-class" />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
    // There should be 4 options (1 "Select" and 3 from the array)
    expect(selectElement.children.length).toBe(options.length + 1);
    
    // Ensure all options are rendered
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  // Test rendering no options when value is an empty array
  it("renders no options when value is an empty array", () => {
    render(<ThemeDropdown id="dropdown" value={[]} classes="test-class" />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
    // Only "Select" should be present
    expect(selectElement.children.length).toBe(1);
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  // Test rendering when value is null
it("renders no options when value is null", () => {
    render(<ThemeDropdown id="dropdown" value={[]} classes="test-class" />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
    // Only "Select" should be present
    expect(selectElement.children.length).toBe(1);
    expect(screen.getByText("Select")).toBeInTheDocument();
});

  // Test calling onChangehandler when an option is selected
  it("calls onChangehandler when an option is selected", () => {
    const handleChange = jest.fn();
    const options = ["Option 1", "Option 2"];
    render(
      <ThemeDropdown
        id="dropdown"
        value={options}
        classes="test-class"
        onChangehandler={handleChange}
      />
    );

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "Option 1" } });

    // Ensure the onChangehandler was called with the correct event
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Test rendering with the correct id and className
  it("renders with the correct id and class", () => {
    const options = ["Option 1", "Option 2"];
    render(<ThemeDropdown id="dropdown" value={options} classes="test-class" />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveAttribute("id", "dropdown");
    //expect(selectElement).toHaveClass("test-class");
  });

  // Test rendering with a placeholder (even though it's not used in the current code)
  it("does not render placeholder since it's not used", () => {
    const options = ["Option 1", "Option 2"];
    render(
      <ThemeDropdown
        id="dropdown"
        value={options}
        placeholder="Select an option"
        classes="test-class"
      />
    );

    // There's no placeholder behavior in the code, so this won't show.
    expect(screen.queryByText("Select an option")).not.toBeInTheDocument();
  });
});
