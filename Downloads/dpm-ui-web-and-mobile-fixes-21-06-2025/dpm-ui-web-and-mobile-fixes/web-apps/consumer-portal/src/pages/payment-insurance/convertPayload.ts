import { PremiumDriverProps, RedisDataResponse, ResponsePaymentOption } from "components/PaymentOptions/types/providerPayment";
import { AddBenefitprops, PremiumBreakdownProps } from "types/AddBenefit";
import { ViewQuoteResponse } from "types/viewQuote";
import { AddDriverProps } from "types/endorsement";

export const convertQuoteData = (
  quoteData: ViewQuoteResponse,
  quoteEndorsementNumber: string
): ResponsePaymentOption => {
  return {
    nationalId: quoteData?.model?.policyCustomer[0]?.nationalId,
    premiumDue: quoteData?.model?.policyBasic?.premiumInfo?.premiumDue,
    quoteEndorsementNumber: quoteEndorsementNumber,
    customerNameEnglish: quoteData?.model?.policyCustomer[0]?.customerNameEnglish || "",
    customerNameArabic:  quoteData?.model?.policyCustomer[0]?.customerNameArabic || "",
    mobileNumber : quoteData?.model?.policyCustomer[0]?.mobile || "",
    email: quoteData?.model?.policyCustomer[0]?.email ?? "",
    amountWithoutTax: 0,
    taxAmount: 0,
  };
};

type endoInfoTypes = {
    subtotal?: number;
    vatAmount?: number;
    totalAmount?: number;
  }

export const getTotalSubTotal = (benefits: AddBenefitprops[], endoInfo: endoInfoTypes | null = null): PremiumBreakdownProps => {
  if (endoInfo?.totalAmount && endoInfo?.vatAmount) {
    return {
      subtotal: Number(endoInfo.subtotal) || 0,
      vatAmount: Number(endoInfo.vatAmount) || 0,
      totalAmount: Number(endoInfo.totalAmount) || 0,
    };
  }
  const subtotal =
    benefits?.reduce((total, benefit) => total + benefit.benefitPrice, 0) || 0;

  const tax =
    benefits?.reduce((total, benefit) => total + benefit.vatAmount, 0) || 0;
  const vatAmount = tax;
  const totalAmount = subtotal + tax;
  return {
    subtotal,
    vatAmount,
    totalAmount,
  };
};

export const converEndrosmentData = (
  endorsementData: RedisDataResponse,
  quoteEndorsementNumber: string,

): ResponsePaymentOption => {

  let amountData: number = 0;

  if (endorsementData?.benefitsPremiumData && endorsementData?.benefitsPremiumData?.length > 0) {
    const amountValues = getTotalSubTotal(endorsementData?.benefitsPremiumData, {
      subtotal: endorsementData?.totalAmount?.subtotal,
      vatAmount: endorsementData?.totalAmount?.vatAmount,
      totalAmount: endorsementData?.totalAmount?.totalAmount,
    });
    amountData = amountValues?.totalAmount;
  } else if (endorsementData?.driversPremiumData && endorsementData?.driversPremiumData?.length > 0 && endorsementData?.totalAmount) {
    const amountValues = convertDriverData(endorsementData?.driversPremiumData, endorsementData?.totalAmount);
    amountData = amountValues?.totalAmount;
  }

  return {
    nationalId: endorsementData?.nationalId,
    premiumDue: amountData || 0,
    quoteEndorsementNumber: quoteEndorsementNumber,
    customerNameEnglish: endorsementData?.customerNameEn ?? "",
    customerNameArabic: endorsementData?.customerNameAr ?? "",
    mobileNumber: endorsementData?.mobileNumber,
    email: endorsementData?.email,
    amountWithoutTax: endorsementData?.totalAmount?.subtotal || Number(endorsementData?.subtotal || "0") || 0,
    taxAmount: endorsementData?.totalAmount?.vatAmount || Number(endorsementData?.vatAmount || "0") || 0,
  };
};

export const convertDriverData = (drivers: AddDriverProps[], endoDriverData: PremiumDriverProps): PremiumBreakdownProps => {
  const driverData = drivers.map(val => {
    return {
      benefitNameEn: val?.driver?.driverName ?? "",
      benefitPrice: val?.taxableAmount,
      isSelected: true,
    }
  });

  return {
    subtotal: endoDriverData?.taxableAmount ?? endoDriverData?.subtotal ?? 0,
    vatAmount: endoDriverData?.vatAmount,
    totalAmount: endoDriverData?.totalAmount,
    driverData,
  };
};
