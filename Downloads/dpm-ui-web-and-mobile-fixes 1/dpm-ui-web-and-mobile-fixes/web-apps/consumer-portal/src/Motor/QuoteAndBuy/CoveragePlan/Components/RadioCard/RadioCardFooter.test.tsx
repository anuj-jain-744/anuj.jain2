import React from "react";
import { render, screen } from "@testing-library/react";
import RadioCardFooter from "./RadioCardFooter";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { LanguageData } from "types/languageData";
import { IComprehensive } from "../../ConstantValue/ConstantValue";

jest.mock("components/hooks/useQuoteAndBuyContext");

const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.MockedFunction<
  typeof useQuoteAndBuyContext
>;

describe("RadioCardFooter", () => {
  const mockLanguageData: LanguageData = {
    sar: "SAR",
    vat: "VAT",
    starting_from: "Starting from",
  };

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      comp3rdParty: {
        benefits: [], // Add benefits property
        policyEffectiveDate: "", // Add policyEffectiveDate property
        policyExpiryDate: "", // Add policyExpiryDate property
        previousPolicyNo: "", // Add previousPolicyNo property
        // Add other missing properties from PolicyDetails type
        pricingOptions: [
          {
            finalAmount: 1000,
            taxFeeBreakdowns: [
              {
                percentage: 5,
                amount: 0,
                type: ""
              },
            ],
            deductibleReferenceNo: "",
            deductibleAmount: 0,
            premiumBreakdowns: [],
            premiumDue: 0
          },
        ],
      },
      compWorkShop: {
        benefits: [], // Add benefits property
        policyEffectiveDate: "", // Add policyEffectiveDate property
        policyExpiryDate: "", // Add policyExpiryDate property
        previousPolicyNo: "", // Add previousPolicyNo property
        // Add other missing properties from PolicyDetails type
        pricingOptions: [
          {
            deductibleReferenceNo: "1",
            deductibleAmount: 0,
            finalAmount: 0,
            premiumBreakdowns: [],
            premiumDue: 0,
            taxFeeBreakdowns: []
          },
        ],
      },
      compAgency: {
        benefits: [], // Add benefits property
        policyEffectiveDate: "", // Add policyEffectiveDate property
        policyExpiryDate: "", // Add policyExpiryDate property
        previousPolicyNo: "", // Add previousPolicyNo property
        // Add other missing properties from PolicyDetails type
      },
      compMath: {},
      comprehensiveCardPrice: null,
      sliderValueDeductibles: "",
      setSliderValueDeductibles: jest.fn(),
      setComprehensiveCardPrice: jest.fn(),
    });
  });

  it("should render ThirdpartyFooter when label is not IComprehensive", () => {
    render(
      <RadioCardFooter label="ThirdParty" languageData={mockLanguageData} />
    );

    expect(screen.getByText("SAR")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("should render ComprehensiveFooter when label is IComprehensive", () => {
    render(
      <RadioCardFooter label={IComprehensive} languageData={mockLanguageData} />
    );

    expect(screen.getByText("Starting from")).toBeInTheDocument();
    expect(screen.getByText("SAR")).toBeInTheDocument();
  });

  it("should render without crashing when languageData is null", () => {
    render(<RadioCardFooter label="ThirdParty" languageData={null as unknown as LanguageData} />);

    expect(screen.queryByText("SAR")).not.toBeInTheDocument();
  });
});
