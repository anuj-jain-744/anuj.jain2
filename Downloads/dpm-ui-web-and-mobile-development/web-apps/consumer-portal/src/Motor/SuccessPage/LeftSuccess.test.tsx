// LeftSuccess.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeftSuccess from "./LeftSuccess";
import { useApiCall, RootState } from "@dpm/shared-module";
import { useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import usePolicyData from "Motor/Policy-services/PolicyDashboard/hooks/usePolicyData";

// Mocking the necessary hooks and components
jest.mock("components/hooks/useQuoteAndBuyContext");
jest.mock(
  "Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles",
  () => ({
    __esModule: true,
    default: jest.fn(() => ({
      createZip: jest.fn(),
    })),
  })
);
jest.mock(
  "Motor/Policy-services/PolicyDashboard/hooks/useReviewPolicy",
  () => ({
    useReviewPolicy: jest
      .fn()
      .mockReturnValue({
        makeApiCall: jest.fn(),
        data: jest.fn(),
        isLoading: false,
      }),
  })
);

jest.mock("Motor/Policy-services/PolicyDashboard/hooks/usePolicyData", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    usePolicyData: jest.fn(),
  })),
}));

// Mock console methods
console.warn = jest.fn();
console.error = jest.fn();

jest.mock("hook/common/useDownloadPdf", () => ({
  useDownloadPDF: jest.fn().mockReturnValue({ processPDFs: jest.fn() }),
}));

jest.mock("@dpm/corporate-portal/src/utils/icons", () => ({
  IconsSet: {
    "some-class": "some-icon-path",
  },
}));

jest.mock("@dpm/shared-module", () => ({
  ...jest.requireActual("@dpm/shared-module"),
  useApiCall: jest.fn(),
  RootState: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: () => ({
    transactionid: "QBRN-25-0006615499_01_10_1744640938259",
  }),
}));

jest.mock("./registerClaimCard", () =>
  jest.fn(() => <div>RegisterClaimCard</div>)
);
jest.mock("./CancelSuccessLeft", () =>
  jest.fn(() => <div data-testid="cancel-successid">CancelSuccessLeft</div>)
);
jest.mock("./CommonComponent/ContactCard", () =>
  jest.fn(() => <div data-testid="contact-card">ContactCard</div>)
);
jest.mock("./CommonComponent/PolicyDetails", () =>
  jest.fn(() => <div data-testid="policy-details">PolicyDetails</div>)
);
jest.mock("../../components/Feedback", () =>
  jest.fn(() => <div data-testid="feedback">Feedback</div>)
);
jest.mock("./CommonComponent/UserCard", () =>
  jest.fn(() => <div data-testid="user-card">UserCard</div>)
);
jest.mock("./CommonComponent/VehicleInfo", () =>
  jest.fn(() => <div data-testid="vehicle-info">VehicleInfo</div>)
);
jest.mock("./CommonComponent/ActionLinks", () => ({
  ActionLInk: ({
    handleDownloadPolicy,
    languageData,
  }: {
    handleDownloadPolicy: () => void;
    languageData: {
      download_policy: string;
      download_payment_receipt: string;
      share: string;
    };
  }) =>
    languageData && (
      <div data-testid="action-links" onClick={handleDownloadPolicy}>
        {languageData.download_payment_receipt}
      </div>
    ),
}));
jest.mock("components/AlertBox", () => ({
  AlertBox: ({
    title,
    description,
    showAlertModal,
  }: {
    title: string;
    description: string;
    showAlertModal: boolean;
  }) =>
    showAlertModal ? (
      <div data-testid="alert-box">
        {title}
        <p>{description}</p>
      </div>
    ) : null,
}));
const mockState = {
  dashbaordLanguageData: {
    languageData: {
      dashboardslider: [
        {
          title: "Slider 1 Title",
          description: "Slider 1 Description",
          button_text: "Get a Quote",
          image: "image1.jpg",
        },
        {
          title: "Slider 2 Title",
          description: "Slider 2 Description",
          image: "image2.jpg",
        },
        {
          title: "Slider 3 Title",
          description: "Slider 3 Description",
          image: "image3.jpg",
        },
      ],
      feedback: "hellow, hello,",
    },
  },
  auth: { userInfo: { userId: "1" } },
};

const paymentLang = {
  config: {
    field_payment: "",
    field_payment_options: "",
    field_pay_via_sadad: "",
    field_debit_credit_card: "",
    field_debit_credit_card_no: "",
    field_monthly_instalment_option: "",
    field_pay_later_with_tabby: "",
    field_pay_later_with_tamara: "",
    field_card_holder_name: "",
    field_pay_later_in_14_days: "",
    field_pay_later_in_30_days: "",
    field_enter_your_tamara_id: "",
    field_generate_sadad_code: "",
    field_kindly_generate_your_sadad_payment: "",
    field_safe_and_secure_payments: "",
    field_share: "",
    field_quotation_no: "",
    field_signup_with_tabby: "",
    field_signup_with_tamara: "",
    field_wallets: "",
    field_your_sadad_payment_id: "",
    field_sadad_payment_id: "",
    field_scan_qr: "",
    field_your_payment_is_being_processed: "",
    field_valid_till: "",
    field_cvc: "",
    field_cvv_info: "",
    field_cvv: "",
    field_button_title: "",
    directPayAuthenticationToken: "",
    ThemeID: "",
    MerchantID: "",
    platform: "",
    PaymentMethod: {
      version_1_0: {
        card: "",
        applePay: "",
        urPay: "",
        stcPay: "",
        sadad: "",
        emkan: "",
        tabby: "",
      },
      version_2_0: {
        card: "",
        applePay: "",
        urPay: "",
        stcPay: "",
        sadad: "",
        emkan: "",
        tabby: "",
      },
    },
    Language: {
      card: "",
      applePay: "",
      urPay: "",
      stcPay: "",
      sadad: "",
      emkan: "",
      tabby: "",
    },
    CurrencyISOCode: {
      us_dollar: "",
      jod: "",
      sar: "",
      aed: "",
    },
    MessageID: {
      redirect_payment: "",
      redirect_pre_auth: "",
      enquiry_payment: "",
    },
    Version: [],
    productCodeTitle: {},
    field_successRight: {
      quote: [],
      endo: [],
    },
    productCodeMapping: {},
  },
};

const mockStore = createStore((state: RootState) => state, mockState);
const mockCmsData = {
  config: [
    {
      id: "1",
      model: "2024",
      image: "https",
    },
  ],
};
const mockCmsPaymentData = {
  config: [
    {
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
        aed: "",
      },
      MessageID: {
        redirect_payment: "redirect_payment",
        redirect_pre_auth: "",
        enquiry_payment: "",
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
          tabby: "",
        },
        version_1_0: {
          card: "",
          applePay: "",
          urPay: "",
          stcPay: "",
          sadad: "",
          emkan: "",
          tabby: "",
        },
      },
      ThemeID: "ThemeID",
      Version: ["2.0"],
      directPayAuthenticationToken: "token",
    },
  ],
};
const mockQuoteData = {
  model: {
    policyBasic: {
      requestReferenceNo: "123",
      premiumInfo: {
        premiumDue: " 123",
      },
    },
    policyCustomer: [
      {
        nationalId: "1234567890",
      },
    ],
  },
};

const mockUseApiCall = useApiCall as jest.Mock;
const mockUsePolicyData = usePolicyData as jest.Mock;

describe("LeftSuccess Component", () => {
  const mockSetLoading = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      data: null,
    });
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn().mockResolvedValue(mockCmsPaymentData),
      errors: null,
      isLoading: false,
      data: mockCmsPaymentData,
    });
    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn().mockResolvedValue(mockQuoteData),
      errors: null,
      isLoading: false,
      data: mockQuoteData,
    });
  });

  it("should render CancelSuccessLeft correctly", () => {
    // Given the loading state is true
    mockSetLoading(false);

    render(
      <Provider store={mockStore}>
        <LeftSuccess
          data={{
            policyNumber: "123",
            vehicleDetails: {
              name: "Car",
              plateNumber: "XYZ123",
              vehicleSequenceNo: "001",
              chassisNo: "123456",
              manufactureYear: 2020,
            },
            refundValue: "100",
          }}
          status={true}
          setLoading={mockSetLoading}
          loading={false}
          isCancelSuccess={true}
          claimData={undefined}
          langData={{}} // Mocked language data
          paymentLang={paymentLang}
        />
      </Provider>
    );
    expect(screen.getByTestId("cancel-successid")).toBeInTheDocument(); // If you show a "loading" text
  });

  it("should render the PolicyDetails ", async () => {
    const mockApiResponse = {
      data: { model: { policyId: "policy123", policyNo: "123" } },
    };
    const mockMakeApiCall = jest.fn();
    mockUseApiCall.mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockApiResponse,
    });
    const mockPolicyData = {
      successPageData: {
        policyNo: "POLICY123",
        registrationPlateNo: "XYZ123",
        startDate: "2025-01-01",
        expiryDate: "2026-01-01",
        nationalityId: "12345678",
        mobileNo: "0501029378583",

        // Add other properties you need for testing
      },
    };

    // Mock the implementation of usePolicyData
    mockUsePolicyData.mockReturnValue(mockPolicyData);

    mockSetLoading(false);
    render(
      <Provider store={mockStore}>
        <LeftSuccess
          data={{
            policyNumber: "123",
            vehicleDetails: {
              name: "Car",
              plateNumber: "XYZ123",
              vehicleSequenceNo: "001",
              chassisNo: "123456",
              manufactureYear: 2020,
            },
            refundValue: "100",
          }}
          status={true}
          setLoading={mockSetLoading}
          loading={false}
          isCancelSuccess={false}
          claimData={undefined}
          langData={{}}
          paymentLang={{
            ...paymentLang,
            config: {
              ...paymentLang?.config,
              directPayAuthenticationToken: undefined,
            },
          }}
        />
      </Provider>
    );
    // Check if PolicyDetails, UserCard, VehicleInfo are rendered
    waitFor(() => {
      expect(screen.getByTestId("policy-details")).toBeInTheDocument();
      expect(screen.getByTestId("user-card")).toBeInTheDocument();
      expect(screen.getByTestId("vehicle-info")).toBeInTheDocument();
    });
  });
  it("should render the cms data if not loading", async () => {
    const mockMakeApiCall = jest.fn();
    mockUseApiCall.mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: mockCmsData,
    });

    // Render the component
    render(
      <Provider store={mockStore}>
        <LeftSuccess
          data={{
            policyNumber: "123",
            vehicleDetails: {
              name: "Car",
              plateNumber: "XYZ123",
              vehicleSequenceNo: "001",
              chassisNo: "123456",
              manufactureYear: 2020,
            },
            refundValue: "100",
          }}
          status={true}
          setLoading={mockSetLoading}
          loading={false}
          isCancelSuccess={true}
          claimData={{ id: "1" }}
          langData={{ track_your_claim: "Track Claim" }}
          paymentLang={paymentLang}
        />
      </Provider>
    );

    expect(screen.getByTestId("cancel-successid")).toBeInTheDocument();
    expect(screen.getByTestId("track-id")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("track-id"));
    waitFor(() => expect(jest.fn()).toHaveBeenCalled());
  });

  it("should show the alert modal if there is an error", async () => {
    const mockMakeApiCall = jest.fn();
    mockUseApiCall.mockReturnValue({
      makeApiCall: mockMakeApiCall,
      data: null,
      isLoading: false,
      errors: { messages: { message_en: "Error occurred" } },
    });
    render(
      <Provider store={mockStore}>
        <LeftSuccess
          data={{
            policyNumber: "123",
            vehicleDetails: {
              name: "Car",
              plateNumber: "XYZ123",
              vehicleSequenceNo: "001",
              chassisNo: "123456",
              manufactureYear: 2020,
            },
            refundValue: "100",
          }}
          status={true}
          setLoading={mockSetLoading}
          loading={false}
          isCancelSuccess={false}
          claimData={undefined}
          langData={{}}
          paymentLang={paymentLang}
        />
      </Provider>
    );

    // Check if the alert box is shown
    waitFor(() => expect(screen.getByTestId("alert-box")).toBeInTheDocument());
  });

  test("handles feedback modal close", () => {
    render(
      <Provider store={mockStore}>
        <LeftSuccess
          data={{
            policyNumber: "123",
            vehicleDetails: {
              name: "Car",
              plateNumber: "XYZ123",
              vehicleSequenceNo: "001",
              chassisNo: "123456",
              manufactureYear: 2020,
            },
            refundValue: "100",
          }}
          status={true}
          setLoading={mockSetLoading}
          loading={false}
          isCancelSuccess={false}
          claimData={undefined}
          langData={{
            download_policy: "123",
            download_payment_receipt: "123",
            share: "123",
          }}
          paymentLang={paymentLang}
        />
      </Provider>
    );
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(/how feel/i)).not.toBeInTheDocument();
  });
});
