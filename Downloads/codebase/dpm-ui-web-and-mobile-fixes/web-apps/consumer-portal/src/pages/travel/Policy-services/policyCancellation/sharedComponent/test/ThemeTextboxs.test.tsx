import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ThemeTextbox from "../ThemeTextbox";

describe("ThemeTextbox Component", () => {
  it("should render with default props", () => {
    const { getByPlaceholderText } = render(<ThemeTextbox name="test" />);
    waitFor(() => { 
         const inputElement = getByPlaceholderText(""); 
         expect(inputElement).toBeInTheDocument();
    });
  });

  it("should render with specific props", () => {
    const { getByPlaceholderText } = render(
      <ThemeTextbox
        name="test"
        placeholder="Enter text"
        value="Test value"
        classes="test-class"
        disabled={true}
      />
    );
    const inputElement = getByPlaceholderText("Enter text");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass("test-class");
    expect(inputElement).toBeDisabled();
    expect(inputElement).toHaveValue("Test value");
  });

  it("should call onChangehandler on change event", () => {
    const handleChange = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemeTextbox name="test" onChangehandler={handleChange} placeholder="Enter text" />
    );
    const inputElement = getByPlaceholderText("Enter text");
    fireEvent.change(inputElement, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("should call onBlurHandler on blur event", () => {
    const handleBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemeTextbox name="test" onBlurHandler={handleBlur} value="Test value" placeholder="Enter text" />
    );
    const inputElement = getByPlaceholderText("Enter text");
    fireEvent.blur(inputElement);
    expect(handleBlur).toHaveBeenCalledWith("Test value", "test");
  });
});