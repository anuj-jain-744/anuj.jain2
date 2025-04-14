import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeDatePicker } from "./index";
import { Value } from "react-multi-date-picker";
import DateObject from "react-date-object";

describe("ThemeDatePicker Component", () => {
  const mockOnChange = jest.fn();

  const setup = (props: any) => {
    render(<ThemeDatePicker {...props} />);
  };

  it("renders correctly with given props", () => {
    const name = "testDatePicker";
    const placeholder = "Select Date";
    const format = "YYYY-MM-DD";
    const value = new DateObject();
    const errorValue = "Invalid Date";

    setup({
      name,
      placeholder,
      onChangehandler: mockOnChange,
      value,
      format,
      errorValue,
    });

    // Check if the placeholder is rendered
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();

    // Check if the error message is rendered
    expect(screen.getByText(errorValue)).toBeInTheDocument();
  });

  it("calls the onChange handler when a date is selected", () => {
    const name = "testDatePicker";
    const placeholder = "Select Date";
    const value = new DateObject();
    const mockHandler = jest.fn();

    setup({ name, placeholder, onChangehandler: mockHandler, value });

    const inputElement = screen.getByPlaceholderText(placeholder);
    fireEvent.change(inputElement, { target: { value: "2025-02-13" } });

    // Check if the mock handler was called
    expect(mockHandler).toHaveBeenCalled();
  });

  it("renders Hijri calendar and locale when calendarType is 'Hijri'", () => {
    const name = "testDatePicker";
    const placeholder = "Select Date";
    const calendarType = "Hijri";

    setup({ name, placeholder, onChangehandler: mockOnChange, calendarType });

    // Check if the calendar has Hijri-specific attributes or class
    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toHaveAttribute("data-calendar", "Hijri");
  });

  it("renders Gregorian calendar when calendarType is not 'Hijri'", () => {
    const name = "testDatePicker";
    const placeholder = "Select Date";
    const calendarType = "Gregorian";

    setup({ name, placeholder, onChangehandler: mockOnChange, calendarType });

    // Check that the calendar is not using Hijri
    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).not.toHaveAttribute("data-calendar", "Hijri");
  });

  it("displays the correct format", () => {
    const name = "testDatePicker";
    const placeholder = "Select Date";
    const format = "YYYY-MM-DD";
    const value = new DateObject();

    setup({ name, placeholder, onChangehandler: mockOnChange, value, format });

    // Check if the value matches the format
    const inputElement = screen.getByPlaceholderText(placeholder);
    expect(inputElement).toHaveValue(value.format(format));
  });

  it("does not render error message when errorValue is not provided", () => {
    const name = "testDatePicker";
    const placeholder = "Select Date";

    setup({ name, placeholder, onChangehandler: mockOnChange });

    // Check that no error message is rendered
    const validationText = screen.queryByText(/Invalid Date/i);
    expect(validationText).toBeNull();
  });
});
