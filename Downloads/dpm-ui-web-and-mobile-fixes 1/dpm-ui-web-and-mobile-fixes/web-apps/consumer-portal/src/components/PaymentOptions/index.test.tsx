import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentOptions from './index';
import { PaymentOptionProp } from 'pages/payment-insurance';
import { ViewQuoteResponse } from 'types/viewQuote';
import { CmsPayment } from './types/cmsPayment';
import { LanguageData } from 'types/languageData';
import { useApiCall } from '@dpm/shared-module';
import { PaymentProvider, PaymentProviderMethods } from './types/providerPayment';

// Mock the useApiCall hook 
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

const mockUseApiCall = useApiCall as jest.Mock;

const mockPaymentProvider: PaymentProvider = {
  content: [
    {
      providerCode: 'provider1',
      providerDesc: 'Provider 1',
      paymentMethod: [
        {
          methodCode: 'method1',
          methodDesc: 'Method 1',
        },
      ],
    },
  ],
};

const mockPaymentMethods: PaymentProviderMethods[] = [
  {
    providerCode: 'provider1',
    providerDesc: 'Provider 1',
    methodCode: 'method1',
    methodDesc: 'Method 1',
  },
];

const mockPaymentData: CmsPayment = {
    field_pay_via_sadad: 'Pay via Sadad',
    field_debit_credit_card: 'Debit/Credit Card',
    field_monthly_instalment_option: 'Monthly Options',
    field_wallets: 'Wallets',
    field_payment: '',
    field_payment_options: '',
    field_debit_credit_card_no: '',
    field_pay_later_with_tabby: '',
    field_pay_later_with_tamara: '',
    field_card_holder_name: '',
    field_pay_later_in_14_days: '',
    field_pay_later_in_30_days: '',
    field_enter_your_tamara_id: '',
    field_generate_sadad_code: '',
    field_kindly_generate_your_sadad_payment: '',
    field_safe_and_secure_payments: '',
    field_share: '',
    field_quotation_no: '',
    field_signup_with_tabby: '',
    field_signup_with_tamara: '',
    field_your_sadad_payment_id: '',
    field_sadad_payment_id: '',
    field_scan_qr: '',
    field_your_payment_is_being_processed: '',
    field_valid_till: '',
    field_cvc: '',
    field_cvv_info: '',
    field_cvv: '',
    field_button_title: '',
    directPayAuthenticationToken: '',
    ThemeID: '',
    MerchantID: '',
    platform: '',
    PaymentMethod: {
        version_1_0: {
            card: '',
            applePay: '',
            urPay: '',
            stcPay: '',
            sadad: '',
            emkan: '',
            tabby: ''
        },
        version_2_0: {
            card: '',
            applePay: '',
            urPay: '',
            stcPay: '',
            sadad: '',
            emkan: '',
            tabby: ''
        }
    },
    Language: {
        card: '',
        applePay: '',
        urPay: '',
        stcPay: '',
        sadad: '',
        emkan: '',
        tabby: ''
    },
    CurrencyISOCode: {
        us_dollar: '',
        jod: '',
        sar: '',
        aed: ''
    },
    MessageID: {
        redirect_payment: '',
        redirect_pre_auth: '',
        enquiry_payment: ''
    },
    Version: []
};

const mockOptionData: PaymentOptionProp = {
  label: 'Debit/Credit Card',
  img: ['visa.png'],
  value: 'debit',
  disabled: false,
};

const mockQuoteData: ViewQuoteResponse = {
  model: {
      policyBasic: {
          premiumInfo: {
              premiumDue: 100,
              finalPremium: 120,
              taxFeeBreakdowns: [{
                  amount: 20,
                  sign: 0,
                  type: ''
              }],
              premiumBreakdowns: [],
              sumInsured: 0
          },
          requestReferenceNo: '',
          quoteNumber: ''
      },
      policyLob: [],
      policyCustomer: []
  },
};

const mockLanguageData: LanguageData = {
  motor_insurance: 'Motor Insurance',
  order_summary: 'Order Summary',
};

describe('PaymentOptions', () => {
  beforeEach(() => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      data: mockPaymentProvider,
    });
  });

  it('renders Sadad option', () => {
    render(
      <PaymentOptions
        option="sadad"
        paymentData={mockPaymentData}
        optionData={mockOptionData}
        quoteData={mockQuoteData}
        languageData={mockLanguageData}
      />
    );
    expect(screen.getByText('Sadad')).toBeInTheDocument();
  });

  it('renders Debit/Credit Card option', () => {
    render(
      <PaymentOptions
        option="debit"
        paymentData={mockPaymentData}
        optionData={mockOptionData}
        quoteData={mockQuoteData}
        languageData={mockLanguageData}
      />
    );
    expect(screen.getByText('Debit/Credit Card')).toBeInTheDocument();
  });

  it('renders Monthly Options option', () => {
    render(
      <PaymentOptions
        option="monthly_options"
        paymentData={mockPaymentData}
        optionData={mockOptionData}
        quoteData={mockQuoteData}
        languageData={mockLanguageData}
      />
    );
    expect(screen.getByText('Monthly Options')).toBeInTheDocument();
  });

  it('renders Wallets option', () => {
    render(
      <PaymentOptions
        option="wallets"
        paymentData={mockPaymentData}
        optionData={mockOptionData}
        quoteData={mockQuoteData}
        languageData={mockLanguageData}
      />
    );
    expect(screen.getByText('Wallets')).toBeInTheDocument();
  });

  it('renders empty div for unknown option', () => {
    const { container } = render(
      <PaymentOptions
        option="unknown"
        paymentData={mockPaymentData}
        optionData={mockOptionData}
        quoteData={mockQuoteData}
        languageData={mockLanguageData}
      />
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});