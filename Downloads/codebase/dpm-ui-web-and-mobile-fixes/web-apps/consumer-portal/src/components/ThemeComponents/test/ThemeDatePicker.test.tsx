import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeDatePicker from "../ThemeDatePicker";

jest.mock("react-multi-date-picker", () => {
  return jest.fn(({ name, placeholder, onChange, value }) => (
    <input
      data-testid="date-picker"
      name={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ));
});

describe("ThemeDatePicker Component", () => {
  test("renders ThemeDatePicker with provided props", () => {
    render(
      <ThemeDatePicker 
        name="test-date-picker" 
        placeholder="Select Date" 
        value={new Date("2025-03-27")} 
        format="YYYY-MM-DD" 
        errorValue="Invalid date" 
      />
    );
    
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
    expect(screen.getByTestId("date-picker")).toHaveAttribute("name", "test-date-picker");
    expect(screen.getByTestId("date-picker")).toHaveAttribute("placeholder", "Select Date");
    expect(screen.getByText("Invalid date")).toBeInTheDocument();
  });

  test("calls onChangehandler when date is selected", () => {
    const mockOnChange = jest.fn();
    render(<ThemeDatePicker name="test" placeholder="Select" onChangehandler={mockOnChange} />);

    const datePicker = screen.getByTestId("date-picker");
    fireEvent.change(datePicker, { target: { value: "2025-03-27" } });

    expect(mockOnChange).toHaveBeenCalledWith("2025-03-27", undefined);
  });
});
