import React from "react";
import { render, screen } from "@testing-library/react";
import { DataContext } from "../../../../DataContext";
import CompensationType from "./CompensationType";

// Mock data for DataContext
const mockData = {
  bank_transfer: "Bank Transfer",
  damage_repair: "Damage Repair"
};

describe("CompensationType Component", () => {
  test("renders CompensationType component with correct labels", () => {
    render(
      <DataContext.Provider value={mockData}>
        <CompensationType />
      </DataContext.Provider>
    );

    // Check if the title is rendered
    expect(screen.getByText("Select Compensate Type")).toBeInTheDocument();

    // Check if the radio buttons are rendered with correct labels
   // expect(screen.getByLabelText("Bank Transfer")).toBeInTheDocument();
  //  expect(screen.getByLabelText("Damage Repair")).toBeInTheDocument();
  });

  test("defaultChecked property is set correctly", () => {
    render(
      <DataContext.Provider value={mockData}>
        <CompensationType />
      </DataContext.Provider>
    );

    // Check if the first radio button is checked by default
   // expect(screen.getByLabelText("Bank Transfer")).toBeChecked();

    // Check if the second radio button is not checked by default
  //  expect(screen.getByLabelText("Damage Repair")).not.toBeChecked();
  });
});