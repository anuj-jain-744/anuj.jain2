import React from "react";
import { render, screen } from "@testing-library/react";
import RenewalPolicy from "./index";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { formatDate } from "utils/formatDate";

// Mock the context
jest.mock("context/PHQuoteBuyContext", () => ({
  usePHQuoteBuyContext: jest.fn(),
}));

// Mock the formatDate utility
jest.mock("utils/formatDate", () => ({
  formatDate: jest.fn(),
}));

describe("RenewalPolicy Component", () => {
  const mockLanguageData = {
    existing_policy_no: "Policy Number",
    policy_expiring_on: "Policy Expiring On",
    coveragePlan1: [
      {
        benefits: ["Benefit 1", "Benefit 2"],
        coveragevalue1: ["Value 1", "Value 2"],
      },
    ],
  };

  const mockHomePolicyRenewal = {
    coverageType: "Coverage Value 1",
    coveragePlan: "coveragePlan1",
    policyNumber: "123456789",
    expiryDate: "2023-12-31",
  };

  beforeEach(() => {
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      homePolicyRenewal: mockHomePolicyRenewal,
    });
    (formatDate as jest.Mock).mockReturnValue("December 31, 2023");
  });

  it("renders policy number and expiry date correctly", () => {
    render(<RenewalPolicy languageData={mockLanguageData} />);

    expect(screen.getByText("Policy Number")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
    expect(screen.getByText("Policy Expiring On December 31, 2023")).toBeInTheDocument();
  });

  it("renders benefits when isReviewPage is false", () => {
    render(<RenewalPolicy languageData={mockLanguageData} isReviewPage={false} />);

    expect(screen.getByText("Benefit 1")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
    expect(screen.getByText("Benefit 2")).toBeInTheDocument();
    expect(screen.getByText("Value 2")).toBeInTheDocument();
  });

  it("does not render benefits when isReviewPage is true", () => {
    render(<RenewalPolicy languageData={mockLanguageData} isReviewPage={true} />);

    expect(screen.queryByText("Benefit 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Value 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Benefit 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Value 2")).not.toBeInTheDocument();
  });
});