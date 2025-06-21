import React from "react";
import { render, screen } from "@testing-library/react";
import CoveragePlanFooter from "./CoveragePlanFooter";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { getAmountWithIcon } from "@app-shell/utils/common";
import { compensationTypeCardFinalVAT } from "../../CommonFunction/CommonFunction";

// Mock dependencies
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("Home/QuoteAndBuy/utils/calculatePremium", () => ({
  calculatePremium: jest.fn(),
}));

jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn(),
}));

jest.mock("../../CommonFunction/CommonFunction", () => ({
  compensationTypeCardFinalVAT: jest.fn(),
}));

describe("CoveragePlanFooter", () => {
  const mockLanguageData = {
    starting_from: "Starting from",
    vat: "VAT",
    test_label_headers: ["Coverage Type 1", "Coverage Type 2"],
  };

  const mockHomePremiumResponse = {
    coveragetype1: { price: 100 },
    coveragetype2: { price: 200 },
  };

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      homePremiumResponse: mockHomePremiumResponse,
    });

    (calculatePremium as jest.Mock).mockReturnValue({
      minFinalPrice: 100,
      vatPrice: 15,
    });

    (getAmountWithIcon as jest.Mock).mockReturnValue("SAR 100");
    (compensationTypeCardFinalVAT as jest.Mock).mockReturnValue(15);
  });

   it("calls calculatePremium with the correct data", () => {
    render(<CoveragePlanFooter languageData={mockLanguageData} label="test_label" />);

    expect(calculatePremium).toHaveBeenCalledWith({
      coveragetype1: { price: 100 },
      coveragetype2: { price: 200 },
    });
  });

  it("formats the card price and VAT correctly", () => {
    render(<CoveragePlanFooter languageData={mockLanguageData} label="test_label" />);

    expect(getAmountWithIcon).toHaveBeenCalledWith(100);
    expect(compensationTypeCardFinalVAT).toHaveBeenCalledWith(15);
  });
});