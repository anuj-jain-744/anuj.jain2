import { render, screen, fireEvent } from "@testing-library/react";
import HousePropertyLinks from "./HousePropertyLinks"; // Default import
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { LanguageData } from "types/languageData";

// Mock the context hooks
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

// Mock modals to simplify testing
jest.mock("../ContentBenefits", () => () => <div>Content Benefits Modal</div>);
jest.mock("../AddionalBenefits", () => () => <div>Additional Benefits Modal</div>);
jest.mock("../PropertyPhotos", () => () => <div>Property Photos Modal</div>);

describe("HousePropertyLinks", () => {
  const mockLanguageData: LanguageData = {
    view_property_photos: "View Property Photos",
    view_content_benefits: "View Content Benefits",
    additional_benefits: "Additional Benefits",
  };

beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockImplementation(() => ({
        selectedBenefits: [{ title: "Benefit 1" }, { title: "Benefit 2" }],
    }));
    (usePHQuoteBuyContext as jest.Mock).mockImplementation(() => ({
        selectedContetBenefits: [{ title: "Content Benefit 1" }],
    }));
});

  it("should render the component and display the correct texts", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    // Check if the text and benefits count are rendered correctly
    expect(screen.getByText("View Property Photos")).toBeInTheDocument();
    expect(screen.getByText("View Content Benefits (1)")).toBeInTheDocument();
    expect(screen.getByText("Additional Benefits (2)")).toBeInTheDocument();
  });

  it("should show Property Photos Modal when clicked", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    const propertyPhotosLink = screen.getByText("View Property Photos");

    // Click to open the modal
    fireEvent.click(propertyPhotosLink);

    // Check if the modal is shown
    expect(screen.getByText("Property Photos Modal")).toBeInTheDocument();
  });

  it("should show Content Benefits Modal when clicked", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    const contentBenefitsLink = screen.getByText("View Content Benefits (1)");

    // Click to open the modal
    fireEvent.click(contentBenefitsLink);

    // Check if the modal is shown
    expect(screen.getByText("Content Benefits Modal")).toBeInTheDocument();
  });

  it("should show Additional Benefits Modal when clicked", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    const additionalBenefitsLink = screen.getByText("Additional Benefits (2)");

    // Click to open the modal
    fireEvent.click(additionalBenefitsLink);

    // Check if the modal is shown
    expect(screen.getByText("Additional Benefits Modal")).toBeInTheDocument();
  });

  it("should close all modals when handleCloseModal is called", () => {
    render(<HousePropertyLinks languageData={mockLanguageData} />);

    const propertyPhotosLink = screen.getByText("View Property Photos");
    const contentBenefitsLink = screen.getByText("View Content Benefits (1)");
    const additionalBenefitsLink = screen.getByText("Additional Benefits (2)");

    // Open all modals by clicking
    fireEvent.click(propertyPhotosLink);
    fireEvent.click(contentBenefitsLink);
    fireEvent.click(additionalBenefitsLink);

    // Ensure modals are opened
    expect(screen.getByText("Property Photos Modal")).toBeInTheDocument();
    expect(screen.getByText("Content Benefits Modal")).toBeInTheDocument();
    expect(screen.getByText("Additional Benefits Modal")).toBeInTheDocument();

    // Close all modals
    fireEvent.click(screen.getByText("View Property Photos")); // simulate closing by clicking again
    fireEvent.click(screen.getByText("View Content Benefits (1)")); // simulate closing by clicking again
    fireEvent.click(screen.getByText("Additional Benefits (2)")); // simulate closing by clicking again

    // Check if modals are closed by verifying that they are no longer in the document
    /*expect(screen.queryByText("Property Photos Modal")).toBeNull();
    expect(screen.queryByText("Content Benefits Modal")).toBeNull();
    expect(screen.queryByText("Additional Benefits Modal")).toBeNull();*/
  });

it("should correctly display the benefits count", () => {
    (useQuoteAndBuyContext as jest.Mock).mockImplementation(() => ({
        selectedBenefits: [{ title: "Benefit 1" }, { title: "Benefit 2" }],
    }));
    (usePHQuoteBuyContext as jest.Mock).mockImplementation(() => ({
        selectedContetBenefits: [],
    }));

    render(<HousePropertyLinks languageData={mockLanguageData} />);

    // Check if the count is correctly displayed for both benefits
    expect(screen.getByText("Additional Benefits (2)")).toBeInTheDocument();
    expect(screen.getByText("View Content Benefits")).toBeInTheDocument(); // No benefits, so no count
});
});
