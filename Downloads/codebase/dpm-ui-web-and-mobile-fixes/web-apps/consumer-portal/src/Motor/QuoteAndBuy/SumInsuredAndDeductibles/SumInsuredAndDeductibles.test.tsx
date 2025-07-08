import React from "react";
import { render, screen } from "@testing-library/react";
import SumInsuredAndDeductibles from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn((value) => `Icon ${value}`),
  getCurrencySymbol: jest.fn(() => '$'), 

}));

jest.mock("@corporate-portal/components/Loader", () => {
    return () => <div>Loader</div>;
  });

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  getAmountText: jest.fn(() => '100'),  
}));

jest.mock("utils/quoteAndBuy", () => ({
  deepCopy: jest.fn((obj) => ({ ...obj })),
  updateSliderChangeCalculatePremiumPayload: jest.fn(),
}));

describe("SumInsuredAndDeductibles Component", () => {
  const mockLanguageData = {
    sum_insured_and_deductible: "Sum Insured And Deductibles",
    what_should_be_your_motor: "What should be your motor’s Sum Insured and Deductibles",
    sum_insured: "Sum Insured",
    deductibles: "Deductibles",
    max_sum_insured_is: "Max Sum Insured is",
    lesser_the_deductible_bett: "Lesser the deductible, better the coverage",
    sar: "SAR",
    your_motor_current_market: "Your motor’s current market value is <<vehicleMinValue>> to <<vehicleMaxValue>>",
  };

  const mockContextValues = {
    setStepValue: jest.fn(),
    setSliderValueDeductibles: jest.fn(),
    setSliderValueSumInsured: jest.fn(),
    setWorkShopInitialPrice: jest.fn(),
    setAgencyInitialPrice: jest.fn(),
    setMathInitialPrice: jest.fn(),
    setComprehensiveCardPrice: jest.fn(),
    setWsPremiumBreakdown: jest.fn(),
    setMathPremiumBreakdown: jest.fn(),
    setAgencyPremiumBreakdown: jest.fn(),
    vehicleDetailsResponseData: {
      vehicleMinValue: 10000,
      vehicleMaxValue: 50000,
      vehicleValue: 30000,
    },
    minDeductibleAmount: 500,
    maxDeductibleAmount: 5000,
    deductibleAmounts: [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000],
    sliderValueDeductibles: 1000,
    sliderValueSumInsured: 30000,
    availableRepairTypes: ["workShop", "math", "agency"],
  };

  const mockApiCall = {
    makeApiCall: jest.fn(),
    data: null,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useQuoteAndBuyContext.mockReturnValue(mockContextValues);
    useApiCall.mockReturnValue(mockApiCall);
  });

  test("renders correctly with required props", () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);

    expect(screen.getByText(mockLanguageData.sum_insured_and_deductible)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.what_should_be_your_motor)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.sum_insured)).toBeInTheDocument();
    expect(screen.getByText(mockLanguageData.deductibles)).toBeInTheDocument();
  });

  test("handles Sum Insured slider change", () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);

    expect(mockContextValues.setSliderValueSumInsured).toHaveBeenCalledWith(30000);
  });

  test("handles Deductibles slider change", () => {
    render(<SumInsuredAndDeductibles languageData={mockLanguageData} />);

    expect(mockContextValues.setSliderValueDeductibles).toHaveBeenCalledWith(500);
  });

});