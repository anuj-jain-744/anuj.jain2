import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeTextbox from "./ThemeTextbox";

describe("ThemeTextbox", () => {
  it("renders with default props", () => {
    render(<ThemeTextbox name="test" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a title", () => {
    render(<ThemeTextbox name="test" title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders with a placeholder", () => {
    render(<ThemeTextbox name="test" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("calls onChangehandler when input changes", () => {
    const handleChange = jest.fn();
    render(<ThemeTextbox name="test" onChangehandler={handleChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error message", () => {
    render(<ThemeTextbox name="test" errorMessage="Error occurred" />);
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("calls onBlurHandler when input loses focus", () => {
    const handleBlur = jest.fn();
    render(<ThemeTextbox name="test" value="test value" onBlurHandler={handleBlur} />);
    fireEvent.blur(screen.getByRole("textbox"));
    expect(handleBlur).toHaveBeenCalledWith("test value", "test");
  });

  it("calls handleOnBlur when input loses focus", () => {
    const handleOnBlur = jest.fn();
    render(<ThemeTextbox name="test" handleOnBlur={handleOnBlur} />);
    fireEvent.blur(screen.getByRole("textbox"));
    expect(handleOnBlur).toHaveBeenCalled();
  });

  it("renders children", () => {
    render(
      <ThemeTextbox name="test">
        <span>Child Element</span>
      </ThemeTextbox>
    );
    expect(screen.getByText("Child Element")).toBeInTheDocument();
  });

  it("applies custom classes", () => {
    render(<ThemeTextbox name="test" classes="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("is disabled when disabled prop is true", () => {
    render(<ThemeTextbox name="test" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("limits input length with maxLength prop", () => {
    render(<ThemeTextbox name="test" maxLength={5} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "5");
  });
});