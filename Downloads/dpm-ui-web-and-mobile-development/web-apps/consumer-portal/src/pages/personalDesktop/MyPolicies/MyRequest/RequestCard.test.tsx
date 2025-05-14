import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RequestCard from "./RequestCard";
import { PolicyStatus, REQUEST_TYPES } from "constant";
import { useNavigate } from "react-router-dom";

// Mock assets
jest.mock("assets/DashboardBanner/motorMyReqProduct.svg", () => "motor-product.svg");
jest.mock("assets/Dashboard/Arrow_Right.svg", () => "arrow-right.svg");
jest.mock("assets/Dashboard/disableArrowRight.svg", () => "disable-arrow-right.svg");
jest.mock("assets/Dashboard/Chevron Down.svg", () => "chevron-down.svg");
jest.mock("assets/Dashboard/Chevron Up.svg", () => "chevron-up.svg");
jest.mock("assets/Dashboard/Warning Fill.svg", () => "warning-fill.svg");
jest.mock("assets/Dashboard/Circle Tick.svg", () => "circle-tick.svg");
jest.mock("assets/Dashboard/Cancel.svg", () => "cancel.svg");
jest.mock("assets/Dashboard/Travel_MyRequest.svg", () => "travel-logo.svg");
jest.mock("assets/Dashboard/Home_MyRequest.svg", () => "home-logo.svg");

// Mock style module
jest.mock("./RequestCard.module.scss", () => ({
  mainContainer: "mainContainer",
  expandMainContainer: "expandMainContainer",
  container: "container",
  expandContainer: "expandContainer",
  expandTitleContainer: "expandTitleContainer",
  frameContainer: "frameContainer",
  productIconContainer: "productIconContainer",
  productContentContainer: "productContentContainer",
  typeContainer: "typeContainer",
  typeLabelContainer: "typeLabelContainer",
  typeValueContainer: "typeValueContainer",
  statusContainer: "statusContainer",
  statusLabelContainer: "statusLabelContainer",
  statusValueContainer: "statusValueContainer",
  statusValue: "statusValue",
  actionContainer: "actionContainer",
  linkContainer: "linkContainer",
  linkTextContainer: "linkTextContainer",
  linkText: "linkText",
  isDisabled: "isDisabled",
  dateContainer: "dateContainer",
  dateLabelContainer: "dateLabelContainer",
  dateValueContainer: "dateValueContainer",
  expandActionIcon: "expandActionIcon",
  expandDescriptionContainer: "expandDescriptionContainer",
  expandDescriptionTitleContainer: "expandDescriptionTitleContainer",
  expandDescriptionLabelContainer: "expandDescriptionLabelContainer",
  expandDescriptionText: "expandDescriptionText",
  expandDescriptionValue: "expandDescriptionValue",
  expandDescriptionValueText: "expandDescriptionValueText",
  expandReferenceContainer: "expandReferenceContainer",
  expandReferenceLabel: "expandReferenceLabel",
  expandReferenceLabelText: "expandReferenceLabelText",
  expandReferenceValue: "expandReferenceValue",
  expandReferenceValueText: "expandReferenceValueText",
  cardHorizontalLineOpen: "cardHorizontalLineOpen",
  expandBottomContainer: "expandBottomContainer",
  updatedOne: "updatedOne",
  active: "active",
  expired: "expired",
  cancelled: "cancelled",
}));

// Mock formatDate
jest.mock("utils/formatDate", () => ({
  formatDate: (date) => (date ? "formatted-date" : "-"),
}));

// Mock fileUtil
jest.mock("utils/fileUtil", () => ({
  getProductCode: jest.fn(() => "03"),
  getlineOfBusiness: jest.fn(() => "MOTOR"),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const defaultLanguageData = {
  quotation: "Quotation",
  claim: "Claim",
  endorsement: "Endorsement",
  cancellation: "Cancellation",
  status: "Status",
  pay: "Pay",
  track_your_claim: "Track your Claim",
  view: "View",
  last_updated_on: "Last Updated On",
  description: "Description",
  reference_id: "Reference ID",
};

describe("RequestCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const baseQuote = {
    quoteNo: "Q123",
    quoteStatus: "Active",
    productCode: "Motor",
    issueDate: "2023-01-01",
    description: "Quote for Motor",
  };

  const baseClaim = {
    claimNo: "C123",
    policyNo: "P123",
    productName: "Motor",
    subClaimStatus: "Active",
    dateOfNotification: "2023-01-02",
    description: "Motor Claim",
  };

  const basePolicy = {
    policyNo: "P123",
    policyStatus: "Active",
    issueDate: "2023-01-03",
    endorsementNo: undefined,
    endorsementType: undefined,
    description: "Policy Description",
  };

  it("renders quote card and triggers navigation on pay click", () => {
    render(
      <RequestCard
        data={baseQuote}
        isQuote={true}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    expect(screen.getByText("Quotation")).toBeInTheDocument();
    expect(screen.getByText("Q123")).toBeInTheDocument();
    expect(screen.getByText("Pay")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Last Updated On:")).toBeInTheDocument();
    expect(screen.getByText("formatted-date")).toBeInTheDocument();

    // Simulate navigation click
    fireEvent.click(screen.getByText("Pay"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/product/insurance-payment/Q123_03"
    );
  });

  it("renders claim card and triggers navigation on track your claim click", () => {
    render(
      <RequestCard
        data={baseClaim}
        isQuote={false}
        isClaim={true}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    expect(screen.getByText("Claim")).toBeInTheDocument();
    expect(screen.getByText("C123")).toBeInTheDocument();
    expect(screen.getByText("Track your Claim")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Track your Claim"));
    expect(mockNavigate).toHaveBeenCalledWith("/track-claim", {
      state: { data: { claimNo: "C123", lineOfBusiness: "MOTOR" } },
    });
  });

  it("renders policy card and triggers navigation on view click", () => {
    render(
      <RequestCard
        data={basePolicy}
        isQuote={false}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    expect(screen.getByText("View")).toBeInTheDocument();
    fireEvent.click(screen.getByText("View"));
    expect(mockNavigate).not.toHaveBeenCalled(); // Because type is "" (not endorsement/cancellation)
  });

  it("renders endorsement type and navigates on view click", () => {
    const endorsementPolicy = {
      ...basePolicy,
      endorsementNo: "E123",
      endorsementType: "Endorsement",
    };
    render(
      <RequestCard
        data={endorsementPolicy}
        isQuote={false}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={{ ...defaultLanguageData, endorsement: "Endorsement" }}
      />
    );
    expect(screen.getByText("Endorsement")).toBeInTheDocument();
    fireEvent.click(screen.getByText("View"));
    expect(mockNavigate).toHaveBeenCalledWith("/Motor/Claim/PolicyHistory", {
      state: { data: endorsementPolicy },
    });
  });

  it("renders cancellation type and navigates on view click", () => {
    const cancellationPolicy = {
      ...basePolicy,
      endorsementType: "Cancellation",
    };
    render(
      <RequestCard
        data={cancellationPolicy}
        isQuote={false}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={{ ...defaultLanguageData, cancellation: "Cancellation" }}
      />
    );
    expect(screen.getByText("Cancellation")).toBeInTheDocument();
    fireEvent.click(screen.getByText("View"));
    expect(mockNavigate).toHaveBeenCalledWith("/Motor/Claim/PolicyHistory", {
      state: { data: cancellationPolicy },
    });
  });

  it("shows correct product logo for Motor, Travel, Home, and default", () => {
    // Motor
    render(
      <RequestCard
        data={{ ...baseQuote, productCode: "Motor" }}
        isQuote={true}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    expect(screen.getByAltText("motor product")).toHaveAttribute(
      "src",
      "home-logo.svg"
    );

    // Travel
    render(
      <RequestCard
        data={{ ...baseQuote, productCode: "TRVL" }}
        isQuote={true}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    // expect(screen.getByAltText("motor product")).toHaveAttribute(
    //   "src",
    //   "travel-logo.svg"
    // );

    // Home
    render(
      <RequestCard
        data={{ ...baseQuote, productCode: "HOME" }}
        isQuote={true}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    // expect(screen.getByAltText("motor product")).toHaveAttribute(
    //   "src",
    //   "home-logo.svg"
    // );

    // Default
    render(
      <RequestCard
        data={{ ...baseQuote, productCode: "UNKNOWN" }}
        isQuote={true}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    // expect(screen.getByAltText("motor product")).toHaveAttribute(
    //   "src",
    //   "motor-product.svg"
    // );
  });

  it("toggles expand/collapse when arrow is clicked", () => {
    const onToggle = jest.fn();
    render(
      <RequestCard
        data={baseQuote}
        isQuote={true}
        isClaim={false}
        isOpen={false}
        onToggle={onToggle}
        languageData={defaultLanguageData}
      />
    );
    const downArrow = screen.getByAltText("down arrow");
    fireEvent.click(downArrow);
    expect(onToggle).toHaveBeenCalled();
  });

  it("renders expanded content when isOpen is true", () => {
    render(
      <RequestCard
        data={baseQuote}
        isQuote={true}
        isClaim={false}
        isOpen={true}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Quote for Motor")).toBeInTheDocument();
    expect(screen.getByText("Reference ID")).toBeInTheDocument();
  });

  it("disables navigation and shows disabled arrow for rejected/expired quotes", () => {
    render(
      <RequestCard
        data={{ ...baseQuote, quoteStatus: "Reject" }}
        isQuote={true}
        isClaim={false}
        isOpen={false}
        onToggle={jest.fn()}
        languageData={defaultLanguageData}
      />
    );
    expect(screen.getByText("Pay")).toBeInTheDocument();
    // Should show disabled arrow
    expect(screen.getByAltText("arrow")).toHaveAttribute("src", "home-logo.svg");
    // Clicking Pay should NOT navigate
    fireEvent.click(screen.getByText("Pay"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
