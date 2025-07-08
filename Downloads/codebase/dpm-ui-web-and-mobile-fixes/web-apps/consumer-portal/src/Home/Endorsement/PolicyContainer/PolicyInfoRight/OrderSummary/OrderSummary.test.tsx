import React from "react";
import { render, screen } from "@testing-library/react";
import OrderSummary from "./index";

jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: (amount: number) => `₹${amount}`,
}));

jest.mock("Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction", () => ({
  compensationTypeCardFinalVAT: (percentage: number) => percentage ?? 0,
}));

describe("OrderSummary component", () => {
  const languageData = {
    order_summary: "Order Summary",
    endorsement: "Endorsement",
    adminfees: "Admin Fees",
    additional_benefits: "Additional Benefits",
    coverage_beneits: [
      { coverageCode: "A1", coverageName: "Coverage A1" },
      { coverageCode: "B2", coverageName: "Coverage B2" },
    ],
    subtotal: "Subtotal",
    vat_amount: "VAT Amount",
    total_amount: "Total Amount",
  };

  const viewPolicy = {
    policyBasic: {
      premiumInfo: {
        taxFeeBreakdowns: [{ percentage: 15 }],
      },
    },
  };

  const orderSummary = {
    policyBenefits: [
      {
        coverageCode: "A1",
        premiumInfo: { finalPremium: 100 },
      },
      {
        coverageCode: "B2",
        premiumInfo: { finalPremium: 200 },
      },
    ],
    adminFeeAmount: 50,
    subtotal: 300,
    vatAmount: 45,
    netPremium: 395,
  };

  it("renders all summary details correctly", () => {
    render(
      <OrderSummary
        languageData={languageData}
        orderSummary={orderSummary}
        viewPolicy={viewPolicy}
      />
    );

    expect(screen.getByText(languageData.order_summary)).toBeInTheDocument();
    expect(screen.getByText(languageData.endorsement)).toBeInTheDocument();

    expect(screen.getByText(languageData.adminfees)).toBeInTheDocument();
    expect(screen.getByText("₹50")).toBeInTheDocument();

    expect(screen.getByText(languageData.additional_benefits)).toBeInTheDocument();
    expect(screen.getByText("Coverage A1")).toBeInTheDocument();
    expect(screen.getByText("₹100")).toBeInTheDocument();

    expect(screen.getByText("Coverage B2")).toBeInTheDocument();
    expect(screen.getByText("₹200")).toBeInTheDocument();

    expect(screen.getByText(languageData.subtotal)).toBeInTheDocument();
    expect(screen.getByText("₹350")).toBeInTheDocument();

    expect(screen.getByText(`${languageData.vat_amount} (15%)`)).toBeInTheDocument();
    expect(screen.getByText("₹45")).toBeInTheDocument();

    expect(screen.getByText(languageData.total_amount)).toBeInTheDocument();
    expect(screen.getByText("₹395")).toBeInTheDocument();
  });

  it("renders without crashing with empty policyBenefits", () => {
    render(
      <OrderSummary
        languageData={languageData}
        orderSummary={{ ...orderSummary, policyBenefits: [] }}
        viewPolicy={viewPolicy}
      />
    );

    expect(screen.getByText(languageData.additional_benefits)).toBeInTheDocument()
    expect(screen.queryByTestId("ageOfBuilding")).not.toBeInTheDocument();
  });
});
