import React from "react";
import { render, screen } from "@testing-library/react";
import RegisterClaimRight from "./index";
import PolicyInfo from "Home/Components/PolicyInfo";
import DidYouKnowCard from "Motor/DidYouKnowCard/DidYouKnowCard";

jest.mock("Home/Components/PolicyInfo", () => jest.fn(() => <div data-testid="policy-info-mock">PolicyInfo Component</div>));
jest.mock("Motor/DidYouKnowCard/DidYouKnowCard", () => jest.fn(() => <div data-testid="did-you-know-card-mock">DidYouKnowCard Component</div>));

describe("RegisterClaimRight Component", () => {
  const mockLanguageData = {
    policy_holder: "Policy Holder",
    start_date: "Start Date",
    expiry_date: "Expiry Date",
    sum_insured: "Sum Insured",
    deductible: "Deductible",
    property: "Property",
    sar: "SAR",
  };

  const mockViewPolicy = {
    policyLob: [
      {
        planCode: "Plan A",
        policyRisk: {},
      },
    ],
    policyBasic: {
      policyNumber: "123456",
      effectiveDate: "2023-01-01",
      expiryDate: "2023-12-31",
    },
    policyCustomer: [
      {
        customerNameArabic: "اسم العميل",
        customerNameEnglish: "Customer Name",
        primaryAddress: "123 Main St",
      },
    ],
  };

  const mockPolicyClaim = {
    viewPolicy: mockViewPolicy,
  };

  it("renders PolicyInfo and DidYouKnowCard components", () => {
    render(<RegisterClaimRight languageData={mockLanguageData} policyClaim={mockPolicyClaim} />);

    // Check if PolicyInfo is rendered
    expect(screen.getByTestId("policy-info-mock")).toBeInTheDocument();

    // Check if DidYouKnowCard is rendered
    expect(screen.getByTestId("did-you-know-card-mock")).toBeInTheDocument();

    // Check DidYouKnowCard content
    expect(screen.getByText("DidYouKnowCard Component")).toBeInTheDocument();
  });
});