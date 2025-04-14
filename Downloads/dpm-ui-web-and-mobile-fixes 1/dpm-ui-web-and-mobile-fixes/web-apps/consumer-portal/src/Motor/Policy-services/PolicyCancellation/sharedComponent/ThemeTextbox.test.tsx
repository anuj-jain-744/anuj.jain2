import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeTextbox from "./ThemeTextbox";
import "@testing-library/jest-dom";

describe("ThemeTextbox", () => {
  // Test that the input field renders correctly with given props
  it("renders correctly with provided props", () => {
    render(
      <ThemeTextbox
        name="textbox"
        placeholder="Enter text"
        value="Test value"
        classes="test-class"
        onKeyPress={() => {}}
        onChangehandler={() => {}}
        onBlurHandler={() => {}}
      />
    );

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("placeholder", "Enter text");
    expect(inputElement).toHaveValue("Test value");
    expect(inputElement).toHaveClass("test-class");
  });

  // Test that the `onChangehandler` is called when the input value changes
  it("calls onChangehandler when value changes", () => {
    const handleChange = jest.fn();
    render(
      <ThemeTextbox
        name="textbox"
        placeholder="Enter text"
        value=""
        classes="test-class"
        onKeyPress={() => {}}
        onChangehandler={handleChange}
        onBlurHandler={() => {}}
      />
    );

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "New value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Test that the `onBlurHandler` is called when the input loses focus
  it("calls onBlurHandler when input loses focus", () => {
    const handleBlur = jest.fn();
    render(
      <ThemeTextbox
        name="textbox"
        placeholder="Enter text"
        value="Test value"
        classes="test-class"
        onKeyPress={() => {}}
        onChangehandler={() => {}}
        onBlurHandler={handleBlur}
      />
    );

    const inputElement = screen.getByRole("textbox");
    fireEvent.blur(inputElement);
    expect(handleBlur).toHaveBeenCalledWith("Test value", "textbox");
  });

  // Test the `disabled` prop: input should be disabled
  it("disables the input when disabled prop is true", () => {
    render(
      <ThemeTextbox
        name="textbox"
        placeholder="Enter text"
        value="Test value"
        classes="test-class"
        onKeyPress={() => {}}
        onChangehandler={() => {}}
        onBlurHandler={() => {}}
        disabled={true}
      />
    );

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeDisabled();
  });

  // Test the `maxlength` prop: the input should not allow more than the specified length
  it("limits input length based on maxlength prop", () => {
    render(
      <ThemeTextbox
        name="textbox"
        placeholder="Enter text"
        value=""
        classes="test-class"
        onKeyPress={() => {}}
        onChangehandler={() => {}}
        onBlurHandler={() => {}}
        maxlength={5}
      />
    );

    const inputElement = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: "123456" } });
    expect(inputElement.value).toBe("12345"); // Should stop at 5 characters
  });

  // Test the `selectedValue` prop: it should override the `value` prop
  it("renders with selectedValue prop overriding value", () => {
    render(
      <ThemeTextbox
        name="textbox"
        placeholder="Enter text"
        value="Initial value"
        selectedValue="Selected value"
        classes="test-class"
        onKeyPress={() => {}}
        onChangehandler={() => {}}
        onBlurHandler={() => {}}
      />
    );

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveValue("Selected value");
  });

  // Test handling of `onKeyPress` events
  it("calls onKeyPress when a key is pressed", () => {
    const handleKeyPress = jest.fn();
    render(
      <ThemeTextbox
        name="textbox"
        placeholder="Enter text"
        value="Test value"
        classes="test-class"
        onKeyPress={handleKeyPress}
        onChangehandler={() => {}}
        onBlurHandler={() => {}}
      />
    );

    const inputElement = screen.getByRole("textbox");
    fireEvent.keyUp(inputElement, { key: "Enter" });
    fireEvent.keyDown(inputElement, { key: "Enter" });
    expect(handleKeyPress).toHaveBeenCalledTimes(2); // Once for keyUp, once for keyDown
  });
});
