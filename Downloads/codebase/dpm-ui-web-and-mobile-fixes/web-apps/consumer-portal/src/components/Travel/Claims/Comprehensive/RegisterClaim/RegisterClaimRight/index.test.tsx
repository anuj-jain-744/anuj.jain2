import React from "react";
import { render, screen } from "@testing-library/react";
import RegisterClaimRight from "./index";

jest.mock("Motor/Policy-services/PoliciesCancellation/sharedComponent/PolicyCard", () => (props: any) => (
  <div data-testid="PolicyCard">
    PolicyCard: {props.policyNumber} - {props.coverageName}
  </div>
));

jest.mock("./ClaimRegistrationDetails", () => (props: any) => (
  <div data-testid="ClaimRegistrationDetails" />
));

jest.mock("./NoteRight", () => (props: any) => (
  <div data-testid="NoteRight" />
));

jest.mock("utils/policyDetails", () => ({
  getPlanName: jest.fn(() => "Mock Coverage Name"),
}));

import { getPlanName } from "utils/policyDetails";

const defaultLangData = {
  consumer: {
    start_date: "Start Date",
    expiry_date: "Expiry Date",
    policy_no: "Policy Number",
    insured_declared_value_idv: "IDV",
    national_id: "National ID",
    policy_holder: "Policy Holder",
  },
  product: {},
};

const defaultPolicyData = {
  policyDetails: {
    startDate: "2023-01-01",
    expiryDate: "2024-01-01",
    prodCode: "P001",
    insurerName: "Mock Insurer",
    nationalID: "NID123",
  },
};

describe("RegisterClaimRight", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders PolicyCard if policyNumber and startDate present", () => {
    render(
      <RegisterClaimRight
        policyNumber="POL123"
        langData={defaultLangData}
        policyData={defaultPolicyData}
      />
    );
    expect(screen.getByTestId("PolicyCard")).toBeInTheDocument();
    expect(screen.getByTestId("PolicyCard")).toHaveTextContent("POL123");
    expect(getPlanName).toHaveBeenCalledWith(defaultPolicyData);
  });

  it("does not render PolicyCard if policyNumber is empty", () => {
    render(
      <RegisterClaimRight
        policyNumber=""
        langData={defaultLangData}
        policyData={defaultPolicyData}
      />
    );
    expect(screen.queryByTestId("PolicyCard")).not.toBeInTheDocument();
  });

  it("does not render PolicyCard if startDate is missing", () => {
    const policyDataNoStart = {
      policyDetails: {
        ...defaultPolicyData.policyDetails,
        startDate: undefined,
      },
    };
    render(
      <RegisterClaimRight
        policyNumber="POL123"
        langData={defaultLangData}
        policyData={policyDataNoStart}
      />
    );
    expect(screen.queryByTestId("PolicyCard")).not.toBeInTheDocument();
  });

  it("always renders ClaimRegistrationDetails and NoteRight", () => {
    render(
      <RegisterClaimRight
        policyNumber="POL123"
        langData={defaultLangData}
        policyData={defaultPolicyData}
      />
    );
    expect(screen.getByTestId("ClaimRegistrationDetails")).toBeInTheDocument();
    expect(screen.getByTestId("NoteRight")).toBeInTheDocument();
  });
});
