import CardOptions from "./CardOptions";
import { PaymentOptionProp } from "pages/payment-insurance";
import StcURPayPayment from "./StcURPayPayment";
import { CmsPayment } from "./types/cmsPayment";
import { useApiCall } from "@dpm/shared-module";
import { useEffect, useState } from "react";
import { PaymentProvider, PaymentProviderMethods, ResponsePaymentOption } from "./types/providerPayment";
import { LanguageData } from "types/languageData";
import { getPaymentProviderArr } from "utils/paymentUtils";
import SadadOptions from "./SadadOptions";

interface PaymentOptionsProps {
  readonly productCode: string;
  readonly option: string;
  readonly paymentData: CmsPayment;
  readonly optionData: PaymentOptionProp;
  readonly languageData: LanguageData;
  readonly quoteData: ResponsePaymentOption | null;
  readonly mobileNumber: string;
  readonly navigateTo?: (url: string, navigate: any) => void;
  readonly premiumInfo: {
    premiumDue: number;
    finalPremium: number;
    taxFeeBreakdowns: {
      amount: number;
      percentage: number;
    }[];
  };
}

export default function PaymentOptions({
  productCode,
  option,
  paymentData,
  optionData,
  quoteData,
  languageData,
  mobileNumber,
  navigateTo,
  premiumInfo
}: PaymentOptionsProps) {
  const { makeApiCall, data: paymentProvider } = useApiCall<PaymentProvider, unknown>(5, "paymentProviderAndMethodDetails", "get");
  const [paymentMethods, setPaymentMethods] = useState<PaymentProviderMethods[]>([]);

  useEffect(() => {
    makeApiCall();
  }, []);

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
            {quoteData && <SadadOptions productCode={productCode} paymentMethods={paymentMethods} quoteData={quoteData} premiumInfo={premiumInfo} paymentData={paymentData}/>}
          </div>
        );
      case "debit":
        return (
          <>
            {quoteData &&
              <CardOptions
                productCode={productCode}
                paymentData={paymentData}
                optionData={optionData}
                quoteData={quoteData}
                paymentMethods={paymentMethods}
                languageData={languageData}
              />
            }
          </>
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
      case "ur_pay":
        return (
          quoteData &&
          <StcURPayPayment
            productCode={productCode}
            payType={"installment"}
            paymentData={paymentData}
            quoteData={quoteData}
            paymentMethods={paymentMethods}
            languageData={languageData}
            mobileNumber={mobileNumber}
            navigateTo={navigateTo}
          />
        );
      case "stc_pay":
        return (
          quoteData &&
          <StcURPayPayment
            productCode={productCode}
            payType={"stc_pay"}
            paymentData={paymentData}
            quoteData={quoteData}
            paymentMethods={paymentMethods}
            languageData={languageData}
            mobileNumber={mobileNumber}
            navigateTo={navigateTo}
          />
        );
      default:
        return <></>;
    }
  }
  return (
    <>
      {quoteData && getCardData(option)}
    </>
  );
}
