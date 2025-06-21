import React from "react";
import { render, screen } from "@testing-library/react";
import RadioCardFooter from "./RadioCardFooter";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { IWorldwide, IworldwideExcept } from "../../types/coverageplan";
import { TravelData } from "types/languageData";

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

// Mock dependencies
jest.mock("components/hooks/useQuoteAndBuyContext");

const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe("RadioCardFooter", () => {
  const mockTravelData: TravelData = {
    starting_from: "Starting from",
    sar: "SAR",
    vat: "VAT",
  };

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      dataCoverageplanselfworldwideusa: { data: { coverageTypes: [{ pricingOptions: [{ taxFeeBreakdowns: [{ percentage: 5 }] }] }] } },
      dataCoverageplanselfworldwide: { data: { coverageTypes: [{ pricingOptions: [{ taxFeeBreakdowns: [{ percentage: 5 }] }] }] } },
      dataCoverageplanfamilyworldwide: { data: { coverageTypes: [{ pricingOptions: [{ taxFeeBreakdowns: [{ percentage: 5 }] }] }] } },
      dataCoverageplanselfeurope: { data: { coverageTypes: [{ pricingOptions: [{ taxFeeBreakdowns: [{ percentage: 5 }] }] }] } },
      worldwideexceptCardPrice: 100,
      worldwideCardPrice: 200,
      EuropeCardPrice: 300,
      travellerType: "1",
      setworldwideexceptCardPrice: jest.fn(),
      setworldwideexceptCoveragePrice: jest.fn(),
      setworldwideCardPrice: jest.fn(),
      setworldwideCoveragePrice: jest.fn(),
      setworldwideFamilyCoveragePrice: jest.fn(),
      setEuropeCardPrice: jest.fn(),
      seteuropeCoveragePrice: jest.fn(),
    });
  });

  it("renders WorldwideFooter when label is IWorldwide", () => {
    render(<RadioCardFooter label={IWorldwide} TravelData={mockTravelData} />);
    expect(screen.getByText("Starting from")).toBeInTheDocument();
    /*expect(screen.getByText("SAR")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("+ 5% VAT")).toBeInTheDocument();*/
  });

  it("renders WorldwideexceptFooter when label is IworldwideExcept", () => {
    render(<RadioCardFooter label={IworldwideExcept} TravelData={mockTravelData} />);
    expect(screen.getByText("Starting from")).toBeInTheDocument();
    /*expect(screen.getByText("SAR")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("+ 5% VAT")).toBeInTheDocument();*/
  });

  it("renders EuropeFooter when label is neither IWorldwide nor IworldwideExcept", () => {
    render(<RadioCardFooter label="Europe" TravelData={mockTravelData} />);
    expect(screen.getByText("Starting from")).toBeInTheDocument();
    /*expect(screen.getByText("SAR")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
    expect(screen.getByText("+ 5% VAT")).toBeInTheDocument();*/
  });
});