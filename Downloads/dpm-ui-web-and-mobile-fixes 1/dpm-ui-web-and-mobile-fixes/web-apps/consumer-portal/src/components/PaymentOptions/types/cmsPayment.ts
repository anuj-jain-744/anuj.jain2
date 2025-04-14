export interface CmsPayment {
  field_payment: string;
  field_payment_options: string;
  field_pay_via_sadad: string;
  field_debit_credit_card: string;
  field_debit_credit_card_no: string;
  field_monthly_instalment_option: string;
  field_pay_later_with_tabby: string;
  field_pay_later_with_tamara: string;
  field_card_holder_name: string;
  field_pay_later_in_14_days: string;
  field_pay_later_in_30_days: string;
  field_enter_your_tamara_id: string;
  field_generate_sadad_code: string;
  field_kindly_generate_your_sadad_payment: string;
  field_safe_and_secure_payments: string;
  field_share: string;
  field_quotation_no: string;
  field_signup_with_tabby: string;
  field_signup_with_tamara: string;
  field_wallets: string;
  field_your_sadad_payment_id: string;
  field_sadad_payment_id: string;
  field_scan_qr: string;
  field_your_payment_is_being_processed: string;
  field_valid_till: string;
  field_cvc: string;
  field_cvv_info: string;
  field_cvv: string;
  field_button_title: string;
  directPayAuthenticationToken: string;
  ThemeID: string;
  MerchantID: string;
  platform: string;
  PaymentMethod: {
    version_1_0: {
      card: string;
      applePay: string;
      urPay: string;
      stcPay: string;
      sadad: string;
      emkan: string;
      tabby: string;
    };
    version_2_0: {
      card: string;
      applePay: string;
      urPay: string;
      stcPay: string;
      sadad: string;
      emkan: string;
      tabby: string;
    };
  };
  Language: {
    card: string;
    applePay: string;
    urPay: string;
    stcPay: string;
    sadad: string;
    emkan: string;
    tabby: string;
  };
  CurrencyISOCode: {
    us_dollar: string;
    jod: string;
    sar: string;
    aed: string;
  };
  MessageID: {
    redirect_payment: string;
    redirect_pre_auth: string;
    enquiry_payment: string;
  };
  Version: string[];
}
