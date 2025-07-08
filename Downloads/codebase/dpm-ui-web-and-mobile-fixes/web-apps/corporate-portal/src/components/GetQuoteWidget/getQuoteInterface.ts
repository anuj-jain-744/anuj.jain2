import type { Value } from "react-multi-date-picker";

export interface ResponsiveObjectProps {
  [key: string]: {
    breakpoint: {
      max: number;
      min: number;
    };
    items: number;
  };
}

export interface FieldsArray {
  field_formfields: string;
  field_fieldtype: string;
  field_field_class: string;
  field_name: string;
  field_maxLength?: number;
  field_validation_message?: string;
}

export interface NewFieldsArrayProp {
  field_name: string;
  field_maxLength?: number;
  field_title: string;
  field_type: string;
  field_class: string;
  field_options: { [key: string]: string };
}

export interface formStateProps {
  [key: string]: {
    value: string | number | Value;
    isValid: boolean;
  };
}

export interface ProductObject {
  product_name: string;
  button_text: string;
  class_name: string;
  category: string;
  form_fields: FieldsArray[];
  fields?: NewFieldsArrayProp[];
}

export interface Product {
  [key: string]: ProductObject[];
}

export interface GetQuoteWidgetProps {
  disclaimerText?: string;
  tooltip?: string;
  refNoTooltip?: string;
  products: Product;
  multiProduct?: boolean;
  customTheme?: boolean;
  isVisible?: boolean;
  setShowCardFooter?: (show: boolean) => void;
  otpInfo?: {
    enter_otp_code: string;
    otp_verification: string;
    resend_otp: string;
    your_otp_will_expire: string;
    otp_timedout_three_wrong_attempts_error_msg: string;
    otp_validity_expired_msg: string;
    otp_info_message: string;
    confirm_otp: string;
    verify?: string;
  };
  navigateTo?: (url: string, data: any) => void;
  languageData?: { [key: string]: string };
  homeLanguageData?: { [key: string]: string };
  setIsFirstPage?: (show: boolean) => void;
  setOtherCase: (show: boolean) => void;
  setProductSelectedTabName: (show: string) => void;
  backBtnClickHandler: () => void;
  othersClaimInfo: OthersClaimInfo;
  setOthersClaimInfo: (claimsInfo: OthersClaimInfo) => void;
  productTitle?: string;
  isProducts?: boolean;
}

export interface CarouselButtonGroupProps {
  next?: () => void;
  previous?: () => void;
  carouselState?: {
    currentSlide: number;
    totalItems: number;
  };
}

export interface ProductDetailToolTip {
  show: boolean;
  index: number | null;
}

export interface GetOtpResponse {
  referenceNo: string;
  sessionSecretId: string;
  timerForResend: string;
  resendOtpTimer: string;
}

export interface ApiResponse {
  message: string;
  code: number;
  data?: {
    mobileNo?: string;
    mobile?: string;
  };
  errors?: {
    errorCode?: string;
    code?: string;
    messages: {
      message_en: string;
    };
  }[];
}

export interface PayloadProps {
  [key: string]: string | undefined | null | Value;
}

// specific to others claims
export type OthersClaimInfo = {
  lossType: string;
  isSequenceNo: boolean;
  SequenceNo?: string | null | undefined;
  ClaimType?: string | null | undefined;
}