import React from "react";
import { render, screen } from "@testing-library/react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { getAmountWithIcon } from "@app-shell/utils/common";
import SumInsuredDeductibleCard from "./index";

// Mock dependencies
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn(),
}));
jest.mock("components/ThemeAlert", () => jest.fn(() => <div>Mocked ThemeAlert</div>));

describe("SumInsuredDeductibleCard Component", () => {
  const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      sliderValueDeductibles: 500,
      sliderValueSumInsured: 10000,
      viewPolicyData: {
        policyBasic: {
          expiryDate: "2023-12-31T00:00:00",
          policyNumber: "POL12345",
        },
      },
      isRenewpolicy: true,
    });
    (getAmountWithIcon as jest.Mock).mockImplementation((value) => `$${value}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not render renewal details when isRenewpolicy is false", () => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      sliderValueDeductibles: 500,
      sliderValueSumInsured: 10000,
      viewPolicyData: null,
      isRenewpolicy: false,
    });

    render(
      <SumInsuredDeductibleCard
        languageData={{
          existing_policy_no: "Existing Policy No",
          policy_expiring_on: "Policy Expiring On",
        }}
      />
    );

    expect(screen.queryByText("Existing Policy No")).not.toBeInTheDocument();
    expect(screen.queryByText("Policy Expiring On")).not.toBeInTheDocument();
  });

  it("should handle null or undefined languageData gracefully", () => {
    render(<SumInsuredDeductibleCard languageData={null} />);

    expect(screen.queryByText("Existing Policy No")).not.toBeInTheDocument();
    expect(screen.queryByText("Policy Expiring On")).not.toBeInTheDocument();
  });

  it("should render sum insured and deductible values correctly", () => {
    render(
      <SumInsuredDeductibleCard
        languageData={{
          existing_policy_no: "Existing Policy No",
          policy_expiring_on: "Policy Expiring On",
        }}
      />
    );

    expect(screen.getByText("$10000")).toBeInTheDocument();
    expect(screen.getByText("$500")).toBeInTheDocument();
    expect(getAmountWithIcon).toHaveBeenCalledWith(10000);
    expect(getAmountWithIcon).toHaveBeenCalledWith(500);
  });
});