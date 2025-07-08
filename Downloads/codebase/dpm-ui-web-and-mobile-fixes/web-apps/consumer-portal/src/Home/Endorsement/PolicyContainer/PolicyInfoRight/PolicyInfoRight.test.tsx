import React from "react";
import { render, screen } from "@testing-library/react";
import PolicyInfoRight from "./index";
import PolicyInfo from "Home/Components/PolicyInfo";

jest.mock("Home/Components/PolicyInfo", () => jest.fn(() => <div>PolicyInfo Component</div>));
jest.mock("./OrderSummary", () => jest.fn(() => <div>OrderSummary Component</div>));

describe("PolicyInfoRight Component", () => {
  const mockLanguageData = {
    someKey: "someValue",
  };

  const mockPolicyDetails = {
    viewPolicy: true,
    benefitsClaimed: [],
    orderSummary: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <PolicyInfoRight
        languageData={mockLanguageData}
        policyDetails={mockPolicyDetails}
      />
    );

    expect(screen.getByText("PolicyInfo Component")).toBeInTheDocument();
  });

  it("does not render OrderSummary when benefitsClaimed is empty or orderSummary is null", () => {
    render(
      <PolicyInfoRight
        languageData={mockLanguageData}
        policyDetails={mockPolicyDetails}
      />
    );

    expect(screen.queryByText("OrderSummary Component")).not.toBeInTheDocument();
  });

  it("renders OrderSummary when benefitsClaimed has items and orderSummary is provided", () => {
    const updatedPolicyDetails = {
      ...mockPolicyDetails,
      benefitsClaimed: ["Benefit 1"],
      orderSummary: { summaryKey: "summaryValue" },
    };

    render(
      <PolicyInfoRight
        languageData={mockLanguageData}
        policyDetails={updatedPolicyDetails}
      />
    );

    expect(screen.getByText("OrderSummary Component")).toBeInTheDocument();
  });

  it("renders PolicyInfo with correct props", () => {
    render(
      <PolicyInfoRight
        languageData={mockLanguageData}
        policyDetails={mockPolicyDetails}
      />
    );

    expect(PolicyInfo).toHaveBeenCalledWith(
      {
        languageData: mockLanguageData,
        viewPolicy: mockPolicyDetails.viewPolicy,
      },
      {}
    );
  });
});