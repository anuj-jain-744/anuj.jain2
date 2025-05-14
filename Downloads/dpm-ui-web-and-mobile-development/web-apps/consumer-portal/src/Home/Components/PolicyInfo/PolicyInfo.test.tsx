import React from "react";
import { render, screen } from "@testing-library/react";
import PolicyInfo from "./index";
import { useCommonContext } from "@dpm/shared-module";
import { formatDate } from "utils/formatDate";
import { displayHouseAddress } from "utils/quoteAndBuy";
import { getSumInsuredDeductible } from "utils/policyDetails";

jest.mock("@dpm/shared-module", () => ({
  useCommonContext: jest.fn(),
}));

jest.mock("utils/formatDate", () => ({
  formatDate: jest.fn(),
}));

jest.mock("utils/quoteAndBuy", () => ({
  displayHouseAddress: jest.fn(),
}));

jest.mock("utils/policyDetails", () => ({
  getSumInsuredDeductible: jest.fn(),
}));

describe("PolicyInfo Component", () => {
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

  const mockSumInsuredDeductible = {
    sumInsured: "100,000",
    minDeductible: "1,000",
  };

  beforeEach(() => {
    (useCommonContext as jest.Mock).mockReturnValue({
      currentLanguage: "en",
    });

    (formatDate as jest.Mock).mockImplementation((date) => date);
    (displayHouseAddress as jest.Mock).mockReturnValue("123 Main St");
    (getSumInsuredDeductible as jest.Mock).mockReturnValue(mockSumInsuredDeductible);
  });

  it("renders policy information correctly", () => {
    render(<PolicyInfo languageData={mockLanguageData} viewPolicy={mockViewPolicy} />);

    // Check policy header
    expect(screen.getByText("Plan A")).toBeInTheDocument();
    expect(screen.getByText("123456")).toBeInTheDocument();

    // Check policy holder name
    expect(screen.getByText("Policy Holder")).toBeInTheDocument();
    expect(screen.getByText("Customer Name")).toBeInTheDocument();

    // Check start and expiry dates
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("Expiry Date")).toBeInTheDocument();
    expect(screen.getByText("2023-12-31")).toBeInTheDocument();

    // Check sum insured and deductible
    expect(screen.getByText("Sum Insured")).toBeInTheDocument();
    expect(screen.getByText("100,000")).toBeInTheDocument();
    expect(screen.getByText("Deductible")).toBeInTheDocument();
    expect(screen.getByText("SAR 1,000")).toBeInTheDocument();

    // Check property address
    expect(screen.getByText("Property")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
  });
});