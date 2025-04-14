import React from "react";
import { render } from "@testing-library/react";
import TravelCoveragePlanRight from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";

// Mock the useQuoteAndBuyContext hook
jest.mock("components/hooks/useQuoteAndBuyContext");

describe("TravelCoveragePlanRight", () => {
  const mockLanguageData: LanguageData = {
    premium_breakup: "Premium Breakup",
  };

  it("renders correctly with languageData and context values", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelcoverageType: "someType",
      travelcoveragePlan: "somePlan",
    });

    const { getByText } = render(<TravelCoveragePlanRight languageData={mockLanguageData} />);
    expect(getByText("Premium Breakup")).toBeInTheDocument();
  });

  it("renders correctly without travelcoverageType and travelcoveragePlan", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelcoverageType: null,
      travelcoveragePlan: null,
    });

    const { queryByText } = render(<TravelCoveragePlanRight languageData={mockLanguageData} />);
    expect(queryByText("Premium Breakup")).not.toBeInTheDocument();
  });

  it("renders correctly with null languageData", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelcoverageType: "someType",
      travelcoveragePlan: "somePlan",
    });

    const { queryByText } = render(<TravelCoveragePlanRight languageData={null} />);
    expect(queryByText("Premium Breakup")).not.toBeInTheDocument();
  });
});