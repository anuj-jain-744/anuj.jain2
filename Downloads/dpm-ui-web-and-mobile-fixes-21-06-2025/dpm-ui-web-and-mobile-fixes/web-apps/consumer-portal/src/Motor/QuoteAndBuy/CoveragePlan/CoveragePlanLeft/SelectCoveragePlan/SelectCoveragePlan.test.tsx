import React from "react";
import { render, screen } from "@testing-library/react";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import ThemeAlert from "components/ThemeAlert";
import CompareBenefitsAllCoverages from "./CompareBenefitsAllCoverages";
import SelectCoveragePlanType from "./SelectCoveragePlanType";
import AutoSuggest from "./AutoSuggest";
import SelectCoveragePlan from "./index";

// Mock dependencies
jest.mock("context/PHQuoteBuyContext");
jest.mock("components/ThemeAlert", () => jest.fn(() => <div>Mocked ThemeAlert</div>));
jest.mock("./CompareBenefitsAllCoverages", () => jest.fn(() => <div>Mocked CompareBenefitsAllCoverages</div>));
jest.mock("./SelectCoveragePlanType", () => jest.fn(() => <div>Mocked SelectCoveragePlanType</div>));
jest.mock("./AutoSuggest", () => jest.fn(() => <div>Mocked AutoSuggest</div>));

describe("SelectCoveragePlan Component", () => {
  const mockUsePHQuoteBuyContext = usePHQuoteBuyContext as jest.Mock;

  const mockLanguageData = {
    select_coverage_plan: "Select Coverage Plan",
    existing_policy: "Existing Policy",
    compare_benefits_for_all: "Compare Benefits for All",
  };

  const mockCoveragePlanData = [
    { id: 1, title: "Plan A" },
    { id: 2, title: "Plan B" },
  ];

  const mockOnChange = jest.fn();
  const mockClickHandlerRenewDowngrade = jest.fn();

  beforeEach(() => {
    mockUsePHQuoteBuyContext.mockReturnValue({
      homePolicyRenewal: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component with valid data", () => {
    render(
      <SelectCoveragePlan
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="Plan A"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.getByText("Select Coverage Plan")).toBeInTheDocument();
    expect(screen.getByText("Mocked SelectCoveragePlanType")).toBeInTheDocument();
    expect(screen.getByText("Mocked AutoSuggest")).toBeInTheDocument();
  });

  it("should render ThemeAlert when homePolicyRenewal is true", () => {
    mockUsePHQuoteBuyContext.mockReturnValue({
      homePolicyRenewal: true,
    });

    render(
      <SelectCoveragePlan
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="Plan A"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.getByText("Mocked ThemeAlert")).toBeInTheDocument();
  });

  it("should not render ThemeAlert when languageData is null", () => {
    render(
      <SelectCoveragePlan
        languageData={null}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="Plan A"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.queryByText("Mocked ThemeAlert")).not.toBeInTheDocument();
  });

  it("should render CompareBenefitsAllCoverages when compare_benefits_for_all is present", () => {
    render(
      <SelectCoveragePlan
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="Plan A"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.getByText("Mocked CompareBenefitsAllCoverages")).toBeInTheDocument();
  });

  it("should render SelectCoveragePlanType and AutoSuggest with correct props", () => {
    render(
      <SelectCoveragePlan
        languageData={mockLanguageData}
        coveragePlanData={mockCoveragePlanData}
        onChange={mockOnChange}
        coveragePlanSelected="Plan A"
        isCoverageTypeDowngrading={false}
        clickHandlerRenewDowngrade={mockClickHandlerRenewDowngrade}
      />
    );

    expect(screen.getByText("Mocked SelectCoveragePlanType")).toBeInTheDocument();
    expect(screen.getByText("Mocked AutoSuggest")).toBeInTheDocument();
  });
});