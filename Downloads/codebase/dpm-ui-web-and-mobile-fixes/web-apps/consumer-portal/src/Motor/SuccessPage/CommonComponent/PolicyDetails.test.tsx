import React from "react";
import { render, screen } from "@testing-library/react";
import PolicyDetails from "./PolicyDetails"; // Adjust the path as needed
import { PRODUCTCODE_MOTOR } from "constant";

// Mock utility functions
jest.mock("utils/policyDetails", () => ({
  getPlanName: jest.fn((planDetails, isShort) => (isShort ? "Short Plan Name" : "Full Plan Name")),
}));

jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn((amount) => `Icon ${amount}`),
}));

describe("PolicyDetails Component", () => {
  const mockLanguageData = {
    policy_no: "Policy Number",
    policy_period: "Policy Period",
    coverage_plan: "Coverage Plan",
    policy_holder_name: "Policy Holder Name",
    confirmed: "Confirmed",
  };

  const mockPolicyData = {
    premiumAmount: 5000,
  };

  const mockPlanDetails = {
    planName: "Comprehensive Plan",
  };

  const mockEndorsementRedisData = {
    productType: PRODUCTCODE_MOTOR,
    vehicleMakeText: "Toyota",
    vehicleModelText: "Corolla",
    plateNo: "ABC123",
    sponsorName: "John Doe",
    totalAmount: { totalAmount: 3000 },
    coverageName: 'Full Plan Name',
    policyNo: "12345"
  };

  it("renders correctly for non-endorsement policy", () => {
    render(
      <PolicyDetails
        languageData={mockLanguageData}
        policyNum="12345"
        policyData={mockPolicyData}
        planDetails={mockPlanDetails}
        policyPeriod="01 Jan 2023 - 31 Dec 2023"
        isEndosementPolicy={false}
      />
    );

    // Check Policy Number
    expect(screen.getByText("Policy Number")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();

    // Check Policy Period
    expect(screen.getByText("Policy Period")).toBeInTheDocument();
    expect(screen.getByText("01 Jan 2023 - 31 Dec 2023")).toBeInTheDocument();

    // Check Coverage Plan
    expect(screen.getByText("Coverage Plan")).toBeInTheDocument();
    expect(screen.getByText("Short Plan Name")).toBeInTheDocument();

    // Check Policy Status
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("renders correctly for endorsement policy with motor product type", () => {
    render(
      <PolicyDetails
        languageData={mockLanguageData}
        policyNum="12345"
        policyData={mockPolicyData}
        planDetails={mockPlanDetails}
        policyPeriod="01 Jan 2023 - 31 Dec 2023"
        isEndosementPolicy={true}
        endorsementRedisData={mockEndorsementRedisData}
        imgSrc="test-image.jpg"
      />
    );

    // Check Vehicle Make and Model
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();

    // Check Sponsor Name
    // expect(screen.getByText("Policy Number")).toBeInTheDocument();
    // expect(screen.getByText("12345")).toBeInTheDocument();

  });

  it("renders plan name for non-motor endorsement policy", () => {
    render(
      <PolicyDetails
        languageData={mockLanguageData}
        policyNum="12345"
        policyData={mockPolicyData}
        planDetails={mockPlanDetails}
        policyPeriod="01 Jan 2023 - 31 Dec 2023"
        isEndosementPolicy={true}
        endorsementRedisData={{ productType: "NON_MOTOR", coverageName: "Full Plan Name" } as any} // Mocking for non-motor product type
      />
    );

    // Check Plan Name
    expect(screen.getByText("Full Plan Name")).toBeInTheDocument();
  });
});