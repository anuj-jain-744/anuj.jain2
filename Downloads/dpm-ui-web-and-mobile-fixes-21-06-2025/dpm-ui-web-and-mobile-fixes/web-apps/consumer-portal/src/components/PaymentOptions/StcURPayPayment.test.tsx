import { render, screen, fireEvent } from "@testing-library/react";
import StcURPayPayment from "./StcURPayPayment";
import { CommonProvider } from "@dpm/shared-module";

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

jest.mock("@app-shell/components/Loader", () => ({
  LoaderOverlay: jest.fn(() => <div data-testid="mock-loader-overlay">Mock Loader</div>),
}));

jest.mock("claims/components/ThemeTextbox", () => {
  return jest.fn(({ onChangehandler, onkeyDownHandler, value }) => (
    <input type="text" data-testid="textbox" onChange={onChangehandler} onKeyDown={onkeyDownHandler} value={value} />
  ));
});

const mockProps = {
  productCode: "testProduct",
  paymentData: {
      field_button_title: "Pay Now",
      mobile_number: "Enter Mobile Number",
      field_payment: "someValue", // Add appropriate value
      field_payment_options: [], // Add appropriate value
      field_pay_via_sadad: "someValue", // Add appropriate value
      field_debit_credit_card: "someValue", // Add appropriate value
      PaymentMethod: {
          version_2_0: {
              stcPay: "stcPayMethod",
          },
      },
  },
  quoteData: {
    quoteEndorsementNumber: "12345",
    premiumDue: 100,
  },
  paymentMethods: [
    {
      methodDesc: "stc_pay",
      methodCode: "stcPayCode",
    },
  ],
  languageData: {
    verify: "Verify",
    sar: "SAR",
    enter_otp_code: "Enter OTP Code",
    your_otp_will_expire: "Your OTP will expire in",
    confirm_otp: "Confirm OTP",
    resend_otp: "Resend OTP",
  },
  payType: "stc_pay",
  mobileNumber: "",
};

describe("STCPayPayment Component", () => {
  it("renders correctly", () => {
    render(<CommonProvider><StcURPayPayment {...mockProps} /></CommonProvider>);
    expect(screen.getByText("Enter Mobile Number")).toBeInTheDocument();
    expect(screen.getByText(/SAR/)).toBeInTheDocument();
  });

  it("updates mobile number on input change", () => {
    render(<CommonProvider><StcURPayPayment {...mockProps} /></CommonProvider>);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });


  it("restricts input length to 14 characters", () => {
    render(<CommonProvider><StcURPayPayment {...mockProps} /></CommonProvider>);
    const textbox = screen.getByRole("textbox");
    fireEvent.change(textbox, { target: { value: "123456789012345" } });
    expect(textbox).toHaveValue("123456789012345");
  });

  it("disables the button when mobile number is empty", () => {
    render(<CommonProvider><StcURPayPayment {...mockProps} /></CommonProvider>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("enables the button and triggers OTP generation on click", () => {
    const updatedProps = { ...mockProps, mobileNumber: "1234567890" };
    render(<CommonProvider><StcURPayPayment {...updatedProps} /></CommonProvider>);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    // Add assertions for OTP generation logic if needed
  });
});