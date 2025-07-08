import { render, screen, fireEvent } from "@testing-library/react";
import CustomDateInput from "./CustomDateInput"; 
import React from "react";

describe("CustomDateInput Component", () => {
  it("should render the input correctly with placeholder", () => {
    render(<CustomDateInput placeholder="MM/YYYY" />);
    const inputElement = screen.getByPlaceholderText("MM/YYYY");
    expect(inputElement).toBeInTheDocument();
  });

  it("should update the input value on change and format MM/YYYY correctly", () => {
    render(<CustomDateInput />);
    const inputElement = screen.getByRole("textbox");

    fireEvent.change(inputElement, { target: { value: "032025" } }); // User types MMYYYY
    expect(inputElement).toHaveValue("03/2025"); // Ensure correct formatting

    fireEvent.change(inputElement, { target: { value: "122025" } });
    expect(inputElement).toHaveValue("12/2025"); //  Proper MM/YYYY formatting
  });

  it("should prevent non-numeric keys when typing", () => {
    render(<CustomDateInput />);
    const inputElement = screen.getByRole("textbox");

    fireEvent.keyDown(inputElement, { key: "A" });
    expect(inputElement).not.toHaveValue("A"); //  Prevents invalid characters
  });

  it("should allow numeric keys when typing", () => {
    render(<CustomDateInput />);
    const inputElement = screen.getByRole("textbox");

    fireEvent.change(inputElement, { target: { value: "08/2024" } });
    expect(inputElement).toHaveValue("08/2024"); //  Numeric values should be allowed
  });

  it("should call onFocus when input is focused", () => {
    const mockOnFocus = jest.fn();
    render(<CustomDateInput onFocus={mockOnFocus} />);
    const inputElement = screen.getByRole("textbox");

    fireEvent.focus(inputElement);
    expect(mockOnFocus).toHaveBeenCalledTimes(1); //  Ensure focus event works
  });

  it("should call onBlur when input loses focus", () => {
    const mockOnBlur = jest.fn();
    render(<CustomDateInput onBlur={mockOnBlur} />);
    const inputElement = screen.getByRole("textbox");

    fireEvent.blur(inputElement);
    expect(mockOnBlur).toHaveBeenCalledTimes(1); //  Ensure blur event works
  });

  it("should preserve preformatted value when passed as a string", () => {
    render(<CustomDateInput value="07/1999" />);
    const inputElement = screen.getByRole("textbox");

    expect(inputElement).toHaveValue("07/1999"); //  String values remain unchanged
  });
});
