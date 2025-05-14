import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SuccesRightComponent from "./index";
import { callAPI,useApiCall } from "@dpm/shared-module";
import mockData from "./../success.json";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
  getFullUrl: jest.fn(),
   useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
    errors: null,
    isLoading: false
  }))
}));


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: () => ({
    transactionid: 'EBRN-25-0006615499_02_10_1744640938259',
  }),
}));

const mockFooterData = {
  blocks: {
    mobile_slider: {
      mobile_app_images: [
        { app_image_url: "https://example.com/image0.png" },
        { app_image_url: "https://example.com/google-play.png" },
        { app_image_url: "https://example.com/app-store.png" },
        { app_image_url: "https://example.com/app-gallery.png" },
      ],
    },
  },
};

beforeEach(() => {
  (callAPI as jest.Mock).mockResolvedValue(mockFooterData);
  (useApiCall as jest.Mock).mockReturnValue({
    makeApiCall: jest.fn(),
    data: { config: { en: "English" } },
    errors: null,
    isLoading: false
  });
});


const paymentLang = {
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
        tabby: ""
      },
      version_2_0: {
        card: "",
        applePay: "",
        urPay: "",
        stcPay: "",
        sadad: "",
        emkan: "",
        tabby: ""
      }
    },
    Language: {
      card: "",
      applePay: "",
      urPay: "",
      stcPay: "",
      sadad: "",
      emkan: "",
      tabby: ""
    },
    CurrencyISOCode: {
      us_dollar: "",
      jod: "",
      sar: "",
      aed: ""
    },
    MessageID: {
      redirect_payment: "",
      redirect_pre_auth: "",
      enquiry_payment: ""
    },
    Version: [],
    productCodeTitle: {},
    field_successRight: {
      quote: [],
      endo: []
    },
    productCodeMapping: {}
  };
test("renders SuccesRightComponent with footer data", async () => {
  render(<SuccesRightComponent paymentLang={paymentLang} flag/>);

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  );

  expect(screen.getByText(mockData["experience"])).toBeInTheDocument();
  expect(screen.getByText(mockData["download"])).toBeInTheDocument();
  expect(screen.getByText(mockData["download-app"])).toBeInTheDocument();

  const googlePlayImage = screen.getByRole("img", { name: /google play/i });
  const appStoreImage = screen.getByRole("img", { name: /app store/i });
  const appGalleryImage = screen.getByRole("img", { name: /app gallery/i });

  expect(googlePlayImage).toHaveAttribute(
    "src",
    "https://example.com/google-play.png"
  );
  expect(appStoreImage).toHaveAttribute(
    "src",
    "https://example.com/app-store.png"
  );
  expect(appGalleryImage).toHaveAttribute(
    "src",
    "https://example.com/app-gallery.png"
  );
});
