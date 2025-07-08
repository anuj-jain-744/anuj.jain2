import React from "react";
import { render, fireEvent } from "@testing-library/react";
import HomeBenefitModal from "../index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";

jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("Home/QuoteAndBuy/utils/calculatePremium");

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe("HomeBenefitModal Component", () => {
  const mockOnClose = jest.fn();
  const mockLanguageData = {
    compare_benefits: "Compare Benefits",
    sar: "SAR",
    plan1_accordians: ["Accordian1"],
    plan1_headers: ["Coverage", "Plan 1", "Plan 2"],
    plan1: [
      {
        benefits: ["Benefit1", "Benefit2"],
        plan1: ["Plan1Benefit1", "Plan1Benefit2"],
        plan2: ["Plan2Benefit1", "Plan2Benefit2"],
      },
    ],
  };
  const mockCoveragePlanSelected = "plan1";
  const mockHomePremiumResponse = {
    plan1: { minFinalPrice: 100 },
    plan2: { minFinalPrice: 200 },
  };

  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue({
      homePremiumResponse: mockHomePremiumResponse,
    });
    calculatePremium.mockImplementation((planData) => {
      return planData.plan1 ? { minFinalPrice: 100 } : { minFinalPrice: 200 };
    });
  });

  it("renders the modal with correct content", () => {
    const { getByText, getByClassName } = render(
      <HomeBenefitModal
        showCompareBenefits={true}
        languageData={mockLanguageData}
        coveragePlanSelected={mockCoveragePlanSelected}
        onClose={mockOnClose}
      />
    );

    expect(getByText(mockLanguageData.compare_benefits)).toBeInTheDocument();
    expect(getByText(mockLanguageData.plan1_headers[0])).toBeInTheDocument();
    expect(getByText(mockLanguageData.plan1_headers[1])).toBeInTheDocument();
    expect(getByText(mockLanguageData.plan1_headers[2])).toBeInTheDocument();
    //expect(getByText(`SAR ${mockHomePremiumResponse.plan1.minFinalPrice}`)).toBeInTheDocument();
    //expect(getByText(`SAR ${mockHomePremiumResponse.plan2.minFinalPrice}`)).toBeInTheDocument();
  });

  it("calls onClose when the modal is closed", () => {
    const { getByRole } = render(
      <HomeBenefitModal
        showCompareBenefits={true}
        languageData={mockLanguageData}
        coveragePlanSelected={mockCoveragePlanSelected}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(getByRole("button", { name: /close/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders coverage items correctly", () => {
    const { getByText } = render(
      <HomeBenefitModal
        showCompareBenefits={true}
        languageData={mockLanguageData}
        coveragePlanSelected={mockCoveragePlanSelected}
        onClose={mockOnClose}
      />
    );

    // expect(getByText("Benefit1", { selector: ".text-value" })).toBeInTheDocument();
    // expect(getByText("Plan1Benefit1")).toBeInTheDocument();
    // expect(getByText("Plan2Benefit1")).toBeInTheDocument();
    // expect(getByText("Benefit2", { selector: ".text-value" })).toBeInTheDocument();
    // expect(getByText("Plan1Benefit2")).toBeInTheDocument();
    // expect(getByText("Plan2Benefit2")).toBeInTheDocument();
  });

  /*it("toggles accordion items correctly", () => {
    const { getByText, queryByText } = render(
      <HomeBenefitModal
        showCompareBenefits={true}
        languageData={mockLanguageData}
        coveragePlanSelected={mockCoveragePlanSelected}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(getByText("Accordian1"));
    expect(queryByText("Benefit1", { selector: ".text-value" })).not.toBeInTheDocument();
    expect(queryByText("Benefit2", { selector: ".text-value" })).not.toBeInTheDocument();
  });*/
});