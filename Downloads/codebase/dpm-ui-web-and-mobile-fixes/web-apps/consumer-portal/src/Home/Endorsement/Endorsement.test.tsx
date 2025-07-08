import React from "react";
import { render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { useApiCall } from "@dpm/shared-module";
import Endorsement from "./index";
import PolicyContainer from "./PolicyContainer";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
}));

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

jest.mock("./PolicyContainer", () => jest.fn(() => <div data-testid="policy-container-mock">PolicyContainer Component</div>));

describe("Endorsement Component", () => {
  const mockNavigateTo = jest.fn();
  const mockPolicyData = { policyId: "12345" };
  const mockMakeApiCall = jest.fn();
  const mockData = {
    config: {
      policy_holder: "Policy Holder",
      start_date: "Start Date",
      expiry_date: "Expiry Date",
    },
  };

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({
      state: { data: mockPolicyData },
    });

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockData,
    });
  });

  it("renders PolicyContainer component", () => {
    render(<Endorsement navigateTo={mockNavigateTo} />);

    // Check if PolicyContainer is rendered
    expect(screen.getByTestId("policy-container-mock")).toBeInTheDocument();
  });

  it("calls makeApiCall on mount", () => {
    render(<Endorsement navigateTo={mockNavigateTo} />);

    // Check if makeApiCall is called
    expect(mockMakeApiCall).toHaveBeenCalled();
  });

  it("passes policyData and languageData to PolicyContainer", () => {
    render(<Endorsement navigateTo={mockNavigateTo} />);

    // Check if PolicyContainer is called with correct props
    expect(PolicyContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        policyData: mockPolicyData,
        languageData: mockData.config,
        navigateTo: mockNavigateTo,
      }),
      {}
    );
  });

  it("handles empty location state gracefully", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: null,
    });

    render(<Endorsement navigateTo={mockNavigateTo} />);

    // Check if PolicyContainer is rendered with empty policyData
    expect(PolicyContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        policyData: {},
      }),
      {}
    );
  });
});