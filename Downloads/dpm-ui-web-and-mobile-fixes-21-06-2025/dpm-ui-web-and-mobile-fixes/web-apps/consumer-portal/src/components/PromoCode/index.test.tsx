
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Promocode } from "./index";
import { useApiCall } from "@dpm/shared-module";

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
  useQuoteAndBuyContext: jest.fn(() => ({
    setSchemeCode: jest.fn(),
    homePremiumResponse: {},
    requestPayload: {},
    updateRequestPayload: jest.fn(),
  })),
}));

jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
    isLoading: false,
    errors: null,
    setData: jest.fn(),
  })),
  isValidEmail: jest.fn((email) => email.includes("@")),
}));

jest.mock("hook/motor/useCalculatePremiumApi", () => ({
  useCalculatePremiumApi: jest.fn(() => ({
    handleCalculatePremium: jest.fn(),
    isCalculateData: false,
    isAllError: false,
    isError: [],
  })),
}));

jest.mock("hook/home/useCalculatePremiumApi", () => ({
  useCalculatePremiumApi: jest.fn(() => ({
    handleCalculatePremium: jest.fn(),
  })),
}));

describe("Promocode Component", () => {
  const mockProps = {
    isOpen: true,
    setIsOpen: jest.fn(),
    promoCodeHeading: "Enter Promo Code",
    languageData: {
      field_do_you_have_a_promo_code: "Do you have a promo code?",
      field_enter_the_promo_code: "Enter the promo code",
      filed_promocode: "Promo Code",
      field_enter_promo_code_placehold: "Enter promo code",
      field_apply: "Apply",
      field_are_you_a_corporate_employ: "Are you a corporate employee?",
      field_if_yes_please_keep_your_em: "If yes, please enter your email",
      field_corporate_email_id: "Corporate Email ID",
      field_enter_corporate_email_id: "Enter corporate email ID",
      field_send_promo_code: "Send Promo Code",
      promo_code_applied_successfully: "Promo Code Applied Successfully!",
      internal_server_error: "Internal Server Error",
    },
    setCallGenerateOtp: jest.fn(),
    emailVal: "",
    setEmailVal: jest.fn(),
    isCouponApplied: false,
    setIsCouponApplied: jest.fn(),
  };

  it("renders the promo code modal when open", () => {
    render(<Promocode {...mockProps} />);
    expect(screen.getByText("Enter Promo Code")).toBeInTheDocument();
  });

  it("updates promo code value on input change", () => {
    render(<Promocode {...mockProps} />);
    const input = screen.getByPlaceholderText("Enter promo code");
    fireEvent.change(input, { target: { value: "DISCOUNT50" } });
    expect(input?.value).toBe("DISCOUNT50");
  });

  it("updates email value on input change", () => {
    render(<Promocode {...mockProps} />);
    const emailInput = screen.getByPlaceholderText("Enter corporate email ID");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput?.value).toBe("");
  });

  it("calls API when apply promo code button is clicked", async () => {
    const mockApiCall = jest.fn();
    useApiCall.mockReturnValue({ makeApiCall: mockApiCall, data: null });
    render(<Promocode {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText("Enter promo code"), { target: { value: "DISCOUNT50" } });
    fireEvent.click(screen.getByText("Apply"));

    await waitFor(() => expect(mockApiCall).toHaveBeenCalledWith({ schemeType: 3, promoCode: "DISCOUNT50" }));
  });

  it("displays success message when coupon is applied", () => {
    render(<Promocode {...mockProps} isCouponApplied={true} />);
    expect(screen.getByText("Promo Code Applied Successfully!")).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    render(<Promocode {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(mockProps.setIsOpen).toHaveBeenCalledWith(false);
  });
});
