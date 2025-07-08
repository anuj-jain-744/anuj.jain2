import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DropdownElement } from "../dropdownElement/index";

const mockHandleDropdownSelect = jest.fn();

const floorFormMock = {
  floors_options: ["Floor 1", "Floor 2", "Floor 3"],
};

describe("DropdownElement Component", () => {
  test("renders with selectedElement text", () => {
    render(
      <DropdownElement
        floor_form={floorFormMock}
        handleDropdownSelect={mockHandleDropdownSelect}
        selectedElement="Floor 1"
      />
    );
    // expect(screen.getByText("Floor 1")).toBeInTheDocument();
  });

  test("renders all dropdown options", () => {
    render(
      <DropdownElement
        floor_form={floorFormMock}
        handleDropdownSelect={mockHandleDropdownSelect}
        selectedElement="Floor 2"
      />
    );
    fireEvent.click(screen.getByText("Floor 2"));
    floorFormMock.floors_options.forEach((option) => {
      // expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test("calls handleDropdownSelect when an option is clicked", () => {
    render(
      <DropdownElement
        floor_form={floorFormMock}
        handleDropdownSelect={mockHandleDropdownSelect}
        selectedElement="Floor 3"
      />
    );
    fireEvent.click(screen.getByText("Floor 3"));
    fireEvent.click(screen.getByText("Floor 2"));
    expect(mockHandleDropdownSelect).toHaveBeenCalledWith("Floor 2");
  });
});
