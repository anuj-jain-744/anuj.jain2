import React from "react";
import { render, screen } from "@testing-library/react";
import OrderSummaryTravelCard from "./index";


describe("OrderSummaryTravelCard", () => {
  const languageData = {
    sar: "SAR",
    order_summary: "Order Summary",
    endorsement: "Endorsement",
    endorsement_manage_traveler: "Manage Travelers",
    adminfees: "Admin Fees",
    subtotal: "Subtotal",
    vat_amount: "VAT Amount",
    total_amount: "Total Amount",
  };

  const props = {
    languageData,
    addBenefitData: {},
    adminFees: 100,
    subtotal: 500,
    vatAmount: 75,
    totalAmount: 675,
  };

  it("renders all static text from languageData", () => {
    render(<OrderSummaryTravelCard {...props} />);

    expect(screen.getByText(languageData.order_summary)).toBeInTheDocument();
    expect(screen.getByText(languageData.endorsement)).toBeInTheDocument();
    expect(screen.getByText(languageData.endorsement_manage_traveler)).toBeInTheDocument();
    expect(screen.getByText(languageData.adminfees)).toBeInTheDocument();
    expect(screen.getByText(languageData.subtotal)).toBeInTheDocument();
    expect(screen.getByText(`${languageData.vat_amount} (15%)`)).toBeInTheDocument();
    expect(screen.getByText(languageData.total_amount)).toBeInTheDocument();
  });

  it("renders all currency amounts formatted to 2 decimals with unit", () => {
    render(<OrderSummaryTravelCard {...props} />);

    expect(screen.getByText(`SAR ${props.adminFees.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`SAR ${props.subtotal.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`SAR ${props.vatAmount.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`SAR ${props.totalAmount.toFixed(2)}`)).toBeInTheDocument();
  });
});
