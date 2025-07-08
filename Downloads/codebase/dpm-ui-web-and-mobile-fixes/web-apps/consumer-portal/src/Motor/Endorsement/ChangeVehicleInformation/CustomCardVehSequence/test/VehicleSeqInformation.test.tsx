import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VehicleSeqInformation from "../VehicleSeqInformation";
import { DataContext } from "DataContext";

// Mock data for DataContext
const mockData = {
  custom_card_no: "Custom Card No",
  enter_vehicle_sequence_no: "Enter Vehicle Sequence No",
  validate_sequence_no: "Validate Sequence No",
};

describe("VehicleSeqInformation Component", () => {
  test("renders correctly with provided data", () => {
    render(
      <DataContext.Provider value={mockData}>
        <VehicleSeqInformation />
      </DataContext.Provider>
    );

    // Check if the titles are rendered
    expect(screen.getAllByText(mockData.custom_card_no)).toHaveLength(2);

    // Check if the placeholders are rendered
    expect(screen.getAllByPlaceholderText(mockData.enter_vehicle_sequence_no)).toHaveLength(2);

    // Check if the buttons are rendered with correct text
    expect(screen.getAllByText(mockData.validate_sequence_no)).toHaveLength(2);
  });

  test("handles radio button change correctly", () => {
    render(
      <DataContext.Provider value={mockData}>
        <VehicleSeqInformation />
      </DataContext.Provider>
    );

    // Get the radio buttons
    const radioButtons = screen.getAllByRole("radio");

    // Check initial state
    expect(radioButtons[0]).toBeChecked();
    expect(radioButtons[1]).not.toBeChecked();

    // Simulate changing the radio button
    fireEvent.click(radioButtons[1]);

    // Check if the state has changed
    expect(radioButtons[0]).not.toBeChecked();
    expect(radioButtons[1]).toBeChecked();
  });
});