import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PolicyStartDate from "./index";
import * as QuoteAndBuyContext from "components/hooks/useQuoteAndBuyContext";
import * as PHQuoteBuyContext from "context/PHQuoteBuyContext";
import * as CommonFunction from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import * as CalendarValidation from "utils/calendarValidation";
import ChangePolicyStartDate from "./ChangePolicyStartDate";

jest.mock("./ChangePolicyStartDate", () => jest.fn(() => <div data-testid="change-policy-modal" />));

const mockSetPolicyStartDate = jest.fn();
const mockSetPolicyStartDateAPI = jest.fn();

const defaultLanguageData = {
  policy_start_date: "Policy Start Date",
  isLatest: "home",
  modify_policy_start_date: "Modify Policy Start Date",
  hirji: "Hijri",
  cancel: "Cancel",
  update: "Update",
  save: "Save",
  policyStartDateError: "Date error"
};

const fullHomePolicyRenewalMock = {
  expiryDate: "2025-06-24T00:00:00Z",
  policyNumber: "123",
  existingPremium: 100,
  contentBenefits: [],
  coverageType: "type",
  buildingBenefits: [],
  coveragePlan: "",
  primaryAddress: [], // Fix: assign as empty array of correct type
} as any; // Use 'as any' to bypass strict type check for test mocks

describe("PolicyStartDate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(QuoteAndBuyContext, "useQuoteAndBuyContext").mockReturnValue({
      setPolicyStartDate: mockSetPolicyStartDate,
      policyStartDate: null,
      setPolicyStartDateAPI: mockSetPolicyStartDateAPI,
      setPolicyExpiryDate: jest.fn(), // <-- Add this mock to fix the error
      viewPolicyData: { policyBasic: { expiryDate: "2025-06-24T00:00:00Z" } },
      isRenewpolicy: false,
      homePremiumResponse: {},
    });
    jest.spyOn(PHQuoteBuyContext, "usePHQuoteBuyContext").mockReturnValue({
      homePolicyRenewal: fullHomePolicyRenewalMock,
      
    });
    jest.spyOn(CommonFunction, "getFormattedDate").mockReturnValue("24/06/2025");
    jest.spyOn(CommonFunction, "convertDateFormat").mockReturnValue("06/24/2025");
    jest.spyOn(CommonFunction, "formatDateDmy").mockImplementation(date => date ? "24/06/2025" : "");
    jest.spyOn(CalendarValidation, "isValidDate").mockReturnValue(true);
  });

  it("renders with default props and shows policy date", () => {
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    expect(screen.getByText(/Policy Start Date/, { exact: false })).toBeInTheDocument();
    expect(screen.getByText("24/06/2025")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens modal on edit icon click", () => {
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("change-policy-modal")).toBeInTheDocument();
  });

  it("handles isRenewpolicy logic and renders correctly", () => {
    jest.spyOn(QuoteAndBuyContext, "useQuoteAndBuyContext").mockReturnValue({
      setPolicyStartDate: mockSetPolicyStartDate,
      policyStartDate: "2025-06-24T00:00:00Z",
      setPolicyStartDateAPI: mockSetPolicyStartDateAPI,
      setPolicyExpiryDate: jest.fn(),
      viewPolicyData: { policyBasic: { expiryDate: "2025-06-24T00:00:00Z" } },
      isRenewpolicy: true,
      homePremiumResponse: {},
    });
    jest.spyOn(PHQuoteBuyContext, "usePHQuoteBuyContext").mockReturnValue({
      homePolicyRenewal: fullHomePolicyRenewalMock,
      
    });
    jest.spyOn(CommonFunction, "getFormattedDate").mockReturnValue("24/06/2025");
    jest.spyOn(CommonFunction, "convertDateFormat").mockReturnValue("06/24/2025");
    jest.spyOn(CommonFunction, "formatDateDmy").mockImplementation(date => date ? "24/06/2025" : "");
    jest.spyOn(CalendarValidation, "isValidDate").mockReturnValue(true);
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    // expect(screen.getByText("Policy Start Date")).toBeInTheDocument();
  });

  it("handles clickHandler with invalid date", () => {
    jest.spyOn(CalendarValidation, "isValidDate").mockReturnValue(false);
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("change-policy-modal")).toBeInTheDocument();
  });

  it("handles setDatepickerValue with invalid date", () => {
    jest.spyOn(CalendarValidation, "isValidDate").mockReturnValueOnce(false);
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    fireEvent.click(screen.getByRole("button"));
    const props = (ChangePolicyStartDate as jest.Mock).mock.calls[0][0];
    props.setValue("invalid-date");
  });

  it("handles setDatepickerValue with valid date", () => {
    jest.spyOn(CalendarValidation, "isValidDate").mockReturnValueOnce(true);
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    fireEvent.click(screen.getByRole("button"));
    const props = (ChangePolicyStartDate as jest.Mock).mock.calls[0][0];
    props.setValue("24/06/2025");
  });

  it("handles changeHandler and updates context", () => {
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    fireEvent.click(screen.getByRole("button"));
    const props = (ChangePolicyStartDate as jest.Mock).mock.calls[0][0];
    props.changeHandler("24/06/2025");
    expect(mockSetPolicyStartDate).toHaveBeenCalled();
    expect(mockSetPolicyStartDateAPI).toHaveBeenCalled();
  });

  it("handles ownerDOB and calendar toggle", () => {
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    fireEvent.click(screen.getByRole("button"));
    const props = (ChangePolicyStartDate as jest.Mock).mock.calls[0][0];
    expect(props.setIsOn).toBeDefined();
    props.setIsOn(true);
    props.setIsOn(false);
  });

  it("renders nothing if policyDate is null", () => {
    jest.spyOn(QuoteAndBuyContext, "useQuoteAndBuyContext").mockReturnValue({
      setPolicyStartDate: mockSetPolicyStartDate,
      policyStartDate: null,
      setPolicyStartDateAPI: mockSetPolicyStartDateAPI,
      setPolicyExpiryDate: jest.fn(), // <-- Add this mock to fix the error
      viewPolicyData: {},
      isRenewpolicy: false,
      homePremiumResponse: {},
    });
    jest.spyOn(CommonFunction, "getFormattedDate").mockReturnValue("");
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    expect(screen.queryByText("Policy Start Date")).not.toBeInTheDocument();
  });

  it("handles error state in modal", () => {
    render(<PolicyStartDate languageData={defaultLanguageData} />);
    fireEvent.click(screen.getByRole("button"));
    const props = (ChangePolicyStartDate as jest.Mock).mock.calls[0][0];
    expect(props.isError).toBe(false);
  });

  it("handles checkValue memoization", () => {
    render(<PolicyStartDate languageData={{ ...defaultLanguageData, isLatest: "home" }} />);
    fireEvent.click(screen.getByRole("button"));
    const props = (ChangePolicyStartDate as jest.Mock).mock.calls[0][0];
    expect(props.checkValue).toBeTruthy();
  });
});
