import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CompareBenefitsAllCoverages from "./index";
import HomeBenefitModal from "Home/HomeBenefitModal";
import CompareBenefits from "Motor/QuoteAndBuy/CompareBenefits";

jest.mock("components/ThemeComponents/ThemeButton", () => ({
  __esModule: true,
  default: ({ onClickhandler, title }: any) => (
    <button onClick={onClickhandler}>{title}</button>
  ),
}));

jest.mock("Home/HomeBenefitModal", () => ({
  __esModule: true,
  default: ({ onClose }: any) => (
    <div data-testid="home-benefit-modal">
      <button onClick={onClose}>Close HomeBenefitModal</button>
    </div>
  ),
}));

jest.mock("Motor/QuoteAndBuy/CompareBenefits", () => ({
  __esModule: true,
  default: ({ onClose }: any) => (
    <div data-testid="compare-benefits">
      <button onClick={onClose}>Close CompareBenefits</button>
    </div>
  ),
}));

describe("CompareBenefitsAllCoverages", () => {
  const mockLanguageData = {
    compare_benefits: "Compare Benefits",
    compare_benefits_for_all: "Compare Benefits for All",
  };

  it("renders the component with the correct title", () => {
    render(
      <CompareBenefitsAllCoverages
        languageData={mockLanguageData}
        coveragePlanSelected="Plan A"
      />
    );

    expect(screen.getByText("Compare Benefits")).toBeInTheDocument();
  });

  it("opens HomeBenefitModal when ThemeButton is clicked and compare_benefits is defined", () => {
    render(
      <CompareBenefitsAllCoverages
        languageData={mockLanguageData}
        coveragePlanSelected="Plan A"
      />
    );

    fireEvent.click(screen.getByText("Compare Benefits"));

    expect(screen.getByTestId("home-benefit-modal")).toBeInTheDocument();
  });

  it("opens CompareBenefits when ThemeButton is clicked and compare_benefits is not defined", () => {
    const languageDataWithoutCompareBenefits = {
      compare_benefits_for_all: "Compare Benefits for All",
    };

    render(
      <CompareBenefitsAllCoverages
        languageData={languageDataWithoutCompareBenefits}
        coveragePlanSelected="Plan A"
      />
    );

    fireEvent.click(screen.getByText("Compare Benefits for All"));

    expect(screen.getByTestId("compare-benefits")).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    render(
      <CompareBenefitsAllCoverages
        languageData={mockLanguageData}
        coveragePlanSelected="Plan A"
      />
    );

    fireEvent.click(screen.getByText("Compare Benefits"));
    const closeButton = screen.getByText("Close HomeBenefitModal");
    fireEvent.click(closeButton);

    expect(screen.queryByTestId("home-benefit-modal")).not.toBeInTheDocument();
  });
});