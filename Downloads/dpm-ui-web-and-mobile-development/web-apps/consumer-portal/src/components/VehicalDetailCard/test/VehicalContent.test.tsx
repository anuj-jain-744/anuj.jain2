import React from "react";
import { render, screen } from "@testing-library/react";
import VehicalContent, { VehicleItem } from "../VehicalContent";
import Nissan from "assets/Endorsement/Nissan.svg";

describe("VehicalContent", () => {
  const mockVehicleData: VehicleItem[] = [
    { label: "Model", value: "Altima" },
    { label: "Year", value: "2020" },
  ];

  test("renders vehicle data correctly", () => {
    render(<VehicalContent vehicleData={mockVehicleData} />);

    // Check if the logo is rendered
    const logo = screen.getByAltText("");
    expect(logo).toHaveAttribute("src", Nissan);

    // Check if the vehicle data is rendered
    mockVehicleData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });
});