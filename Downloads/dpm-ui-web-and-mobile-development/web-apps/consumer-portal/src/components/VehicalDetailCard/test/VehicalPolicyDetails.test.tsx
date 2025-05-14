import React from "react";
import { render, screen } from "@testing-library/react";
import VehicalPolicyDetails, { VehicleItem } from "../VehicalPolicyDetails";

describe("VehicalPolicyDetails", () => {
  const mockPolicyDetail: VehicleItem[] = [
    { label: "Policy Number", value: "123456" },
    { label: "Coverage", value: "Full" },
  ];

  test("renders policy details correctly", () => {
    render(<VehicalPolicyDetails policyDetail={mockPolicyDetail} />);

    // Check if the policy details are rendered
    mockPolicyDetail.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });
});