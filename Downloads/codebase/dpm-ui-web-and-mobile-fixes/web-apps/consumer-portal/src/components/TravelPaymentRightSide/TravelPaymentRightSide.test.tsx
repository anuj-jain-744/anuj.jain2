import React from "react";
import { render, screen } from "@testing-library/react";
import { TravelPaymentRightSide } from "./index";

jest.mock("components/PolicyStartDate", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="policy-start-date">
      PolicyStartDate - languageData: {JSON.stringify(props.languageData)}
    </div>
  ),
}));

jest.mock("components/TravelPremiumBreakUp/index", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="travel-premium-breakup">
      TravelPremiumBreakUp - languageData: {JSON.stringify(props.languageData)} - 
      title: {props.title} - subtitle: {props.subtitle} - producttype: {props.producttype} - leftStep: {props.leftStep}
    </div>
  ),
}));

describe("TravelPaymentRightSide", () => {
  const languageData = { premium_breakup: "Premium Breakdown" };
  const leftStep = jest.fn();

  it("renders PolicyStartDate and TravelPremiumBreakUp with correct props", () => {
    render(<TravelPaymentRightSide languageData={languageData} leftStep={leftStep} />);

    const policyStartDate = screen.getByTestId("policy-start-date");
    expect(policyStartDate).toBeInTheDocument();
    expect(policyStartDate).toHaveTextContent(JSON.stringify(languageData));

    const travelPremiumBreakUp = screen.getByTestId("travel-premium-breakup");
    expect(travelPremiumBreakUp).toBeInTheDocument();
    expect(travelPremiumBreakUp).toHaveTextContent(languageData.premium_breakup);
    expect(travelPremiumBreakUp).toHaveTextContent("subtitle:");
    expect(travelPremiumBreakUp).toHaveTextContent("producttype: Travel");
  });

  it("renders correctly when languageData is undefined", () => {
    render(<TravelPaymentRightSide leftStep={leftStep} />);

    expect(screen.getByTestId("policy-start-date")).toBeInTheDocument();
    expect(screen.getByTestId("travel-premium-breakup")).toBeInTheDocument();
  });
});