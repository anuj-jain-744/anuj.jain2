import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RequestTabs from "./RequestTabs";
import { REQUEST_TYPES } from "constant";

describe("RequestTabs Component", () => {
  const mockHandleTabClick = jest.fn();
  const mockIsTabDisabled = jest.fn();
  const mockLanguageData = {
    all: "All",
    claim: "Claim",
    enquiry: "Enquiry",
    approval: "Approval",
    cancellation: "Cancellation",
    quotation: "Quotation",
    endorsement: "Endorsement",
  };

  const renderComponent = (activeTab: string) => {
    render(
      <RequestTabs
        activeTab={activeTab}
        handleTabClick={mockHandleTabClick}
        isTabDisabled={mockIsTabDisabled}
        languageData={mockLanguageData}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tabs with correct titles", () => {
    renderComponent(REQUEST_TYPES.ALL);

    // Check if all tabs are rendered with correct titles
    Object.values(mockLanguageData).forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("applies the active class to the active tab", () => {
    renderComponent(REQUEST_TYPES.CLAIM);

    const activeTab = screen.getByText(mockLanguageData.claim);
    expect(activeTab).toHaveClass("filterBtnsActive");
  });

  it("disables tabs based on isTabDisabled function", () => {
    mockIsTabDisabled.mockImplementation((tabType) => tabType === REQUEST_TYPES.CANCELLATION);

    renderComponent(REQUEST_TYPES.ALL);

    const disabledTab = screen.getByText(mockLanguageData.cancellation);
    expect(disabledTab).toHaveClass("filterBtnsDisabled");
    expect(disabledTab).toBeDisabled();
  });

  it("calls handleTabClick when a tab is clicked", () => {
    renderComponent(REQUEST_TYPES.ALL);

    const claimTab = screen.getByText(mockLanguageData.claim);
    fireEvent.click(claimTab);

    expect(mockHandleTabClick).toHaveBeenCalledWith(REQUEST_TYPES.CLAIM);
  });

  it("does not call handleTabClick when a disabled tab is clicked", () => {
    mockIsTabDisabled.mockImplementation((tabType) => tabType === REQUEST_TYPES.CANCELLATION);

    renderComponent(REQUEST_TYPES.ALL);

    const disabledTab = screen.getByText(mockLanguageData.cancellation);
    fireEvent.click(disabledTab);

    expect(mockHandleTabClick).not.toHaveBeenCalled();
  });
});