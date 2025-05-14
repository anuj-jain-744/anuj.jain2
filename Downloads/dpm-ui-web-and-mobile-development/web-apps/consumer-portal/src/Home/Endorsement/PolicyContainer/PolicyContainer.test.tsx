import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PolicyContainer from "./index";
import { useApiCall } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";

// Mock dependencies
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

jest.mock("components/PolicyInfoLeft", () => ({
  PolicyInfoLeft: jest.fn(() => <div>PolicyInfoLeft Component</div>),
}));

jest.mock("components/PolicyInfoRight", () => ({
  PolicyInfoRight: jest.fn(() => <div>PolicyInfoRight Component</div>),
}));

jest.mock("components/OTPValidation/OtpWrapper", () => ({
  OTPWrapper: jest.fn(() => <div>OTPWrapper Component</div>),
}));

jest.mock("components/index", () => ({
  BackFooter: jest.fn(() => <div>BackFooter Component</div>),
}));

describe("PolicyContainer Component", () => {
  const mockNavigateTo = jest.fn();
  const mockLanguageData: LanguageData = {
    enter_otp_code: "Enter OTP Code",
    your_otp_will_expire: "Your OTP will expire",
    confirm_otp: "Confirm OTP",
    resend_otp: "Resend OTP",
    proceed_for_payment: "Proceed for Payment",
  };

  const mockPolicyData = {
    policyNo: "12345",
    mobileNo: "9876543210",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: null,
    });
  });

  it("renders without crashing", () => {
    render(
      <PolicyContainer
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        navigateTo={mockNavigateTo}
      />
    );

    expect(screen.getByText("PolicyInfoLeft Component")).toBeInTheDocument();
    expect(screen.getByText("BackFooter Component")).toBeInTheDocument();
  });

  it("calls view policy API on policyNo change", async () => {
    const mockMakeApiCall = jest.fn();
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockMakeApiCall,
      data: null,
    });

    render(
      <PolicyContainer
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        navigateTo={mockNavigateTo}
      />
    );

    await waitFor(() => {
      expect(mockMakeApiCall).toHaveBeenCalledWith({
        apiSource: "Portal",
        policyNo: "12345",
        endorsementNo: "",
        isLatestSnapshot: "Y",
      });
    });
  });

  it("updates policy details on API response", async () => {
    const mockData = { policyBasic: { effectiveDate: "2023-01-01" } };
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: jest.fn(),
      data: mockData,
    });

    render(
      <PolicyContainer
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        navigateTo={mockNavigateTo}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("PolicyInfoLeft Component")).toBeInTheDocument();
    });
  });

  it("handles payment button click", async () => {
    const mockRedisCall = jest.fn();
    (useApiCall as jest.Mock).mockReturnValueOnce({
      makeApiCall: mockRedisCall,
      data: null,
    });

    render(
      <PolicyContainer
        policyData={mockPolicyData}
        languageData={mockLanguageData}
        navigateTo={mockNavigateTo}
      />
    );

    const paymentButton = screen.getByText("BackFooter Component");
    fireEvent.click(paymentButton);

    await waitFor(() => {
      expect(mockRedisCall).toHaveBeenCalled();
    });
  });
});