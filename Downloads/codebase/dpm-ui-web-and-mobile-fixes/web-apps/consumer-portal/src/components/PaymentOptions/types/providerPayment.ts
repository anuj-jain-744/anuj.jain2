import { AddBenefitprops } from "types/AddBenefit";
import { AddDriverProps } from "types/endorsement";

export interface PaymentProvider {
  content: [
    {
      providerCode: string;
      providerDesc: string;
      paymentMethod: [
        {
          methodCode: string;
          methodDesc: string;
        }
      ];
    }
  ];
}

export interface PaymentProviderMethods {
  providerCode: string;
  providerDesc: string;
  methodCode: string;
  methodDesc: string;
}

export interface RedisDataResponse {
  benefitsPremiumData?: AddBenefitprops[];
  driversPremiumData?: AddDriverProps[];
  policyNo: string;
  customerNameEn?: string;
  customerNameAr?: string;
  vehicleSequenceNo: string;
  productType: number;
  nationalId: string;
  adminFee?: number;
  mobileNumber : string;
  email: string;
  adminFees?: number;
  totalAmount?:{
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
  };
  vatAmount?: number;
  subtotal?: number;
}

export interface ResponsePaymentOption {
  nationalId: string;
  premiumDue: number;
  quoteEndorsementNumber: string;
  customerNameEnglish : string;
  customerNameArabic : string;
  mobileNumber?: string;
  email?: string;
  amountWithoutTax: number;
  taxAmount: number;
  subTotal?: number;
  vatAmount?: number;
}

export interface PremiumDriverProps {
  taxableAmount?: number;
  vatAmount: number;
  totalAmount: number;
  subtotal?: number;
}