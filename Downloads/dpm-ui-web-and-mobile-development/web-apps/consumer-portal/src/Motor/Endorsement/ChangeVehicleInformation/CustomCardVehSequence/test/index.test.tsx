import React from "react";
import { render } from "@testing-library/react";
import { DataContext } from "DataContext";
import CustomCardVehSequence from "../index";
import VehicleSeqInformation from "../VehicleSeqInformation";

describe("CustomCardVehSequence", () => {
  it("renders correctly with context data", () => {
    const mockData = {
      change_from_custom_card_no: "Test Card No"
    };

    const { getByText } = render(
      <DataContext.Provider value={mockData}>
        <CustomCardVehSequence />
      </DataContext.Provider>
    );

    expect(getByText("Test Card No")).toBeInTheDocument();
  });

  it("renders VehicleSeqInformation component", () => {
    const mockData = {
      change_from_custom_card_no: "Test Card No"
    };

    const { getByText } = render(
      <DataContext.Provider value={mockData}>
        <CustomCardVehSequence />
      </DataContext.Provider>
    );

    expect(getByText("Test Card No")).toBeInTheDocument();
    expect(getByText("VehicleSeqInformation")).toBeInTheDocument();
  });
});