import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PolicyInfo from "./index";

jest.mock("@dpm/shared-module", () => ({
  useCommonContext: () => ({
    currentLanguage: "en",
  }),
}));

jest.mock("utils/quoteAndBuy", () => ({
  displayHouseAddress: jest.fn(() => "123 Mock St, MockCity"),
}));

jest.mock("utils/formatDate", () => ({
  formatDate: jest.fn((date) => `formatted-${date}`),
}));

jest.mock("utils/policyDetails", () => ({
  getSumInsuredDeductible: jest.fn(() => ({ sumInsured: 1000 })),
}));

jest.mock("@app-shell/utils/common", () => ({
  getAmountWithIcon: jest.fn((amount) => `₹${amount}`),
}));

jest.mock("assets/Home/home-icon.svg", () => "home-icon-mock");

jest.mock("@mui/icons-material/ExpandMore", () => () => <span>ExpandMoreIcon</span>);
jest.mock("@mui/icons-material/ExpandLess", () => () => <span>ExpandLessIcon</span>);

describe("PolicyInfo component", () => {
  const languageData = {
    policy_no: "Policy Number",
    property: "Property Label",
    sum_insured: "Sum Insured Label",
    policy_period: "Policy Period Label",
  };

  const viewPolicy = {
    policyLob: [
      {
        planCode: "Plan123",
        policyRisk: [{}],
      },
    ],
    policyBasic: {
      policyNumber: "PN123456",
      effectiveDate: "2024-01-01",
      expiryDate: "2024-12-31",
    },
  };

  it("renders and displays policy info correctly when open", () => {
    render(<PolicyInfo languageData={languageData} viewPolicy={viewPolicy} />);

    expect(screen.getByText(languageData.policy_no)).toBeInTheDocument();
    expect(screen.getByText(viewPolicy.policyBasic.policyNumber)).toBeInTheDocument();

    expect(screen.getByText("ExpandLessIcon")).toBeInTheDocument();

    expect(screen.getByText(viewPolicy.policyLob[0].planCode)).toBeInTheDocument();

    expect(screen.getByText(languageData.property)).toBeInTheDocument();
    expect(screen.getByText("123 Mock St, MockCity")).toBeInTheDocument();

    expect(screen.getByText(languageData.sum_insured)).toBeInTheDocument();
    expect(screen.getByText("₹1000")).toBeInTheDocument();

    expect(screen.getByText(languageData.policy_period)).toBeInTheDocument();
    expect(screen.getByText("formatted-2024-01-01 - formatted-2024-12-31")).toBeInTheDocument();
  });

  it("toggles accordion on policy number click", () => {
    render(<PolicyInfo languageData={languageData} viewPolicy={viewPolicy} />);

    const policyNumberElement = screen.getByText(viewPolicy.policyBasic.policyNumber);
    expect(screen.getByText("ExpandLessIcon")).toBeInTheDocument();

    fireEvent.click(policyNumberElement);
    expect(screen.getByText("ExpandMoreIcon")).toBeInTheDocument();
    expect(screen.queryByText("123 Mock St, MockCity")).not.toBeInTheDocument();
    expect(screen.queryByText("₹1000")).not.toBeInTheDocument();

    fireEvent.click(policyNumberElement);
    expect(screen.getByText("ExpandLessIcon")).toBeInTheDocument();
    expect(screen.getByText("123 Mock St, MockCity")).toBeInTheDocument();
  });

  it("renders without crashing when languageData is null", () => {
    render(<PolicyInfo languageData={null} viewPolicy={viewPolicy} />);
    expect(screen.getByText(viewPolicy.policyBasic.policyNumber)).toBeInTheDocument();
  });
});
