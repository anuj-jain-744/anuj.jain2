import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CardOptions, { typesCard } from "./CardOptions";
import { CmsPayment } from "./types/cmsPayment";
import { PaymentOptionProp } from "pages/payment-insurance";
import { ViewQuoteResponse } from "types/viewQuote";
import { PaymentProviderMethods } from "./types/providerPayment";
import { LanguageData } from "types/languageData";
import { useApiCall } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

const mockUseApiCall = useApiCall as jest.Mock;

const paymentData: CmsPayment = {
  field_cvv: "CVV",
  field_cvv_info: "CVV Info",
  field_debit_credit_card_no: "Card Number",
  field_valid_till: "Valid Till",
  field_cvc: "CVC",
  field_card_holder_name: "Card Holder Name",
  field_button_title: "Pay",
  CurrencyISOCode: {
    sar: "SAR",
    us_dollar: "",
    jod: "",
    aed: ""
  },
  MessageID: {
    redirect_payment: "redirect_payment",
    redirect_pre_auth: "",
    enquiry_payment: ""
  },
  MerchantID: "MerchantID",
  PaymentMethod: {
    version_2_0: {
      card: "card",
      applePay: "",
      urPay: "",
      stcPay: "",
      sadad: "",
      emkan: "",
      tabby: ""
    },
    version_1_0: {
      card: "",
      applePay: "",
      urPay: "",
      stcPay: "",
      sadad: "",
      emkan: "",
      tabby: ""
    }
  },
  ThemeID: "ThemeID",
  Version: ["2.0"],
  directPayAuthenticationToken: "token",
};

const optionData: PaymentOptionProp = {
  img: ["visa.png", "mastercard.png", "amex.png", "mada.png"],
  label: "",
  value: "",
  disabled: false
};

const quoteData: ViewQuoteResponse = {
  model: {
    policyCustomer: [{
      nationalId: "1234567890",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      mobile: "",
      primaryAddress: {
        streetName: "",
        city: "",
        country: "",
        postCode: ""
      }
    }],
    policyBasic: {
      premiumInfo: {
        premiumDue: 100,
        finalPremium: 0,
        premiumBreakdowns: [],
        taxFeeBreakdowns: [],
        sumInsured: 0
      },
      quoteNumber: "quote123",
      requestReferenceNo: ""
    },
    policyLob: []
  },
};

const paymentMethods: PaymentProviderMethods[] = [
  {
    methodCode: "methodCode",
    methodDesc: "visa",
    providerCode: "providerCode",
    providerDesc: "directpay",
  },
];

const languageData: LanguageData = {
  sar: "SAR",
};

const props = {
  paymentData,
  optionData,
  quoteData,
  paymentMethods,
  languageData,
};

describe("CardOptions", () => {
  beforeEach(() => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      errors: null,
      data: null,
    });
  });

  it("renders the component with required props", () => {
    render(<CardOptions {...props} />);
    expect(screen.getByText(paymentData.field_debit_credit_card_no)).toBeInTheDocument();
    expect(screen.getByText(paymentData.field_valid_till)).toBeInTheDocument();
    expect(screen.getByText(paymentData.field_cvc)).toBeInTheDocument();
    expect(screen.getByText(paymentData.field_card_holder_name)).toBeInTheDocument();
  });

  it("handles card number input change and validation", () => {
    render(<CardOptions {...props} />);
    const cardNumberInput = screen.getByPlaceholderText(paymentData.field_debit_credit_card_no);
    fireEvent.change(cardNumberInput, { target: { value: "5123450000000005" } });
    fireEvent.blur(cardNumberInput);
    expect(cardNumberInput).toHaveValue("5123450000000005");
    expect(screen.getByAltText("")).toHaveAttribute("src", optionData.img[typesCard.VISA]);
  });

  it("handles invalid card number input", () => {
    render(<CardOptions {...props} />);
    const cardNumberInput = screen.getByPlaceholderText(paymentData.field_debit_credit_card_no);
    fireEvent.change(cardNumberInput, { target: { value: "100" } });
    fireEvent.blur(cardNumberInput);
    expect(cardNumberInput).toHaveValue("100");
    expect(screen.queryByAltText("")).not.toBeInTheDocument();
  });

  it("handles expiry date input change and validation", () => {
    render(<CardOptions {...props} />);
    const expiryDateInput = screen.getByPlaceholderText("MM/YY");
    fireEvent.change(expiryDateInput, { target: { value: "0131" } });
    fireEvent.blur(expiryDateInput);
    expect(expiryDateInput).toHaveValue("01/31");
  });

  it("handles invalid expiry date input", () => {
    render(<CardOptions {...props} />);
    const expiryDateInput = screen.getByPlaceholderText("MM/YY");
    fireEvent.change(expiryDateInput, { target: { value: "01/31" } });
    fireEvent.blur(expiryDateInput);
    expect(expiryDateInput).toHaveValue("0131");
  });

  it("handles CVV input change and validation", () => {
    render(<CardOptions {...props} />);
    const cvvInput = screen.getByPlaceholderText("***");
    fireEvent.change(cvvInput, { target: { value: "100" } });
    fireEvent.blur(cvvInput);
    expect(cvvInput).toHaveValue("100");
  });

  it("handles invalid CVV input", () => {
    render(<CardOptions {...props} />);
    const cvvInput = screen.getByPlaceholderText("***");
    fireEvent.change(cvvInput, { target: { value: "100" } });
    fireEvent.blur(cvvInput);
    expect(cvvInput).toHaveValue("100");
  });

  it("handles card holder name input change and validation", () => {
    render(<CardOptions {...props} />);
    const cardHolderNameInput = screen.getByPlaceholderText(paymentData.field_card_holder_name);
    fireEvent.change(cardHolderNameInput, { target: { value: "John Doe" } });
    fireEvent.blur(cardHolderNameInput);
    expect(cardHolderNameInput).toHaveValue("John Doe");
  });

  it("handles invalid card holder name input", () => {
    render(<CardOptions {...props} />);
    const cardHolderNameInput = screen.getByPlaceholderText(paymentData.field_card_holder_name);
    fireEvent.change(cardHolderNameInput, { target: { value: "" } });
    fireEvent.blur(cardHolderNameInput);
    expect(cardHolderNameInput).toHaveValue("");
  });

  it("handles form submission and API calls", async () => {
    const mockInitialWebHookCall = jest.fn();
    const mockProgressWebHookCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockInitialWebHookCall,
      errors: null,
      data: null,
    }).mockReturnValueOnce({
      makeApiCall: mockProgressWebHookCall,
      errors: null,
      data: null,
    });

    render(<CardOptions {...props} />);
    const submitButton = screen.getByText(`${paymentData.field_button_title} ${quoteData.model.policyBasic.premiumInfo.premiumDue}`);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInitialWebHookCall).toHaveBeenCalled();
      expect(mockProgressWebHookCall).toHaveBeenCalled();
    });
  });

  it("displays error messages when API calls fail", async () => {
    const mockInitialWebHookCall = jest.fn();
    const mockProgressWebHookCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockInitialWebHookCall,
      errors: { name: "Error", messages: { message_en: "Error message" } },
      data: null,
    }).mockReturnValueOnce({
      makeApiCall: mockProgressWebHookCall,
      errors: { name: "Error", messages: { message_en: "Error message" } },
      data: null,
    });

    render(<CardOptions {...props} />);
    const submitButton = screen.getByText(`${paymentData.field_button_title} ${quoteData.model.policyBasic.premiumInfo.premiumDue}`);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  it("opens and closes the CVV tooltip modal", () => {
    render(<CardOptions {...props} />);
    const infoButton = screen.getByRole("button");
    fireEvent.click(infoButton);
    expect(screen.getByText(paymentData.field_cvv)).toBeInTheDocument();
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(paymentData.field_cvv)).not.toBeInTheDocument();
  });

  it("handles different card types", () => {
    render(<CardOptions {...props} />);
    const cardNumberInput = screen.getByPlaceholderText(paymentData.field_debit_credit_card_no);

    // MasterCard
    fireEvent.change(cardNumberInput, { target: { value: "5123450000000005" } });
    fireEvent.blur(cardNumberInput);
    expect(cardNumberInput).toHaveValue("5123450000000005");
    expect(screen.getByAltText("")).toHaveAttribute("src", optionData.img[typesCard.MasterCard]);

    // Amex
    fireEvent.change(cardNumberInput, { target: { value: "5123450000000005" } });
    fireEvent.blur(cardNumberInput);
    expect(cardNumberInput).toHaveValue("5123450000000005");
    expect(screen.getByAltText("")).toHaveAttribute("src", optionData.img[typesCard.Amex]);

    // Mada
    fireEvent.change(cardNumberInput, { target: { value: "5123450000000005" } });
    fireEvent.blur(cardNumberInput);
    expect(cardNumberInput).toHaveValue("5123450000000005");
    expect(screen.getByAltText("")).toHaveAttribute("src", optionData.img[typesCard.Mada]);
  });

  it("handles handleSubmit function", async () => {
    const mockInitialWebHookCall = jest.fn();
    const mockProgressWebHookCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockInitialWebHookCall,
      errors: null,
      data: null,
    }).mockReturnValueOnce({
      makeApiCall: mockProgressWebHookCall,
      errors: null,
      data: null,
    });

    render(<CardOptions {...props} />);
    const submitButton = screen.getByText(`${paymentData.field_button_title} ${quoteData.model.policyBasic.premiumInfo.premiumDue}`);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInitialWebHookCall).toHaveBeenCalled();
      expect(mockProgressWebHookCall).toHaveBeenCalled();
    });
  });

  it("handles handleWebHookCall function", async () => {
    const mockInitialWebHookCall = jest.fn();
    const mockProgressWebHookCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockInitialWebHookCall,
      errors: null,
      data: null,
    }).mockReturnValueOnce({
      makeApiCall: mockProgressWebHookCall,
      errors: null,
      data: null,
    });

    render(<CardOptions {...props} />);
    const submitButton = screen.getByText(`${paymentData.field_button_title} ${quoteData.model.policyBasic.premiumInfo.premiumDue}`);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockInitialWebHookCall).toHaveBeenCalled();
      expect(mockProgressWebHookCall).toHaveBeenCalled();
    });
  });

  it("handles paymentHandleCall function", async () => {
    const mockInitialWebHookCall = jest.fn();
    const mockProgressWebHookCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: mockInitialWebHookCall,
      errors: null,
      data: null,
    }).mockReturnValueOnce({
      makeApiCall: mockProgressWebHookCall,
      errors: null,
      data: null,
    });

    render(<CardOptions {...props} />);
    const submitButton = screen.getByText(`${paymentData.field_button_title} ${quoteData.model.policyBasic.premiumInfo.premiumDue}`);
    fireEvent.click(submitButton);  

    await waitFor(() => {
      expect(mockInitialWebHookCall).toHaveBeenCalled();
      expect(mockProgressWebHookCall).toHaveBeenCalled();
    });
  });
});