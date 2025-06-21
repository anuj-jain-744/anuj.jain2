import React from "react";
import { render } from "@testing-library/react";
import CustomCardRight from "./index";
import { PolicyDetails } from "types/policyDetails";
import { LanguageData } from "types/languageData";

jest.mock("Motor/Policy-services/PoliciesCancellation/sharedComponent/PolicyCard", () => ({
  __esModule: true,
  default: ({ policyNumber, idvValue }: any) => (
    <div data-testid="PolicyCard">
      PolicyNumber: {policyNumber}, IDV: {idvValue}
    </div>
  ),
}));

jest.mock("Motor/DidYouKnowCard/DidYouKnowCard", () => ({
  __esModule: true,
  default: ({ did_you_know_content, did_you_know_text }: any) => (
    <div data-testid="DidYouKnowCard">
      {did_you_know_text} - {did_you_know_content}
    </div>
  ),
}));

jest.mock("utils/getPriceFormat", () => ({
  getPriceFormat: jest.fn((price: number) => `Formatted-${price}`),
}));

const mockPolicyDetails: PolicyDetails = {
  policyNo: "ABC123",
  startDate: "2023-01-01",
  expiryDate: "2024-01-01",
  idv: "50000",
  coverageName: "Comprehensive",
  prodCode: "PC001",
};

const mockLanguageData: LanguageData = {
  sar: "SAR",
  not_available: "Not Available",
  start_date: "Start Date",
  expiry_date: "Expiry Date",
  policy_no: "Policy Number",
  sum_insured: "Sum Insured",
  did_you_know_content: "Some interesting fact.",
  did_you_know_text: "Did you know?",
};

describe("CustomCardRight", () => {
  it("renders PolicyCard and DidYouKnowCard with all data", () => {
    const { getByTestId } = render(
      <CustomCardRight
        policyDetails={mockPolicyDetails}
        languageData={mockLanguageData}
      />
    );

    expect(getByTestId("PolicyCard")).toHaveTextContent("ABC123");
    expect(getByTestId("PolicyCard")).toHaveTextContent("SAR Formatted-50000");
    expect(getByTestId("DidYouKnowCard")).toHaveTextContent(
      "Did you know? - Some interesting fact."
    );
  });

  it("renders fallback when idv is missing", () => {
    const policyWithoutIdv = { ...mockPolicyDetails, idv: undefined };

    const { getByTestId } = render(
      <CustomCardRight
        policyDetails={policyWithoutIdv}
        languageData={mockLanguageData}
      />
    );

    expect(getByTestId("PolicyCard")).toHaveTextContent("Not Available");
  });

  it("renders fallback when languageData is undefined", () => {
    const { getByTestId } = render(
      <CustomCardRight policyDetails={mockPolicyDetails} />
    );

    expect(getByTestId("PolicyCard")).toHaveTextContent("Formatted-50000");
    expect(getByTestId("DidYouKnowCard")).toHaveTextContent("-");
  });
});
