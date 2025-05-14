import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExistingPremiumBreakUp from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";

// Mock the hooks
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  getAmountText: jest.fn((amount) => amount.toFixed(2)),
}));

describe("ExistingPremiumBreakUp Component", () => {
  let mockUseQuoteAndBuyContext: jest.Mock;
  let mockUseApiCall: jest.Mock;

  beforeEach(() => {
    mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;
    mockUseApiCall = useApiCall as jest.Mock;

    // Mock the context values
    mockUseQuoteAndBuyContext.mockReturnValue({
      selectedBenefits: [],
      repairTypeSelected: "Agency",
      workShopInitialPrice: 100,
      agencyInitialPrice: 200,
      mathInitialPrice: 300,
      premium: 500,
      setPremium: jest.fn(),
      driverDetails: [{ id: 1 }, { id: 2 }],
      viewPolicyData: {
        policyBasic: {
          premiumInfo: {
            finalPremium: 1000,
            premiumBreakdowns: [
              { type: 1, amount: 500, description: "Benefit 1", sign: 1 },
              { type: 2, amount: 300, description: "Benefit 2", sign: -1 },
            ],
          },
        },
      },
    });

    // Mock the API call
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      data: {
        config: {
          premium_breakdown: [
            { code: 1, description: "Benefit 1 Description" },
            { code: 2, description: "Benefit 2 Description" },
          ],
        },
      },
    });
  });

  it("should render the component with correct title and subtitle", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={{
          sar: "SAR",
          additional_driver_premium: "Additional Driver Premium",
          subtotal: "Subtotal",
          vat_amount: "VAT Amount",
          net_premium: "Net Premium",
        }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
      />
    );

    // Check if the title is rendered
    expect(screen.getByText("Premium Breakdown")).toBeInTheDocument();

    // Check if the subtitle is rendered in the accordion body
    fireEvent.click(screen.getByText("Premium Breakdown"));
    expect(screen.getByText("Breakdown Details")).toBeInTheDocument();
  });

  it("should calculate and display the subtotal, VAT, and net premium", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={{
          sar: "SAR",
          additional_driver_premium: "Additional Driver Premium",
          subtotal: "Subtotal",
          vat_amount: "VAT Amount",
          net_premium: "Net Premium",
        }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
      />
    );

    // Check subtotal
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("SAR 1500.00")).toBeInTheDocument(); // 1000 (finalPremium) + 500 (benefits)

    // Check VAT
    expect(screen.getByText("VAT Amount (15%)")).toBeInTheDocument();
    expect(screen.getByText("SAR 225.00")).toBeInTheDocument(); // 1500 * 0.15

    // Check net premium
    expect(screen.getByText("Net Premium")).toBeInTheDocument();
    expect(screen.getByText("SAR 1725.00")).toBeInTheDocument(); // 1500 + 225
  });

  it("should display additional driver premium when driver details are present", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={{
          sar: "SAR",
          additional_driver_premium: "Additional Driver Premium",
          subtotal: "Subtotal",
          vat_amount: "VAT Amount",
          net_premium: "Net Premium",
        }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
      />
    );

    // Check additional driver premium
    expect(screen.getByText("Additional Driver Premium x 2")).toBeInTheDocument();
    expect(screen.getByText("SAR 100.00")).toBeInTheDocument(); // 50 * 2
  });

  it("should handle API call on mount", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={{
          sar: "SAR",
          additional_driver_premium: "Additional Driver Premium",
          subtotal: "Subtotal",
          vat_amount: "VAT Amount",
          net_premium: "Net Premium",
        }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
      />
    );

    // Ensure API call is made
    expect(mockUseApiCall().makeApiCall).toHaveBeenCalled();
  });

  it("should handle accordion open and close", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={{
          sar: "SAR",
          additional_driver_premium: "Additional Driver Premium",
          subtotal: "Subtotal",
          vat_amount: "VAT Amount",
          net_premium: "Net Premium",
        }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
      />
    );

    // Accordion should be closed initially
    const accordion = screen.getByText("Premium Breakdown").closest(".accor-close");
    expect(accordion).toBeInTheDocument();

    // Open the accordion
    fireEvent.click(screen.getByText("Premium Breakdown"));
    const openAccordion = screen.getByText("Premium Breakdown").closest(".accor-open");
    expect(openAccordion).toBeInTheDocument();
  });
});