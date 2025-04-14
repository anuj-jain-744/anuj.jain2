import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeTextbox } from "./index";

describe("ThemeTextbox Component", () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  const setup = (props: any) => {
    render(<ThemeTextbox {...props} />);
  };

  it("renders correctly with given props", () => {
    const name = "testInput";
    const placeholder = "Enter Text";
    const type = "text";
    const value = "Test Value";
    const errorValue = "Invalid Input";

    setup({ name, placeholder, type, value, errorValue });

    // Check if the input element renders with the correct placeholder
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();

    // Check if the input value is rendered correctly
    expect(screen.getByPlaceholderText(placeholder)).toHaveValue(value);

    // Check if the error message is rendered
    expect(screen.getByText(errorValue)).toBeInTheDocument();
  });

  it("calls the onChange handler when value is changed", () => {
    const name = "testInput";
    const placeholder = "Enter Text";
    const type = "text";
    const value = "Test Value";

    setup({ name, placeholder, type, value, onChangehandler: mockOnChange });

    const inputElement = screen.getByPlaceholderText(placeholder);
    fireEvent.change(inputElement, { target: { value: "New Value" } });

    // Check if the mock onChange function was called
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls the onBlur handler when the input field loses focus", () => {
    const name = "testInput";
    const placeholder = "Enter Text";
    const type = "text";
    const value = "Test Value";

    setup({ name, placeholder, type, value, onBlurhandler: mockOnBlur });

    const inputElement = screen.getByPlaceholderText(placeholder);
    fireEvent.blur(inputElement);

    // Check if the mock onBlur function was called
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("renders correctly with maxLength prop", () => {
    const name = "testInput";
    const placeholder = "Enter Text";
    const type = "text";
    const maxLengthIs = 10;

    setup({ name, placeholder, type, maxLengthIs });

    const inputElement = screen.getByPlaceholderText(placeholder);
    // Check if the input element has the correct maxLength
    expect(inputElement).toHaveAttribute("maxLength", maxLengthIs.toString());
  });

  it("does not render error message when errorValue is not provided", () => {
    const name = "testInput";
    const placeholder = "Enter Text";
    const type = "text";

    setup({ name, placeholder, type });

    // Check that no error message is rendered when errorValue is undefined
    const validationText = screen.queryByText(/Invalid Input/i);
    expect(validationText).toBeNull();
  });

  it("renders input field with correct type", () => {
    const name = "testInput";
    const placeholder = "Enter Text";
    const type = "password";

    setup({ name, placeholder, type });

    // Check if the input field has the correct type
    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toHaveAttribute("type", "password");
  });
});
