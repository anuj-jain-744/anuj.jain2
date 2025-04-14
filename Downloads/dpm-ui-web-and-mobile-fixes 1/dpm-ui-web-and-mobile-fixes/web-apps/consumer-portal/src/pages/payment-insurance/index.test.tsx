// PaymentInsurance.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PaymentInsurance from "./index";
import { useApiCall } from "@dpm/shared-module";
import { useLocation } from "react-router-dom";

// Mocks
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("PaymentInsurance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing and fetches data", async () => {
    // Mock API responses
    const mockPaymentLang = {
      config: {
        field_pay_via_sadad: "Pay via Sadad",
        field_debit_credit_card: "Debit/Credit Card",
        field_monthly_instalment_option: "Monthly Instalment",
        field_wallets: "Wallets",
      },
    };

    const mockCmsLang = {
      config: [{ motor_insurance: "Motor Insurance", order_summary: "Order Summary" }],
    };

    const mockQuoteData = {
      model: {
        policyBasic: {
          premiumInfo: {
            premiumDue: 1000,
            premiumBreakdowns: [],
            finalPremium: 1200,
            taxFeeBreakdowns: [{ amount: 100 }],
          },
        },
      },
    };

    const mockPromoCodeConfig = { promoCode: "TESTPROMO" };

    useApiCall.mockImplementation((id, path, method) => {
      if (path === "payment-config") {
        return { makeApiCall: jest.fn(), data: mockPaymentLang };
      }
      if (path === "promo-code-config") {
        return { makeApiCall: jest.fn(), data: mockPromoCodeConfig };
      }
      if (path === "consumerportal-config") {
        return { makeApiCall: jest.fn(), data: mockCmsLang };
      }
      if (path === "/Motor/QuoteAndBuy/V1/viewQuote") {
        return { makeApiCall: jest.fn(), data: mockQuoteData };
      }
      return { makeApiCall: jest.fn(), data: null };
    });

    useLocation.mockReturnValue({
      state: {
        quoteData: { quoteNo: "1234" },
      },
    });

    render(
      <MemoryRouter>
        <PaymentInsurance transactionId="1234" />
      </MemoryRouter>
    );

    // Check if elements are rendered
    await waitFor(() => {
      expect(screen.getByTestId("quote-buy")).toBeInTheDocument();
      expect(screen.getByText("Buy Product")).toBeInTheDocument();
      expect(screen.getByText("Pay via Sadad")).toBeInTheDocument();
      expect(screen.getByText("Debit/Credit Card")).toBeInTheDocument();
      expect(screen.getByText("Monthly Instalment")).toBeInTheDocument();
      expect(screen.getByText("Wallets")).toBeInTheDocument();
    });
  });

  it("changes selected payment option on user click", async () => {
    const mockPaymentLang = {
      config: {
        field_pay_via_sadad: "Pay via Sadad",
        field_debit_credit_card: "Debit/Credit Card",
        field_monthly_instalment_option: "Monthly Instalment",
        field_wallets: "Wallets",
      },
    };

    useApiCall.mockImplementation((id, path, method) => {
      if (path === "payment-config") {
        return { makeApiCall: jest.fn(), data: mockPaymentLang };
      }
      return { makeApiCall: jest.fn(), data: null };
    });

    render(
      <MemoryRouter>
        <PaymentInsurance transactionId="1234" />
      </MemoryRouter>
    );

    // Simulate user selecting a payment option
    fireEvent.click(screen.getByLabelText("Debit/Credit Card"));

    // Check if the selected payment option is updated
    await waitFor(() => {
      expect(screen.getByLabelText("Debit/Credit Card")).toBeChecked();
    });
  });

  it("shows error alert when processTransaction has an error", async () => {
    const mockPaymentLang = {
      config: {
        field_pay_via_sadad: "Pay via Sadad",
        field_debit_credit_card: "Debit/Credit Card",
        field_monthly_instalment_option: "Monthly Instalment",
        field_wallets: "Wallets",
      },
    };

    const mockProcessTransaction = {
      errorMessage: "Error processing transaction",
    };

    useApiCall.mockImplementation((id, path, method) => {
      if (path === "payment-config") {
        return { makeApiCall: jest.fn(), data: mockPaymentLang };
      }
      return { makeApiCall: jest.fn(), data: null };
    });

    useLocation.mockReturnValue({
      state: {
        quoteData: { quoteNo: "1234" },
      },
    });

    render(
      <MemoryRouter>
        <PaymentInsurance transactionId="1234" />
      </MemoryRouter>
    );

    // Check if error alert is shown
    await waitFor(() => {
      expect(screen.getByText("Payment")).toBeInTheDocument();
      expect(screen.getByText("Error processing transaction")).toBeInTheDocument();
    });
  });

  it("renders selected benefits correctly", async () => {
    const mockPaymentLang = {
      config: {
        field_pay_via_sadad: "Pay via Sadad",
        field_debit_credit_card: "Debit/Credit Card",
        field_monthly_instalment_option: "Monthly Instalment",
        field_wallets: "Wallets",
      },
    };

    const mockCmsLang = {
      config: [{ motor_insurance: "Motor Insurance", order_summary: "Order Summary" }],
    };

    const mockQuoteData = {
      model: {
        policyLob: [
          {
            policyRisk: [
              {
                benefits: [
                  { benefitCode: "BEN01", benefitNameEn: "Benefit 1", benefitPrice: 100 },
                  { benefitCode: "BEN02", benefitNameEn: "Benefit 2", benefitPrice: 200 },
                ],
              },
            ],
          },
        ],
      },
    };

    useApiCall.mockImplementation((id, path, method) => {
      if (path === "payment-config") {
        return { makeApiCall: jest.fn(), data: mockPaymentLang };
      }
      if (path === "consumerportal-config") {
        return { makeApiCall: jest.fn(), data: mockCmsLang };
      }
      if (path === "/Motor/QuoteAndBuy/V1/viewQuote") {
        return { makeApiCall: jest.fn(), data: mockQuoteData };
      }
      return { makeApiCall: jest.fn(), data: null };
    });

    render(
      <MemoryRouter>
        <PaymentInsurance transactionId="1234" />
      </MemoryRouter>
    );

    // Check if the benefits are rendered correctly
    await waitFor(() => {
      expect(screen.getByText("Benefit 1")).toBeInTheDocument();
      expect(screen.getByText("Benefit 2")).toBeInTheDocument();
    });
  });

  it("displays the correct payment options when data is available", async () => {
    const mockPaymentLang = {
      config: {
        field_pay_via_sadad: "Pay via Sadad",
        field_debit_credit_card: "Debit/Credit Card",
        field_monthly_instalment_option: "Monthly Instalment",
        field_wallets: "Wallets",
      },
    };

    const mockCmsLang = {
      config: [{ motor_insurance: "Motor Insurance", order_summary: "Order Summary" }],
    };

    useApiCall.mockImplementation((id, path, method) => {
      if (path === "payment-config") {
        return { makeApiCall: jest.fn(), data: mockPaymentLang };
      }
      if (path === "consumerportal-config") {
        return { makeApiCall: jest.fn(), data: mockCmsLang };
      }
      return { makeApiCall: jest.fn(), data: null };
    });

    render(
      <MemoryRouter>
        <PaymentInsurance transactionId="1234" />
      </MemoryRouter>
    );

    // Check if payment options are rendered
    await waitFor(() => {
      expect(screen.getByText("Pay via Sadad")).toBeInTheDocument();
      expect(screen.getByText("Debit/Credit Card")).toBeInTheDocument();
      expect(screen.getByText("Monthly Instalment")).toBeInTheDocument();
      expect(screen.getByText("Wallets")).toBeInTheDocument();
    });
  });
});
