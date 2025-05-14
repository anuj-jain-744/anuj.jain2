import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CoveragePlanType from "./index";
import "@testing-library/jest-dom";

jest.mock("../RadioCard", () => {
  return ({ radiokey, label, cardlistitems, checked, onChange, TravelData }: any) => (
    <div data-testid="radio-card">
      <input
        type="radio"
        data-testid={`radio-${radiokey}`}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </div>
  );
});

describe("CoveragePlanType", () => {
  const mockOnChange = jest.fn();
  const mockCoveragePlanData = [
    { key: "plan1", title: "Plan 1", details: ["Detail 1"], codeid: "code1" },
    { key: "plan2", title: "Plan 2", details: ["Detail 2"], codeid: "code2" },
  ];
  const mockTravelData = { someData: "data" };

  it("renders the CoveragePlanType component with required props", () => {
    render(
      <CoveragePlanType
        TravelData={mockTravelData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="plan1"
      />
    );

    const radioCards = screen.getAllByTestId("radio-card");
    expect(radioCards).toHaveLength(mockCoveragePlanData.length);
  });

  it("calls onChange with correct arguments when a radio button is clicked", () => {
    render(
      <CoveragePlanType
        TravelData={mockTravelData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="plan1"
      />
    );

    const radioButton = screen.getByTestId("radio-plan2");
    fireEvent.click(radioButton);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), "code2");
  });

  it("passes the correct props to RadioCard components", () => {
    render(
      <CoveragePlanType
        TravelData={mockTravelData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="plan1"
      />
    );

    const radioButton1 = screen.getByTestId("radio-plan1");
    const radioButton2 = screen.getByTestId("radio-plan2");

    expect(radioButton1).toBeChecked();
    expect(radioButton2).not.toBeChecked();
  });
});