import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactDetails from ".";
import { DataContext } from "../../../../../../DataContext";
import { callAPI } from "@dpm/shared-module";

const mockLanguageData = {
  placeholder_enter_iban_num: "Enter IBAN number",
  loading: "Loading...",
};
const defaultProps = {
  isBankTransferSelected: true,
  isDamageRepairSelected: false,
  validationData: { mobile: "0501234567" },
  claimsInfo: { ownerId: "123456789" },
  changeHandler: jest.fn(),
  mobilenumData: "0501234567",
  type: "",
};
jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
  sanitizeHtml: jest.fn((html) => html),
}));

describe("RegisterClaim", () => {
  beforeEach(() => {
    render(
      <DataContext.Provider value={mockLanguageData}>
        <ContactDetails {...defaultProps} />
      </DataContext.Provider>
    );
  });
  it("1. load component", () => {
    expect(screen.getByTestId("registerclaimcontact-test")).toBeInTheDocument();
  });

  it("2. check mobilenum displays in component", () => {
    expect(screen.getByTestId("registerclaimcontact-test")).toBeInTheDocument();
    expect(screen.getByTestId("mobilenum-testid")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("mobilenum-testid"), {
      target: { value: "0599475968" },
      name: "mobilenum",
    });
    waitFor(() => {
      expect(screen.getByText("0599475968")).toBeInTheDocument();
    });
  });
  it("3. check the mobilenum is invalid", () => {
    fireEvent.change(screen.getByTestId("mobilenum-testid"), {
      target: { value: "99475968" },
      name: "mobilenum",
    });
    waitFor(() => {
      expect(screen.getByText("Invalid Mobile Number")).toBeInTheDocument();
    });
  });
  it("4. check iban handler", () => {
    const ibanInput = screen.getByPlaceholderText(
      mockLanguageData.placeholder_enter_iban_num
    );
    expect(ibanInput).toBeInTheDocument();
    fireEvent.change(ibanInput, {
      target: { value: "SA1234567890123456789012", name: "IBan" },
    });
    waitFor(() => {
      expect(screen.getByText("SA1234567890123456789012")).toBeInTheDocument();
    });
  });
  it("5. check iban is invalidate", () => {
    const ibanInput = screen.getByPlaceholderText(
      mockLanguageData.placeholder_enter_iban_num
    );
    expect(ibanInput).toBeInTheDocument();
    fireEvent.change(ibanInput, {
      target: { value: "SA123456789012345678901234", name: "IBan" },
    });
    waitFor(() => {
      expect(
        screen.getByText("SA123456789012345678901234")
      ).toBeInTheDocument();
    });
  });
  it("6. check iban value is not start with SA", () => {
    const ibanInput = screen.getByPlaceholderText(
      mockLanguageData.placeholder_enter_iban_num
    );
    expect(ibanInput).toBeInTheDocument();
    fireEvent.change(ibanInput, {
      target: { value: "MA123456789012345678901234", name: "IBan" },
    });
    waitFor(() => {
      expect(
        screen.getByText("MA123456789012345678901234")
      ).toBeInTheDocument();
    });
  });
  it("7. handles IBAN validation and API call", async () => {
    // Mock the API call to return a valid response
    const mockAPIResponse = {
      message: "SUCCESS",
      data: { result: "MATCH" },
    };
    (callAPI as jest.Mock).mockResolvedValue(mockAPIResponse);
    const ibanInput = screen.getByPlaceholderText(
      mockLanguageData.placeholder_enter_iban_num
    );
    fireEvent.change(ibanInput, {
      target: { value: "SA1234567890123456789012", name: "IBan" },
    });
    waitFor(() => {
      expect(screen.getByText(/check_circle/i)).toBeInTheDocument();
    });
    // Test loading state
    expect(screen.getByText(mockLanguageData.loading)).toBeInTheDocument();
  });
  it("8. displays error message for invalid IBAN", async () => {
    // Mock the API call to return an error response
    const mockAPIErrorResponse = {
      message: "ERROR",
      data: {
        result: "Invalid IBAN",
      },
    };
    (callAPI as jest.Mock).mockResolvedValue(mockAPIErrorResponse);
    const ibanInput = screen.getByPlaceholderText(
      mockLanguageData.placeholder_enter_iban_num
    );
    fireEvent.change(ibanInput, {
      target: { value: "SA1234567890123456789012" },
    });
    waitFor(() => {
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });
  });
  it("9. check email handler", () => {
    const emailInput = screen.getByTestId("email-testid");
    expect(emailInput).toBeInTheDocument();
    fireEvent.change(emailInput, {
      target: { value: "abc@gmail.com", name: "emailId" },
    });
    waitFor(() => {
      expect(screen.getByText("abc@gmail.com")).toBeInTheDocument();
    });
  });
  it("10. check email is invalidate", () => {
    const emailInput = screen.getByTestId("email-testid");
    expect(emailInput).toBeInTheDocument();
    fireEvent.change(emailInput, {
      target: { value: "abcgmailcom", name: "emailId" },
    });
    waitFor(() => {
      expect(screen.getByText("Invalid Email ID")).toBeInTheDocument();
    });
  });
});