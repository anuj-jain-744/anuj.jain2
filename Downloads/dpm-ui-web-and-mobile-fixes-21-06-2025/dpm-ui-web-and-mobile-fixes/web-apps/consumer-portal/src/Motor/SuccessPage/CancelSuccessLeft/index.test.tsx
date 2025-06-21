import React from "react";
import { render, screen } from "@testing-library/react";
import CancelSuccessLeft from "./index";
import { useApiCall } from "@dpm/shared-module";
import { PolicyDetailsObj } from "types/policyDetails";
import { LanguageData } from "types/languageData";
import userEvent from "@testing-library/user-event";

// Mock the useApiCall hook
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  capitalizeNameFirstLetter: jest.fn((name: string) => name.charAt(0).toUpperCase() + name.slice(1)),
}));
jest.mock('@app-shell/utils/common', () => ({
    getAmountWithIcon: jest.fn(amount => `${amount.toFixed(2)}`),
  }));
  jest.mock("utils/formatDate", () => ({
    formatDate: jest.fn(() => "09/06/2025"), // Mocked formatted date
  }));

  // Mock console.error to verify error logging
  const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
// Mock props
const mockPolicyData: PolicyDetailsObj = {
  policyNumber: "123456789",
  refundValue: 100.0,
  vehicleDetails: {
    make: "Toyota",
    model: "Corolla",
    plateNumber: "ABC123",
    plateNoText1: "A",
    plateNoText2: "BC",
    plateNoText3: "123",
    vehicleMakeTextEn: "Toyota",
    vehicleMakeId: "1",
  },
};

const mockLanguageData: LanguageData = {
  policy_number: "Policy Number",
  cancellation_date: "Cancellation Date",
  policy_status: "Policy Status",
  refund_amount: "Refund Amount",
  download_document: "Download Document",
  note: "Note",
  refund_process: "The refund process will take 5-7 business days.",
};

describe("CancelSuccessLeft Component", () => {
  beforeEach(() => {
    // Mock the API calls
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      data: { config: [mockLanguageData] },
      error: null,
    });
  });

  it("renders the component with correct data", () => {
    render(
      <CancelSuccessLeft
        isCancelSuccess={true}
        policyData={mockPolicyData}
        handleDownloadPolicy={jest.fn()}
      />
    );
  
    // Check for policy number
    expect(screen.getByText(mockLanguageData.policy_number)).toBeInTheDocument();
    expect(screen.getByText(mockPolicyData.policyNumber)).toBeInTheDocument();
  
    // Check for cancellation date
    expect(screen.getByText(mockLanguageData.cancellation_date)).toBeInTheDocument();
    expect(screen.getByText("09/06/2025")).toBeInTheDocument(); // Assert the mocked formatted date
  
    // Check for policy status
    expect(screen.getByText(mockLanguageData.policy_status)).toBeInTheDocument();
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  
    // Check for refund amount
    expect(screen.getByText(mockLanguageData.refund_amount)).toBeInTheDocument();
    expect(screen.getByText("100.00")).toBeInTheDocument();
  
    // Check for download document link
    expect(screen.getByText(mockLanguageData.download_document)).toBeInTheDocument();
  });

  it("calls handleDownloadPolicy when download link is clicked", async () => {
    const handleDownloadPolicy = jest.fn();
    render(
      <CancelSuccessLeft
        isCancelSuccess={true}
        policyData={mockPolicyData}
        handleDownloadPolicy={handleDownloadPolicy}
      />
    );

    const downloadLink = screen.getByText(mockLanguageData.download_document);
    await userEvent.click(downloadLink);

    expect(handleDownloadPolicy).toHaveBeenCalledTimes(1);
  });
});
