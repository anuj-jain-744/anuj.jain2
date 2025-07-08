import React from "react";
import { render, screen } from "@testing-library/react";
import TravelPremiumBreakupUi from "./index";

jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: (amount: any) => `SAR ${amount}`,
}));

jest.mock("utils/quoteAndBuy", () => ({
  getBasePremium: jest.fn(() => 100),
  getDiscountDetails: jest.fn(() => [{description:"Loyalty Discount", amount:30}])
}));

jest.mock("components/Travel/constantsTravel", () => ({
  covergaeTypes: {
    comprehensive: "COMP",
    winterSports: "WINTER",
  },
}));

describe("TravelPremiumBreakupUi", () => {
  const baseProps = {
    langData: {
      product: {
        order_summary: "Order Summary",
        title: "Travel Insurance",
        additional_benefits1: "Additional Benefits",
        benfit_sports: "Winter Sports Coverage",
        benfit_covid: "Covid Coverage",
        adminfees: "Admin Fees",
        discount: "Discount",
        subtotal: "Subtotal",
        vat_amount: "VAT Amount",
        net_premium: "Net Premium",
      },
    },
    promoCMSData:{
      premium_breakdown: [        
        {
            "code": 3,
            "description": "Loyalty Discount"
        },
    ],
    },
    policyRiskData: [
      {
        travellerNameEnglish: "John Doe",
        policyCoverage: [
          {
            coverageCode: "COMP",
            premiumInfo: { annualPremium: 200 },
          },
          {
            coverageCode: "WINTER",
            premiumInfo: { annualPremium: 50 },
          },
        ],
      },
    ],
    travelPackageData: {
      premiumInfo: {
        finalPremium: 250,
        taxFeeBreakdowns: [
          { percentage: 0.05, amount: 12.5 },
          { percentage: 0.02, amount: 5 },
        ],
        premiumBreakdowns: [{
          "type": "3",
          "amount": 55.0,
          "percentage": null,
          "sign": -1
      }],
        premiumDue: 267.5,
      },
    },
    familyIndividual: "Individual",
    typeOfCoverage: "Comprehensive",
  };

  it("renders the component with all sections", () => {
    render(<TravelPremiumBreakupUi {...baseProps} />);
    
    expect(screen.getByText(baseProps.langData.product.order_summary)).toBeInTheDocument();

    expect(screen.getByText(baseProps.langData.product.title)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive - Individual/)).toBeInTheDocument();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(baseProps.langData.product.additional_benefits1)).toBeInTheDocument();

    expect(screen.getByText(baseProps.langData.product.subtotal)).toBeInTheDocument();
    expect(screen.getByText(baseProps.langData.product.net_premium)).toBeInTheDocument();

    expect(screen.getByText(baseProps.langData.product.adminfees)).toBeInTheDocument();
    expect(screen.getByText("Loyalty Discount")).toBeInTheDocument();
    
    expect(screen.getByText(/VAT Amount/)).toBeInTheDocument();
  });

  it("displays premium amounts formatted by getAmountWithIcon", () => {
    render(<TravelPremiumBreakupUi {...baseProps} />);

    expect(screen.getByText("SAR 100")).toBeInTheDocument();
    expect(screen.getAllByText("SAR 30").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SAR 255.00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SAR 12.5").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SAR 267.5").length).toBeGreaterThan(0);
  });

  it("handles empty policyRiskData gracefully", () => {
    render(
      <TravelPremiumBreakupUi
        {...baseProps}
        policyRiskData={null}
      />
    );

    expect(screen.getByText(baseProps.langData.product.order_summary)).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("displays correct premium for comprehensive coverage using getPremiumPrice", () => {
    const policyRiskDataWithCoverage = [
      {
        travellerNameEnglish: "Alice",
        policyCoverage: [
          {
            coverageCode: "COMP",
            premiumInfo: { annualPremium: 123.456 },
          },
          {
            coverageCode: "WINTER",
            premiumInfo: { annualPremium: 78.9 },
          },
        ],
      },
    ];

    render(
      <TravelPremiumBreakupUi
        {...baseProps}
        policyRiskData={policyRiskDataWithCoverage}
      />
    );

    expect(screen.getByText((content) => content.includes("SAR 123.46"))).toBeInTheDocument();
  });

  it("does NOT render additional benefits section if policyCoverage length is 1", () => {
    const singleCoveragePolicyRiskData = [
      {
        travellerNameEnglish: "Jane Doe",
        policyCoverage: [
          {
            coverageCode: "COMP",
            premiumInfo: { annualPremium: 300 },
          },
        ],
      },
    ];

    render(
      <TravelPremiumBreakupUi
        {...baseProps}
        policyRiskData={singleCoveragePolicyRiskData}
      />
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();

    expect(screen.queryByText(baseProps.langData.product.additional_benefits1)).not.toBeInTheDocument();
    expect(screen.queryByText(baseProps.langData.product.benfit_sports)).not.toBeInTheDocument();
    expect(screen.queryByText(baseProps.langData.product.benfit_covid)).not.toBeInTheDocument();
  });
});
