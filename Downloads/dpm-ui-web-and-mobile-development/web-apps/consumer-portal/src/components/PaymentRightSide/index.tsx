import PolicyStartDate from "components/PolicyStartDate";
import PremiumBreakUp from "components/PremiumBreakUp";
import { LanguageData } from "types/languageData";
import "./index.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { IThirdParty } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";
import {useApiCall} from "@dpm/shared-module";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { PromoCodeResponse } from "types/promoCodeType";
import { useEffect } from "react";
import RenewalPolicy from "components/RenewalPolicy";

interface PaymentRightSideProps {
  languageData?: LanguageData;
}

export const PaymentRightSide = ({ languageData }: PaymentRightSideProps) => {
  const { repairTypeSelected, coverageType, homePremiumResponse } = useQuoteAndBuyContext();
  const { homePolicyRenewal } = usePHQuoteBuyContext();
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  const { makeApiCall, data } = useApiCall<PromoCodeResponse, unknown>(
    1,
    "promo-code-config",
    "get"
  );

  let subtitle: string | undefined = ''
  if (coverageType === IThirdParty) {
    subtitle = languageData?.third_party;
  }else if (repairTypeSelected && coverageType) {    
    if (isHome) {
      subtitle = languageData?.title;
    } else {
      subtitle = languageData?.comprehensive;
    }
  }

  useEffect(() => {
    makeApiCall();
  }, []);

  return (
    <div className="payment-right-side-container">
      <PolicyStartDate languageData={languageData} isCalendarIcon={true}  />
      {homePolicyRenewal && languageData &&
        < span className="w-100 py-2">
          <RenewalPolicy languageData={languageData} isReviewPage={true} />
        </span>
      }
      {subtitle ? (
        <PremiumBreakUp
          languageData={languageData}
          title={languageData?.order_summary as string}
          subtitle={subtitle}
          data={data}
        />
      ) : ''}
    </div>
  );
};
