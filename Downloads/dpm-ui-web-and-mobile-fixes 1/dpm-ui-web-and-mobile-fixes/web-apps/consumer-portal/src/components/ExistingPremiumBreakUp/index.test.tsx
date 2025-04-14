import { render, screen, fireEvent } from "@testing-library/react";
import ExistingPremiumBreakUp from "./index"; // Default import
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";

// Mock the context hook
jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe("ExistingPremiumBreakUp", () => {
  const mockSetPremium = jest.fn();
  const mockLanguageData: LanguageData = {
    sar: "SAR",
    additional_driver_premium: "Additional Driver Premium",
    subtotal: "Subtotal",
    vat_amount: "VAT Amount",
    net_premium: "Net Premium",
  };

  beforeEach(() => {
    // Reset mocks before each test
    mockSetPremium.mockClear();
    useQuoteAndBuyContext.mockReturnValue({
      selectedBenefits: [
        { title: "Benefit 1", price: 100 },
        { title: "Benefit 2", price: 200 },
      ],
      repairTypeSelected: "Workshop Repair",
      workShopInitialPrice: 300,
      agencyInitialPrice: 0,
      mathInitialPrice: 0,
      comp3rdParty: { pricingOptions: [{ finalAmount: 500 }] },
      premium: 0,
      setPremium: mockSetPremium,
      driverDetailsData: [{}, {}], // two drivers
    });
  });

  it("should render the title and subtitle", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={mockLanguageData}
        title="Test Title"
        subtitle="Test Subtitle"
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("should render the premium details", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={mockLanguageData}
        title="Test Title"
        subtitle="Test Subtitle"
      />
    );

    // Check if benefits are rendered correctly
    expect(screen.getByText("Benefit 1")).toBeInTheDocument();
    expect(screen.getByText("SAR 100.00")).toBeInTheDocument();
    expect(screen.getByText("Benefit 2")).toBeInTheDocument();
    expect(screen.getByText("SAR 200.00")).toBeInTheDocument();

    // Check if the subtotal is rendered correctly
    expect(screen.getByText("SAR 600.00")).toBeInTheDocument();
    // Check if VAT is calculated correctly
    expect(screen.getByText("SAR 90.00")).toBeInTheDocument();
    // Check if net premium is rendered correctly
    expect(screen.getByText("SAR 690.00")).toBeInTheDocument();
  });

  it("should toggle accordion body on click", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={mockLanguageData}
        title="Test Title"
        subtitle="Test Subtitle"
      />
    );

    const accordionHeader = screen.getByText("Test Title");

    // Initially, the body should be collapsed
    expect(screen.queryByText("Benefit 1")).toBeNull();

    // Open the accordion by clicking on the header
    fireEvent.click(accordionHeader);
    
    // After opening, the body content should be visible
    expect(screen.getByText("Benefit 1")).toBeInTheDocument();

    // Close the accordion by clicking on the header again
    fireEvent.click(accordionHeader);
    
    // After closing, the body content should be hidden
    expect(screen.queryByText("Benefit 1")).toBeNull();
  });

  it("should calculate and set the premium correctly", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={mockLanguageData}
        title="Test Title"
        subtitle="Test Subtitle"
      />
    );

    // Ensure that the `setPremium` function has been called with the correct value
    expect(mockSetPremium).toHaveBeenCalledWith(690);
  });

  it("should render additional driver premium when driverDetailsData is available", () => {
    render(
      <ExistingPremiumBreakUp
        languageData={mockLanguageData}
        title="Test Title"
        subtitle="Test Subtitle"
      />
    );

    // Check if the additional driver premium is rendered
    expect(screen.getByText("Additional Driver Premium x 2")).toBeInTheDocument();
    expect(screen.getByText("SAR 50.00")).toBeInTheDocument(); // Assuming additional_driver_premium = 50
  });

  it("should not render additional driver premium when driverDetailsData is empty", () => {
    useQuoteAndBuyContext.mockReturnValue({
      selectedBenefits: [
        { title: "Benefit 1", price: 100 },
        { title: "Benefit 2", price: 200 },
      ],
      repairTypeSelected: "Workshop Repair",
      workShopInitialPrice: 300,
      agencyInitialPrice: 0,
      mathInitialPrice: 0,
      comp3rdParty: { pricingOptions: [{ finalAmount: 500 }] },
      premium: 0,
      setPremium: mockSetPremium,
      driverDetailsData: [], // No drivers
    });

    render(
      <ExistingPremiumBreakUp
        languageData={mockLanguageData}
        title="Test Title"
        subtitle="Test Subtitle"
      />
    );

    // Ensure the additional driver premium is not rendered
    expect(screen.queryByText("Additional Driver Premium x 2")).toBeNull();
  });
});
