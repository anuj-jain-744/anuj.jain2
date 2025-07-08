import React from "react";
import { render, screen } from "@testing-library/react";
import SelectCoveragePlanType from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import RadioCard from "Motor/QuoteAndBuy/CoveragePlan/Components/RadioCard";

jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("Motor/QuoteAndBuy/CoveragePlan/Components/RadioCard", () =>
  jest.fn(() => <div>Mocked RadioCard</div>)
);
jest.mock("./CoverageDowngradeAlert", () =>
  jest.fn(() => <div>Mocked CoverageDowngradeAlert</div>)
);

describe("SelectCoveragePlanType Component", () => {
  const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

  const mockLanguageData = {
    select_coverage_plan: "Select Coverage Plan",
  };

  const mockCoveragePlanData = [
    { key: "thirdparty", title: "Third Party", details: ["Detail 1"], image: "image1.png" },
    { key: "comprehensive", title: "Comprehensive", details: ["Detail 2"], image: "image2.png" },
  ];

  const mockOnChange = jest.fn();
  const mockClickHandlerRenewDowngrade = jest.fn();

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      availableRepairTypes: ["repairType1"],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component with valid data", () => {
    render(
      <SelectCoveragePlanType
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="thirdparty"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.getAllByText("Mocked RadioCard")).toHaveLength(2);
  });

  it("should disable RadioCard for thirdparty if isThirdParty is false", () => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      availableRepairTypes: [],
    });

    render(
      <SelectCoveragePlanType
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="thirdparty"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(RadioCard).toHaveBeenCalledWith(
      expect.objectContaining({
        radiokey: "thirdparty",
        disabled: true,
      }),
      {}
    );
  });

  it("should disable RadioCard for comprehensive if isComprehensive is false", () => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      availableRepairTypes: ["repairTypeThird"],
    });

    render(
      <SelectCoveragePlanType
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="comprehensive"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(RadioCard).toHaveBeenCalledWith(
      expect.objectContaining({
        radiokey: "comprehensive",
        disabled: true,
      }),
      {}
    );
  });

  it("should render CoverageDowngradeAlert when isCoverageTypeDowngrading is true", () => {
    render(
      <SelectCoveragePlanType
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="thirdparty"
        isCoverageTypeDowngrading={true}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.getByText("Mocked CoverageDowngradeAlert")).toBeInTheDocument();
  });

  it("should handle null languageData gracefully", () => {
    render(
      <SelectCoveragePlanType
        languageData={null}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="thirdparty"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.getAllByText("Mocked RadioCard")).toHaveLength(2);
  });

  it("should render RadioCard with correct props", () => {
    render(
      <SelectCoveragePlanType
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="thirdparty"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(RadioCard).toHaveBeenCalledWith(
      expect.objectContaining({
        radiokey: "thirdparty",
        label: "Third Party",
        cardlistitems: ["Detail 1"],
        checked: true,
        imageLink: "image1.png",
      }),
      {}
    );
  });
});