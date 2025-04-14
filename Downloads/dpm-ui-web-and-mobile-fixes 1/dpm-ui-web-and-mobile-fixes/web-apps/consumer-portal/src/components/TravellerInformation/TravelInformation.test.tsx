import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TravelInformation from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";

// Mock the useQuoteAndBuyContext hook
jest.mock("components/hooks/useQuoteAndBuyContext");

const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

describe("TravelInformation Component", () => {
  const mockLanguageData: LanguageData = {
    travel_type: "Travel Type",
    travel_start_date: "Start Date",
    travel_end_date: "End Date",
    travel_period: "Period",
  };

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      travellerType: "business",
      travelStartDate: "2025-01-14",
      selectedPeriod: "10 days",
    });
  });

  it("renders correctly with provided data", () => {
    render(<TravelInformation languageData={mockLanguageData} />);

    expect(screen.getByText("Travel Type")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("2025-01-14")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("14/03/2025")).toBeInTheDocument();
    expect(screen.getByText("Period")).toBeInTheDocument();
    expect(screen.getByText("10 days")).toBeInTheDocument();
  });

  it("handles accordion open/close functionality", () => {
    render(<TravelInformation languageData={mockLanguageData} />);

    const accordionHeader = screen.getByText("Travel Type").closest(".accordion-header");
    expect(accordionHeader).toBeInTheDocument();

    // Initially open
    expect(screen.getByText("Start Date")).toBeVisible();

    // Close accordion
    fireEvent.click(accordionHeader!);
    expect(screen.queryByText("Start Date")).not.toBeVisible();

    // Open accordion
    fireEvent.click(accordionHeader!);
    expect(screen.getByText("Start Date")).toBeVisible();
  });

  it("calculates the correct travel end date", () => {
    render(<TravelInformation languageData={mockLanguageData} />);

    expect(screen.getByText("14/03/2025")).toBeInTheDocument();
  });
});