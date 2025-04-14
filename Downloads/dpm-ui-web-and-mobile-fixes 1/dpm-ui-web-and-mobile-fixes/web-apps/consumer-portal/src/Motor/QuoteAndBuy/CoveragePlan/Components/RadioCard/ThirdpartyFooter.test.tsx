import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ThirdpartyFooter from "./ThirdpartyFooter"; // Path to the component
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import { compensationTypeCardFinalVAT } from "../../CommonFunction/CommonFunction";

// Mock the hooks and functions
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock("../../CommonFunction/CommonFunction");
jest.mock("@dpm/shared-module");

const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;
const mockCompensationTypeCardFinalVAT = compensationTypeCardFinalVAT as jest.Mock;
const mockGetAmountText = mockGetAmountText as jest.Mock;

describe("ThirdpartyFooter", () => {
  const languageData: LanguageData = {
    sar: "SAR",
    vat: "VAT",
    starting_from: "Starting from",
  };

  beforeEach(() => {
    // Default mock return values
    mockUseQuoteAndBuyContext.mockReturnValue({
      comp3rdParty: {
        pricingOptions: [
          {
            finalAmount: 2000,
            taxFeeBreakdowns: [
              {
                percentage: 0.15, // 15% VAT
              },
            ],
          },
        ],
      },
    });

    mockCompensationTypeCardFinalVAT.mockReturnValue(15);
    mockGetAmountText.mockReturnValue("2,000");
  });

  test("renders ThirdpartyFooter component with correct values", () => {
    render(<ThirdpartyFooter languageData={languageData} />);

    // Check if "SAR" is rendered
    expect(screen.getByText("SAR")).toBeInTheDocument();

    // Check if the correct amount ("2,000") is rendered
    expect(screen.getByText("2,000")).toBeInTheDocument();

    // Check if VAT text with 15% is rendered
    expect(screen.getByText("+15% VAT")).toBeInTheDocument();

    // Check if starting from text is rendered
    expect(screen.getByText(languageData.starting_from)).toBeInTheDocument();
  });

  test("renders ThirdpartyFooter component with different pricing option", () => {
    // Mocking the pricing data with different values for testing
    mockUseQuoteAndBuyContext.mockReturnValueOnce({
      comp3rdParty: {
        pricingOptions: [
          {
            finalAmount: 3000,
            taxFeeBreakdowns: [
              {
                percentage: 0.10, // 10% VAT
              },
            ],
          },
        ],
      },
    });

    // Mocking the new amount text
    mockGetAmountText.mockReturnValueOnce("3,000");

    render(<ThirdpartyFooter languageData={languageData} />);

    // Check if "SAR" is rendered
    expect(screen.getByText("SAR")).toBeInTheDocument();

    // Check if the correct amount ("3,000") is rendered
    expect(screen.getByText("3,000")).toBeInTheDocument();

    // Check if VAT text with 10% is rendered
    expect(screen.getByText("+10% VAT")).toBeInTheDocument();

    // Check if starting from text is rendered
    expect(screen.getByText(languageData.starting_from)).toBeInTheDocument();
  });

  test("renders ThirdpartyFooter component with no pricing options", () => {
    // Mocking with no pricing options available
    mockUseQuoteAndBuyContext.mockReturnValueOnce({
      comp3rdParty: {
        pricingOptions: [], // Empty pricing options
      },
    });

    render(<ThirdpartyFooter languageData={languageData} />);

    // Check if no "SAR" is rendered
    expect(screen.queryByText("SAR")).not.toBeInTheDocument();

    // Check if no amount is rendered
    expect(screen.queryByText("2,000")).not.toBeInTheDocument();

    // Check if no VAT text is rendered
    expect(screen.queryByText("+15% VAT")).not.toBeInTheDocument();

    // Check if "Starting from" text is rendered (edge case for empty data)
    expect(screen.getByText(languageData.starting_from)).toBeInTheDocument();
  });

  test("renders ThirdpartyFooter component with undefined pricing options", () => {
    // Mocking undefined pricing options
    mockUseQuoteAndBuyContext.mockReturnValueOnce({
      comp3rdParty: {
        pricingOptions: undefined, // Undefined pricing options
      },
    });

    render(<ThirdpartyFooter languageData={languageData} />);

    // Check if no "SAR" is rendered
    expect(screen.queryByText("SAR")).not.toBeInTheDocument();

    // Check if no amount is rendered
    expect(screen.queryByText("2,000")).not.toBeInTheDocument();

    // Check if no VAT text is rendered
    expect(screen.queryByText("+15% VAT")).not.toBeInTheDocument();

    // Check if "Starting from" text is rendered (edge case for undefined data)
    expect(screen.getByText(languageData.starting_from)).toBeInTheDocument();
  });

  test("renders ThirdpartyFooter component with different VAT percentages", () => {
    // Mocking the pricing data with different VAT percentage
    mockUseQuoteAndBuyContext.mockReturnValueOnce({
      comp3rdParty: {
        pricingOptions: [
          {
            finalAmount: 2500,
            taxFeeBreakdowns: [
              {
                percentage: 0.20, // 20% VAT
              },
            ],
          },
        ],
      },
    });

    // Mocking the new amount text
    mockGetAmountText.mockReturnValueOnce("2,500");

    render(<ThirdpartyFooter languageData={languageData} />);

    // Check if "SAR" is rendered
    expect(screen.getByText("SAR")).toBeInTheDocument();

    // Check if the correct amount ("2,500") is rendered
    expect(screen.getByText("2,500")).toBeInTheDocument();

    // Check if VAT text with 20% is rendered
    expect(screen.getByText("+20% VAT")).toBeInTheDocument();

    // Check if starting from text is rendered
    expect(screen.getByText(languageData.starting_from)).toBeInTheDocument();
  });

  test("renders ThirdpartyFooter component with different final amounts", () => {
    // Mocking the pricing data with different final amount
    mockUseQuoteAndBuyContext.mockReturnValueOnce({
      comp3rdParty: {
        pricingOptions: [
          {
            finalAmount: 1500,
            taxFeeBreakdowns: [
              {
                percentage: 0.05, // 5% VAT
              },
            ],
          },
        ],
      },
    });

    // Mocking the new amount text
    mockGetAmountText.mockReturnValueOnce("1,500");

    render(<ThirdpartyFooter languageData={languageData} />);

    // Check if "SAR" is rendered
    expect(screen.getByText("SAR")).toBeInTheDocument();

    // Check if the correct amount ("1,500") is rendered
    expect(screen.getByText("1,500")).toBeInTheDocument();

    // Check if VAT text with 5% is rendered
    expect(screen.getByText("+5% VAT")).toBeInTheDocument();

    // Check if starting from text is rendered
    expect(screen.getByText(languageData.starting_from)).toBeInTheDocument();
  });
});