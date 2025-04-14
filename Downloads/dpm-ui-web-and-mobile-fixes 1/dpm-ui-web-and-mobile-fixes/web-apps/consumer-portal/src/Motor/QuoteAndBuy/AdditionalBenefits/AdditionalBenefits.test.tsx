import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdditionalBenefits from "./index";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { useApiCall } from "@dpm/shared-module";

jest.mock("components/hooks/useQuoteAndBuyContext");
const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

jest.mock("@dpm/shared-module");
const mockUseApiCall = useApiCall as jest.Mock;

describe("AdditionalBenefits Component", () => {
  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      selectedBenefits: [
        { title: "Benefit 1", price: 100 },
      ],
      homePremiumResponse: {
        'testcare': {
          'purchasedCoverage': [
            {
              'covergeCode': 'cc',
              'premiumInfo': {
                'finalPremium': 1
              }
            }
          ]
        }
      },
      setSelectedBenefits: jest.fn(),
      compWorkShop: {
        benefits: [
          {
            benefitId: 1,
            benefitNameEn: "Benefit 1",
            description: "Description 1",
            benefitPrice: 100,
          },
          {
            benefitId: 2,
            benefitNameEn: "Benefit 2",
            description: "Description 2",
            benefitPrice: 200,
          },
          {
            benefitId: 3,
            benefitNameEn: "Benefit 3",
            description: "Description 3",
            benefitPrice: 300,
          },
        ],
      },
    });

    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: {
        config: [
          {
            additional_benefits: "Additional Benefits",
            add_label: "Add",
            remove: "Remove",
            sar: "SAR",
            show_more_benefits: "Show More Benefits",
            show_less_benefits: "Show Less Benefits",
          },
        ],
      },
    });
  });

  test("renders AdditionalBenefits component", () => {
    render(<AdditionalBenefits repairTypeSelected="test care" languageData={{test:'test'}} />);
    expect(screen.getByText("Additional Benefits (3)")).toBeInTheDocument();
  });

  test("renders benefit cards", () => {
    render(<AdditionalBenefits repairTypeSelected="test care" languageData={{test:'test'}} />);
    expect(screen.getByText("Benefit 1")).toBeInTheDocument();
    expect(screen.getByText("Benefit 2")).toBeInTheDocument();
    expect(screen.queryByText("Benefit 3")).not.toBeInTheDocument();
  });

  test("toggles benefit", async () => {
    const { setSelectedBenefits } = mockUseQuoteAndBuyContext();
    render(<AdditionalBenefits repairTypeSelected="test care" languageData={{test:'test'}} />);
    const addButton = screen.getAllByText("Add")[0];
    fireEvent.click(addButton);
    await waitFor(() => {
      const removeButton = screen.queryByText("Remove");
      expect(removeButton).toBeInTheDocument();

      expect(setSelectedBenefits).toHaveBeenCalled();      
    });
   
  });

  test("shows more benefits", () => {
    render(<AdditionalBenefits />);
    const showMoreButton = screen.getByText("Show More Benefits (1)");
    fireEvent.click(showMoreButton);
    expect(screen.getByText("Benefit 3")).toBeInTheDocument();
  });

  test("shows less benefits", () => {
    render(<AdditionalBenefits />);
    const showMoreButton = screen.getByText("Show More Benefits (1)");
    fireEvent.click(showMoreButton);
    const showLessButton = screen.getByText("Show Less Benefits");
    fireEvent.click(showLessButton);
    expect(screen.queryByText("Benefit 3")).not.toBeInTheDocument();
  });
});