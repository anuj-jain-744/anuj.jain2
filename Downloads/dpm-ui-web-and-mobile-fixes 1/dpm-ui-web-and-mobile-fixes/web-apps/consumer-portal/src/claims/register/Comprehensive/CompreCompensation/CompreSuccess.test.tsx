import React from "react";
import { render, screen } from "@testing-library/react";
import CompreSuccess from "./CompreSuccess";
import { DataContext } from "../../../../DataContext";

const mockData = {
  police_case_reference: "Police Case Reference",
  owner_id: "Owner ID",
  vehicle_sequence: "Vehicle Sequence",
};

describe("CompreSuccess", () => {
  it("renders correctly with provided data", () => {
    render(
      <DataContext.Provider value={mockData}>
        <CompreSuccess />
      </DataContext.Provider>
    );

    expect(screen.getByText("Police Case Reference")).toBeInTheDocument();
    expect(screen.getByText("Owner ID")).toBeInTheDocument();
    expect(screen.getByText("Vehicle Sequence")).toBeInTheDocument();
  });

  it("renders the correct class names", () => {
    render(
      <DataContext.Provider value={mockData}>
        <CompreSuccess />
      </DataContext.Provider>
    );

    expect(screen.getByText("Police Case Reference").closest("div")).toHaveClass("register-claim-info-estimate-title walaa-regular-400");
    expect(screen.getByText("Owner ID").closest("div")).toHaveClass("register-claim-info-estimate-title walaa-regular-400");
    expect(screen.getByText("Vehicle Sequence").closest("div")).toHaveClass("register-claim-info-estimate-title walaa-regular-400");
  });
});