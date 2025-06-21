import React from "react";
import { render, screen } from "@testing-library/react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import RadioCardFooter from "./RadioCardFooter";
import { IComprehensive, IThirdParty } from "../../ConstantValue/ConstantValue";
import CoveragePlanFooter from "./CoveragePlanFooter";
import ThirdpartyFooter from "./ThirdpartyFooter";

// Mock dependencies
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("./CoveragePlanFooter", () => jest.fn(() => <div>CoveragePlanFooter</div>));
jest.mock("./ThirdpartyFooter", () => jest.fn(() => <div>ThirdpartyFooter</div>));
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe("RadioCardFooter Component", () => {
  const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      compWorkShop: { pricingOptions: [{ deductibleReferenceNo: 1 }, { deductibleReferenceNo: 2 }] },
      compAgency: {},
      compMath: {},
      comprehensiveCardPrice: null,
      sliderValueDeductibles: null,
      setSliderValueDeductibles: jest.fn(),
      setComprehensiveCardPrice: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render ComprehensiveFooter when label is IComprehensive", () => {
    render(
      <RadioCardFooter
        label={IComprehensive}
        languageData={{ starting_from: "Starting from", vat: "VAT" }}
      />
    );

    expect(screen.getByText("Starting from")).toBeInTheDocument();
    //expect(screen.getByText("+ 5% VAT")).toBeInTheDocument(); // Assuming `third_party_vat` is 5
  });

  it("should render ThirdpartyFooter when label is IThirdParty", () => {
    render(
      <RadioCardFooter
        label={IThirdParty}
        languageData={{ starting_from: "Starting from", vat: "VAT" }}
      />
    );

    expect(screen.getByText("ThirdpartyFooter")).toBeInTheDocument();
  });

  it("should render CoveragePlanFooter for other labels", () => {
    render(
      <RadioCardFooter
        label="OtherLabel"
        languageData={{ starting_from: "Starting from", vat: "VAT" }}
      />
    );

    expect(screen.getByText("CoveragePlanFooter")).toBeInTheDocument();
  });

  it("should not render anything if languageData is null", () => {
    render(<RadioCardFooter label={IComprehensive} languageData={null} />);

    expect(screen.queryByText("Starting from")).not.toBeInTheDocument();
    expect(screen.queryByText("ThirdpartyFooter")).not.toBeInTheDocument();
    expect(screen.queryByText("CoveragePlanFooter")).not.toBeInTheDocument();
  });

  it("should call setSliderValueDeductibles and setComprehensiveCardPrice in useEffect", () => {
    const setSliderValueDeductiblesMock = jest.fn();
    const setComprehensiveCardPriceMock = jest.fn();

    mockUseQuoteAndBuyContext.mockReturnValue({
      compWorkShop: { pricingOptions: [{ deductibleReferenceNo: 1 }, { deductibleReferenceNo: 2 }] },
      compAgency: {},
      compMath: {},
      comprehensiveCardPrice: null,
      sliderValueDeductibles: null,
      setSliderValueDeductibles: setSliderValueDeductiblesMock,
      setComprehensiveCardPrice: setComprehensiveCardPriceMock,
    });

    render(
      <RadioCardFooter
        label={IComprehensive}
        languageData={{ starting_from: "Starting from", vat: "VAT" }}
      />
    );

    expect(setSliderValueDeductiblesMock).toHaveBeenCalledWith("500");
    expect(setComprehensiveCardPriceMock).toHaveBeenCalled();
  });
});