import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import IbanInputField from "./index";
import { LanguageData } from "types/languageData";

// Mock the ThemeTextbox component
jest.mock('components/ThemeTextbox/ThemeTextbox', () => (props: any) => (
  <div>
    <input
      data-testid={props.name || 'textbox'}
      value={props.value}
      onChange={props.onChangehandler}
      onBlur={props.handleOnBlur}
    />
    {props.children}
  </div>
));

// Mock the IBAN validation functions
jest.mock('@dpm/shared-module', () => ({
  validateIBAN: jest.fn().mockReturnValue(true),
  validateIbanNonSA: jest.fn().mockReturnValue(true),
}));

// Mock hooks and components
jest.mock("Motor/Policy-services/PoliciesCancellation/hook/useValidateIban", () => ({
  useValidateIban: () => ({
    fetchValidateIban: jest.fn(),
    validationData: {
      data: {
        result: "MATCH",
        bank: { englishName: "Mock Bank" },
      },
    },
    isLoading: false,
    error: null,
  }),
}));


// Mock shared validators
jest.mock("@dpm/shared-module", () => ({
  validateIBAN: jest.fn(() => true),
  validateIbanNonSA: jest.fn(() => true),
}));

describe("IbanInputField Component", () => {
  const languageData: LanguageData = {
    iban_no: "IBAN Number",
    please_provide_valid_iban: "Please provide valid IBAN",
    re_enter_iban: "Re-enter IBAN",
    iban_numbers_do_not_match: "IBAN numbers do not match",
    bank_name: "Bank Name",
    please_provide_valid_bank: "Please provide valid bank name",
    iban_invalid_non_sa: "IBAN is invalid for non-SA",
  };

  const mockGetBankDetails = jest.fn();
  const mockCheckDisabled = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders IBAN input field and validates SA IBAN", async () => {
    const {rerender}=render(
      <IbanInputField
        languageData={languageData}
        userId="123456"
        getBankDetails={mockGetBankDetails}
        checkDisabled={mockCheckDisabled}
      />
    );

    const ibanInput = screen.getByTestId("iban");
    fireEvent.change(ibanInput, { target: { value: "SA1234567890123456789012" } });
    rerender(<IbanInputField
        languageData={languageData}
        userId="123456"
        getBankDetails={mockGetBankDetails}
        checkDisabled={mockCheckDisabled}
      />)

    await waitFor(() => {
      expect(mockCheckDisabled).toHaveBeenCalledWith(false);
      expect(mockGetBankDetails).toHaveBeenCalledWith(
        { bankName: "Mock Bank" },
        "SA1234567890123456789012"
      );
    });
  });
  test("renders IBAN input length less than 24", async () => {
    render(
      <IbanInputField
        languageData={languageData}
        userId="123456"
        getBankDetails={mockGetBankDetails}
        checkDisabled={mockCheckDisabled}
      />
    );

    const ibanInput = screen.getByTestId("iban");
    fireEvent.change(ibanInput, { target: { value: "SA1234567890123456789" } });

    await waitFor(() => {
      expect(mockCheckDisabled).toHaveBeenCalledWith(false);
      expect(mockGetBankDetails).toHaveBeenCalledWith(
        { bankName: "" },
        ""
      );
    });
  });

  test("validates non-SA IBAN and checks re-enter input mismatch", async () => {
    render(
      <IbanInputField
        languageData={languageData}
        userId="123456"
        getBankDetails={mockGetBankDetails}
        checkDisabled={mockCheckDisabled}
      />
    );

    const ibanInput = screen.getByTestId("iban");
    fireEvent.change(ibanInput, { target: { value: "DE12345678901234567890" } });

    const reIbanInput = screen.getByTestId("reEnterIban");
    fireEvent.change(reIbanInput, { target: { value: "DE12345678901234500000" } });

    await waitFor(() => {
      expect(mockCheckDisabled).toHaveBeenCalledWith(true);
    });
  });

  test("displays error when bank name is not provided", async () => {
    render(
      <IbanInputField
        languageData={languageData}
        userId="123456"
        getBankDetails={mockGetBankDetails}
        checkDisabled={mockCheckDisabled}
      />
    );

    const ibanInput = screen.getByTestId("iban");
    fireEvent.change(ibanInput, { target: { value: "DE12345678901234567890" } });

    const reIbanInput = screen.getByTestId("reEnterIban");
    fireEvent.change(reIbanInput, { target: { value: "DE12345678901234567890" } });

    const bankInput = screen.getByTestId("bankName");
    fireEvent.change(bankInput, { target: { value: "Axis" } });
    fireEvent.blur(bankInput);
    fireEvent.change(bankInput, { target: { value: "" } });
    fireEvent.blur(bankInput);
    await waitFor(() => {
      expect(screen.getByText(languageData.please_provide_valid_bank)).toBeInTheDocument();
    });
  });
  it('enter non SA iban and re-enter and enter bank name', () => {
    render(
        <IbanInputField
        languageData={languageData}
        userId="123456"
        getBankDetails={mockGetBankDetails}
        checkDisabled={mockCheckDisabled}
      />
    );

    const iban = 'GB29NWBK60161331926819';
    const ibanInput = screen.getByTestId('iban');
    fireEvent.change(ibanInput, { target: { value: iban } });
    const reEnterIbanInput = screen.getByTestId('reEnterIban');
    fireEvent.change(ibanInput, { target: { value: iban } });
    fireEvent.change(reEnterIbanInput, { target: { value: iban } });

    const bankInput = screen.getByTestId('bankName');
    fireEvent.change(bankInput, { target: { value: "Axis Bank" } });
    expect(bankInput).toHaveValue('Axis Bank');
    expect(ibanInput).toHaveValue(iban);
    expect(reEnterIbanInput).toHaveValue(iban);
  });

  test("does not allow special characters in IBAN", () => {
    render(
      <IbanInputField
        languageData={languageData}
        userId="123456"
        getBankDetails={mockGetBankDetails}
        checkDisabled={mockCheckDisabled}
      />
    );

    const ibanInput = screen.getByTestId("iban");
    fireEvent.change(ibanInput, { target: { value: "SA!@#$%^" } });

    expect(ibanInput).toHaveValue("");
  });
});
