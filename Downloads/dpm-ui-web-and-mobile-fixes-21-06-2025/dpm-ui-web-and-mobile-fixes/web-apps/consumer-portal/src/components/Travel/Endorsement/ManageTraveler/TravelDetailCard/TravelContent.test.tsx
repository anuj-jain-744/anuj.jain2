import React from "react";
import { render, screen } from "@testing-library/react";
import TravelContent, { TravelItem } from "./TravelContent";

describe("TravelContent Component", () => {
  const mockTravelData: TravelItem[] = [
    { label: "Destination", value: "Paris" },
    { label: "Duration", value: "7 days" },
    { label: "Traveler", value: "John Doe" },
  ];

  it("renders correctly with travel data", () => {
    render(<TravelContent travelData={mockTravelData} />);

    mockTravelData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });

  it("renders nothing when travelData is empty", () => {
    render(<TravelContent travelData={[]} />);

    expect(screen.queryByText("Destination")).not.toBeInTheDocument();
    expect(screen.queryByText("Duration")).not.toBeInTheDocument();
    expect(screen.queryByText("Traveler")).not.toBeInTheDocument();
  });

  it("handles undefined travelData gracefully", () => {
    render(<TravelContent travelData={undefined as any} />);
    expect(screen.queryByText("Destination")).not.toBeInTheDocument();
  });
});