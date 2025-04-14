import CardOptions from "./CardOptions";
import { PaymentOptionProp } from "pages/payment-insurance";
import { ViewQuoteResponse } from "types/viewQuote";
import { CmsPayment } from "./types/cmsPayment";
import { useApiCall } from "@dpm/shared-module";
import { useEffect, useState } from "react";
import { PaymentProvider, PaymentProviderMethods } from "./types/providerPayment";
import { LanguageData } from "types/languageData";
import { getPaymentProviderArr } from "utils/paymentUtils";

interface PaymentOptionsProps {
  readonly productCode: string;
  readonly option: string;
  readonly paymentData: CmsPayment;
  readonly optionData: PaymentOptionProp;
  readonly quoteData: ViewQuoteResponse;
  readonly languageData: LanguageData;
}
export default function PaymentOptions({
  productCode,
  option,
  paymentData,
  optionData,
  quoteData,
  languageData
}: PaymentOptionsProps) {
  const { makeApiCall, data: paymentProvider } = useApiCall<PaymentProvider, unknown>(5, "paymentProviderAndMethodDetails", "get");
  const [paymentMethods, setPaymentMethods] = useState<PaymentProviderMethods[]>([]);
  useEffect(() => {
    makeApiCall();
  }, [])

  useEffect(() => {
    if (paymentProvider) {
      const data = getPaymentProviderArr(paymentProvider);
      setPaymentMethods(data);
    }
  }, [paymentProvider]);
  const getCardData = (option: string) => {
    switch (option) {
      case "sadad":
        return (
          <div>
            <h1>Sadad</h1>
          </div>
        );
      case "debit":
        return (
          <CardOptions
            productCode={productCode}
            paymentData={paymentData}
            optionData={optionData}
            quoteData={quoteData}
            paymentMethods={paymentMethods}
            languageData={languageData}
          />
        );
      case "monthly_options":
        return (
          <div>
            <h1>Monthly Options</h1>
          </div>
        );
      case "wallets":
        return (
          <div>
            <h1>Wallets</h1>
          </div>
        );
      default:
        return <></>;
    }
  }
  return (
    <>
      {getCardData(option)}
    </>
  );
}
