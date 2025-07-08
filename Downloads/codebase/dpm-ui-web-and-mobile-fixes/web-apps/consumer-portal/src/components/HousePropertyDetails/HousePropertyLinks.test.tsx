import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HousePropertyLinks from "./HousePropertyLinks";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";

// Mock the context hooks
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

// Mock the modals
jest.mock("../ContentBenefits", () => (props: { onHide: () => void }) => (
  <div data-testid="content-benefits-modal">
    Content Benefits Modal
    <button onClick={props.onHide}>Close</button>
  </div>
));

jest.mock("../AddionalBenefits", () => (props: { onHide: () => void }) => (
  <div data-testid="additional-benefits-modal">
    Additional Benefits Modal
    <button onClick={props.onHide}>Close</button>
  </div>
));

jest.mock("../PropertyPhotos", () => (props: { onHide: () => void }) => (
  <div data-testid="property-photos-modal">
    Property Photos Modal
    <button onClick={props.onHide}>Close</button>
  </div>
));

describe("HousePropertyLinks Component", () => {
  const mockLanguageData = {
    view_property_photos: "View Property Photos",
    view_content_benefits: "View Content Benefits",
    additional_benefits: "Additional Benefits",
  };

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      selectedBenefits: ["Benefit 1", "Benefit 2"],
    });

    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      selectedContetBenefits: ["Content Benefit 1"],
    });
  });

  it("renders the component with correct text and images", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    expect(screen.getByText("View Property Photos")).toBeInTheDocument();
    expect(screen.getByText("View Content Benefits (1)")).toBeInTheDocument();
    expect(screen.getByText("Additional Benefits (2)")).toBeInTheDocument();
    expect(screen.getAllByAltText("")).toHaveLength(3); // Query by empty alt text
  });

  it("opens the Property Photos modal when the corresponding link is clicked", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    const propertyPhotosLink = screen.getByText("View Property Photos");
    fireEvent.click(propertyPhotosLink);

    expect(screen.getByTestId("property-photos-modal")).toBeInTheDocument();
  });

  it("opens the Content Benefits modal when the corresponding link is clicked", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    const contentBenefitsLink = screen.getByText("View Content Benefits (1)");
    fireEvent.click(contentBenefitsLink);

    expect(screen.getByTestId("content-benefits-modal")).toBeInTheDocument();
  });

  it("opens the Additional Benefits modal when the corresponding link is clicked", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    const additionalBenefitsLink = screen.getByText("Additional Benefits (2)");
    fireEvent.click(additionalBenefitsLink);

    expect(screen.getByTestId("additional-benefits-modal")).toBeInTheDocument();
  });

  it("closes all modals when the close handler is triggered", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);
  
    const propertyPhotosLink = screen.getByText("View Property Photos");
    fireEvent.click(propertyPhotosLink);
  
    // Ensure the modal is open
    expect(screen.getByTestId("property-photos-modal")).toBeInTheDocument();
  
    // Simulate closing the modal
    const closeModalButton = screen.getByText("Close");
    fireEvent.click(closeModalButton);
  
    // Ensure the modal is closed
    expect(screen.queryByTestId("property-photos-modal")).not.toBeInTheDocument();
  });
  it("triggers Property Photos modal on Enter key press", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);
  
    const propertyPhotosLink = screen.getByText("View Property Photos");
    fireEvent.keyDown(propertyPhotosLink, { key: "Enter", code: "Enter" });
  
    expect(screen.getByTestId("property-photos-modal")).toBeInTheDocument();
  });
  
  it("triggers Content Benefits modal on Enter key press", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);
  
    const contentBenefitsLink = screen.getByText("View Content Benefits (1)");
    fireEvent.keyDown(contentBenefitsLink, { key: "Enter", code: "Enter" });
  
    expect(screen.getByTestId("content-benefits-modal")).toBeInTheDocument();
  });
  
  it("triggers Additional Benefits modal on Enter key press", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);
  
    const additionalBenefitsLink = screen.getByText("Additional Benefits (2)");
    fireEvent.keyDown(additionalBenefitsLink, { key: "Enter", code: "Enter" });
  
    expect(screen.getByTestId("additional-benefits-modal")).toBeInTheDocument();
  });
  it("does not render modals when their state is false", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);
  
    expect(screen.queryByTestId("property-photos-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("content-benefits-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("additional-benefits-modal")).not.toBeInTheDocument();
  });
  it("renders correctly when context values are empty", () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      selectedBenefits: [],
    });
  
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      selectedContetBenefits: [],
    });
  
    render(<HousePropertyLinks languageData={mockLanguageData} />);
  
    expect(screen.getByText("View Content Benefits")).toBeInTheDocument();
    expect(screen.getByText("Additional Benefits")).toBeInTheDocument();
  });
  it("closes all modals when handleCloseModal is called", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);
  
    const propertyPhotosLink = screen.getByText("View Property Photos");
    fireEvent.click(propertyPhotosLink);
  
    const closeModalButton = screen.getByText("Close");
    fireEvent.click(closeModalButton);
  
    expect(screen.queryByTestId("property-photos-modal")).not.toBeInTheDocument();
  });

});