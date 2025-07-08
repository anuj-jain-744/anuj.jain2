import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterClaimLeft from "./index";

jest.mock("../../Components/RegisterClaimModalDialog", () => (props: any) => (
  <div data-testid="RegisterClaimModalDialog">
    Modal open: {props.showRegModal ? "true" : "false"}
  </div>
));
jest.mock("./SelectPolicyCard/SelectPolicyCard", () => (props: any) => (
  <div data-testid="SelectPolicyCard">
    SelectedPolicy: {props.selectedPolicy}
  </div>
));
jest.mock("components/TravelerEstimate", () => (props: any) => (
  <div data-testid="TravelerEstimate">Estimate Component</div>
));
jest.mock("Motor/Claims/Comprehensive/RegisterClaim/RegisterClaimLeft/ContactDetails/index.tsx", () => (props: any) => (
  <div data-testid="ContactDetails" />
));
jest.mock("../../../../../../claims/register/compensation/TermsAndCon", () => (props: any) => (
  <div data-testid="TermsAndCon" />
));

jest.mock("utils/quoteAndBuyTravel", () => ({
  toCamelCase: (str: string) => str.toLowerCase(),
}));

const defaultProps = {
  contactDetchangeHandler: jest.fn(),
  validationData: {},
  mobilenumData: {},
  langData: {
    consumer: { someKey: "consumer data" },
    product: {
      register_claim_description: "Hello <<Name>>!",
      claimant_details: "Claimant Details",
    },
  },
  profileData: { userName: "JOHN DOE" },
  policies: [{ policyNo: "P1" }, { policyNo: "P2" }],
  policyNumber: "P1",
  handlePolicySelect: jest.fn(),
  travelerNames: ["Alice", "Bob"],
  policyData: {},
  handleLossApi: jest.fn(),
  dateOfLoss: "2023-07-01",
  handleDateOfLoss: jest.fn(),
  place: "Paris",
  handlePlace: jest.fn(),
  estimations: {},
  handleEstimations: jest.fn(),
  isValidEstimation: true,
  handleIbanDetails: jest.fn(),
  isTermsChecked: false,
  handleTerms: jest.fn(),
  coverageInfoList: {},
  showCards: true,
};

describe("RegisterClaimLeft", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders top information text with replaced user name", () => {
    render(<RegisterClaimLeft {...defaultProps} />);
    expect(screen.getByText("Hello john doe!")).toBeInTheDocument();
  });

  it("opens registration modal on mount", () => {
    render(<RegisterClaimLeft {...defaultProps} />);
    expect(screen.getByTestId("RegisterClaimModalDialog")).toHaveTextContent("Modal open: true");
  });

  it("renders SelectPolicyCard if multiple policies and showCards is true", () => {
    render(<RegisterClaimLeft {...defaultProps} />);
    expect(screen.getByTestId("SelectPolicyCard")).toBeInTheDocument();
    expect(screen.queryByTestId("TravelerEstimate")).not.toBeInTheDocument();
  });

  it("renders TravelerEstimate and contact details when showCards is false and policyNumber set", () => {
    render(<RegisterClaimLeft {...defaultProps} showCards={false} />);
    expect(screen.getByTestId("TravelerEstimate")).toBeInTheDocument();
    expect(screen.getByTestId("ContactDetails")).toBeInTheDocument();
    expect(screen.getByTestId("TermsAndCon")).toBeInTheDocument();
  });

  it("does not render SelectPolicyCard or TravelerEstimate if no policyNumber", () => {
    render(<RegisterClaimLeft {...defaultProps} policyNumber="" showCards={false} />);
    expect(screen.queryByTestId("SelectPolicyCard")).not.toBeInTheDocument();
    expect(screen.queryByTestId("TravelerEstimate")).not.toBeInTheDocument();
  });

  it("renders claimant details section only if dateOfLoss and place are set", () => {
    const { rerender } = render(<RegisterClaimLeft {...defaultProps} showCards={false} />);
    expect(screen.getByText("Claimant Details")).toBeInTheDocument();

    rerender(<RegisterClaimLeft {...defaultProps} dateOfLoss="" place="" showCards={false} />);
    expect(screen.queryByText("Claimant Details")).not.toBeInTheDocument();
  });

  it("calls handlePolicySelect on policy select", () => {
    render(<RegisterClaimLeft {...defaultProps} />);
    fireEvent.click(screen.getByText("Hello john doe!"));
    expect(screen.getByTestId("RegisterClaimModalDialog")).toBeInTheDocument();
  });

  it("shows modal when clicking info text", () => {
    render(<RegisterClaimLeft {...defaultProps} />);
    const infoText = screen.getByText("Hello john doe!");
    fireEvent.click(infoText);
    expect(screen.getByTestId("RegisterClaimModalDialog")).toBeInTheDocument();
  });
});
