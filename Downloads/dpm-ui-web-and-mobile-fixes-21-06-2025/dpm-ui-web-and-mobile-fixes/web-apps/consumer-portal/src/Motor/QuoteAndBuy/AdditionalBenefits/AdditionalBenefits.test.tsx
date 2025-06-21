import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import AdditionalBenefits from "./index";

jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("context/PHQuoteBuyContext");
jest.mock("hook/home/useCalculatePremiumApi");
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn((amount) => amount ? `SAR ${amount}` : 'N/A'),
}));

describe("AdditionalBenefits Component", () => {
  const mockLanguageData = {
    additional_benefits: "Additional Benefits",
    show_less_benefits: "Show Less Benefits",
    something_went_wrong: "Something went wrong",
    internal_server_error: "Internal Server Error",
    home_additional_benefits: [],
    motor_additional_benefits: [],
    coverage_beneits: [],
  };

  const mockBenefits = [
    { benefitId: 1, benefitNameEn: "Benefit 1", benefitPrice: 100, benefitCode: "B1", description: "Description 1" },
    { benefitId: 2, benefitNameEn: "Benefit 2", benefitPrice: 200, benefitCode: "B2", description: "Description 2" },
    { benefitId: 3, benefitNameEn: "Benefit 3", benefitPrice: 300, benefitCode: "B3", description: "Description 3" },
    { benefitId: 4, benefitNameEn: "Benefit 4", benefitPrice: 300, benefitCode: "B4", description: "Description 4" },
    { benefitId: 5, benefitNameEn: "Benefit 5", benefitPrice: 300, benefitCode: "B5", description: "Description 5" },
  ];

  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue({
      selectedBenefits: [],
      setSelectedBenefits: jest.fn(),
      compWorkShop: { benefits: mockBenefits },
      comp3rdParty: { benefits: [] },
      compAgency: { benefits: [] },
      compMath: { benefits: [] },
      homePremiumResponse: null,
      setHomePremiumResponse: jest.fn(),
      requestPayload: {},
      updateRequestPayload: jest.fn(),
      viewPolicyData: null,
      isRenewpolicy: false,
    });

    usePHQuoteBuyContext.mockReturnValue({
      apiErrorMessage: { title: "", description: "" },
      setApiErrorMessage: jest.fn(),
      resetApiErrorMessage: jest.fn(),
      showAlertModal: false,
      setShowAlertModal: jest.fn(),
    });

    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn(),
      isError: null,
      isLoadingCalculatePremium: false,
      data: null,
    });
  });

  it("renders the component with benefits", () => {
    render(<AdditionalBenefits languageData={mockLanguageData} repairTypeSelected="Workshop Repair" />);

    expect(screen.getByText("Additional Benefits (5)")).toBeInTheDocument();
    expect(screen.getByText("Benefit 1")).toBeInTheDocument();
    expect(screen.getByText("Benefit 2")).toBeInTheDocument();
  });

  it("toggles a benefit when clicked", async () => {
    const setSelectedBenefits = jest.fn();
    useQuoteAndBuyContext.mockReturnValueOnce({
      ...useQuoteAndBuyContext(),
      setSelectedBenefits,
    });

    render(<AdditionalBenefits languageData={mockLanguageData} repairTypeSelected="Workshop Repair" />);

    const toggleButton = screen.getByText("Benefit 1");
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(setSelectedBenefits).toHaveBeenCalled();
    });
  });

  it("shows more benefits when 'Show More Benefits' is clicked", () => {
    render(<AdditionalBenefits languageData={mockLanguageData} repairTypeSelected="Workshop Repair" />);

    const showMoreButton = screen.getByText("Show More Benefits (1)");
    fireEvent.click(showMoreButton);

    expect(screen.getByText("Benefit 3")).toBeInTheDocument();
  });

  it("displays an alert modal when there is an error", () => {
    usePHQuoteBuyContext.mockReturnValueOnce({
      ...usePHQuoteBuyContext(),
      showAlertModal: true,
      apiErrorMessage: { title: "Error", description: "Something went wrong" },
    });

    render(<AdditionalBenefits languageData={mockLanguageData} repairTypeSelected="Workshop Repair" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});