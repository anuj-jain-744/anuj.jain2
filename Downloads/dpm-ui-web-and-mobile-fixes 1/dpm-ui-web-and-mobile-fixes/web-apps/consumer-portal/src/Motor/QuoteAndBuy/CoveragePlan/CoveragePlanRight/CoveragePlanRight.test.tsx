import React from "react";
import { render, screen } from "@testing-library/react";
import CoveragePlanRight from "./index";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";

// Mock the useQuoteAndBuyContext hook
jest.mock("components/hooks/useQuoteAndBuyContext");

const mockLanguageData: LanguageData = {
  national_address: "National Address",
  existing_premium_breakup: "Existing Premium Breakup",
  third_party: "Third Party",
  premium_breakup: "Premium Breakup",
  comprehensive: "Comprehensive",
};

describe("CoveragePlanRight Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders PolicyStartDate component", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: false,
      coverageType: null,
      homePremiumResponse: null,
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("National Address")).toBeInTheDocument();
  });

  test("renders NationalAddress component when languageData has national_address", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: false,
      coverageType: null,
      homePremiumResponse: null,
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("National Address")).toBeInTheDocument();
  });

  test("renders VehicleInformation component when not home", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: false,
      coverageType: null,
      homePremiumResponse: null,
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("Vehicle Information")).toBeInTheDocument();
  });

  test("renders SumInsuredDeductibleCard component when repairTypeSelected and coverageType are true", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: true,
      homePremiumResponse: null,
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("Sum Insured Deductible Card")).toBeInTheDocument();
  });

  test("renders HomeCoverageDeductibleCard component when isHome, repairTypeSelected and coverageType are true", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: true,
      homePremiumResponse: { someKey: "someValue" },
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("Home Coverage Deductible Card")).toBeInTheDocument();
  });

  test("renders ExistingPremiumBreakUp component when repairTypeSelected and coverageType are true", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: true,
      homePremiumResponse: null,
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("Existing Premium Breakup")).toBeInTheDocument();
  });

  test("renders PremiumBreakUp component when repairTypeSelected and coverageType are true", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: true,
      homePremiumResponse: null,
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("Premium Breakup")).toBeInTheDocument();
  });

  test("renders DidYouKnowPlain component", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: false,
      coverageType: null,
      homePremiumResponse: null,
    });

    render(<CoveragePlanRight languageData={mockLanguageData} />);

    expect(screen.getByText("Did You Know Plain")).toBeInTheDocument();
  });
});