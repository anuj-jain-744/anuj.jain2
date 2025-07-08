import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemeDropdown from "../ThemeDropdown";

describe("ThemeDropdown Component", () => {
  test("renders without crashing", () => {
    render(<ThemeDropdown classes="test-class" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("renders placeholder option", () => {
    render(<ThemeDropdown classes="test-class" />);
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  test("renders options when value is an array", () => {
    const options = ["Option 1", "Option 2"];
    render(<ThemeDropdown classes="test-class" value={options} />);
    options.forEach(option => {
    waitFor(() => { 
      expect(screen.getByText(option)).toBeInTheDocument();
    });
    });
  });

  test("calls onChangehandler when an option is selected", () => {
    const handleChange = jest.fn();
    const options = ["Option 1", "Option 2"];
    render(<ThemeDropdown classes="test-class" value={options} onChangehandler={handleChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: options[0] } });
    expect(handleChange).toHaveBeenCalled();
  });
});