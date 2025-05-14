// PaymentInsurance.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaymentInsurance from "./index";
import { useApiCall } from "@dpm/shared-module";
import { useLocation } from "react-router-dom";

jest.mock("components/TravelPremiumBreakupUi/index.tsx", () => jest.fn(() => <div>TravelPremiumBreakupUi</div>));
const mockPaymentLang = {
  config: {
    field_pay_via_sadad: "Pay via Sadad",
    field_debit_credit_card: "Debit/Credit Card",
    field_monthly_instalment_option: "Monthly Instalment",
    field_wallets: "Wallets",
  },
};

const redisData = {
  "driversPremiumData": [],
  "policyNo": "P-ER1-24-330-048631",
  "vehicleSequenceNo": "596843910",
  "benefitsPremiumData": [
      {
          "benefitCategory": "Chargeable",
          "benefitCode": "MRCR",
          "benefitId": "108975000",
          "benefitNameAr": "Replacement Car Whilst Under Repair",
          "benefitNameEn": "Replacement Car Whilst Under Repair",
          "benefitPrice": 450,
          "effectiveDate": "2025-04-08",
          "expiryDate": "2025-09-15T23:59:59.000+00:00",
          "vatAmount": 67.5,
          "isSelected": true
      },
      {
          "benefitCategory": "Chargeable",
          "benefitCode": "MPAD",
          "benefitId": "108974998",
          "benefitNameAr": "Personal Accident - Driver Cover",
          "benefitNameEn": "Personal Accident - Driver Cover",
          "benefitPrice": 25,
          "effectiveDate": "2025-04-08",
          "expiryDate": "2025-09-15T23:59:59.000+00:00",
          "vatAmount": 3.75,
          "isSelected": true
      }
  ]
}

const mockCmsLang = {
  config: [{ motor_insurance: "Motor Insurance", order_summary: "Order Summary" }],
};

const mockQuoteData = {
  model: {
    policyCustomer: [
      {
        nationalId: "121212111"
      }
    ],
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

// Mocks
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
  getAmountText: jest.fn(() => '100'),
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
    fireEvent.click(screen.getByText("Debit/Credit Card"));

    // Check if the selected payment option is updated
    await waitFor(() => {
      expect(screen.getByTestId("check-button_1")).toBeChecked();
    });
  });

  it("renders selected benefits correctly", async () => {

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
        <PaymentInsurance transactionId="EBRN-25-0006615499_01_10_1744640938259" />
      </MemoryRouter>
    );
    
    sessionStorage.setItem(
      "iqmaId",
      "1212121212"
    );

    // Check if the benefits are rendered correctly
    await waitFor(() => {
      expect(screen.getByText("Safe and Secure Payments. Easy servicing. 100% Authentic products.")).toBeInTheDocument();
      expect(screen.getByText("EBRN-25-0006615499")).toBeInTheDocument();
    });
  });

  it("displays the correct payment options when data is available", async () => {

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

  it("renders selected", async () => {    
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
    useLocation.mockReturnValue({
      state: null
    });
    sessionStorage.setItem(
      "iqmaId",
      "1212121212"
    );
    render(
      <MemoryRouter>
        <PaymentInsurance transactionId="QBRN-25-0006615499_02_10_1744640938259" />
      </MemoryRouter>
    );
    
    

    // Check if the benefits are rendered correctly
    await waitFor(() => {
      expect(screen.getByText("Debit/Credit Card")).toBeInTheDocument();
    });
  });

  it("without transactionid", async () => {    
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
      if (path === "/Redis/V1/getValue/EBRN-25-0005187918") {
        return { makeApiCall: jest.fn(), data: redisData };
      }
      return { makeApiCall: jest.fn(), data: null };
    });
    useLocation.mockReturnValue({
      state: null
    });
    sessionStorage.setItem(
      "iqmaId",
      "1212121212"
    );
    render(
      <MemoryRouter>
        <PaymentInsurance transactionId={"EBRN-25-0005187918_03"} />
      </MemoryRouter>
    );    

    // Check if the benefits are rendered correctly
    await waitFor(() => {
      expect(screen.getByText("Debit/Credit Card")).toBeInTheDocument();
    });
  });

});
