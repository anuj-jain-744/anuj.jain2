import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CardDetailsFrameValue from "./CardDetailsFrameValue";

jest.mock("components/ThemeDropdown/ThemeDropdown", () => {
  return jest.fn(({ onChangehandler, value, selectedValue }) => (
    <select onChange={onChangehandler} value={selectedValue || value[0]}>
      {value.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  ));
});

jest.mock("components/ThemeTextbox/ThemeTextbox", () => {
  return jest.fn(({ onChangehandler, value }) => (
    <input type="text" onChange={onChangehandler} value={value} />
  ));
});

describe("CardDetailsFrameValue Component", () => {
  const mockOnChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders dropdown correctly", () => {
    render(
      <CardDetailsFrameValue
        label="Select Option"
        type="dropdown"
        value={["Option 1", "Option 2"]}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText("Select Option")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Option 2" })).toBeInTheDocument();
  });

  test("calls onChange when selecting a dropdown option", () => {
    render(
      <CardDetailsFrameValue
        label="Select Option"
        type="dropdown"
        value={["Option 1", "Option 2"]}
        onChange={mockOnChange}
      />
    );

    const dropdown = screen.getByRole("combobox");
    fireEvent.change(dropdown, { target: { value: "Option 2" } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  test("renders textbox correctly", () => {
    render(
      <CardDetailsFrameValue
        label="Enter Value"
        type="textbox"
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText("Enter Value")).toBeInTheDocument();
    const textbox = screen.getByRole("textbox");
    expect(textbox).toBeInTheDocument();
  });

  test('calls onChange when typing in the textbox', () => {
    const mockOnChange = jest.fn();
    const { getByRole } = render(
        <CardDetailsFrameValue
          label="Enter Value"
          type="textbox"
          value=""
          onChange={mockOnChange}
        />
      );
  
    const textbox = getByRole('textbox');
    fireEvent.change(textbox, { target: { value: '0' } });
  
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: '0',
      }),
    }));
  });
});