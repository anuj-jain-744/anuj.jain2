import PolicyStartDate from "components/PolicyStartDate";
import PremiumBreakUp from "components/PremiumBreakUp";
import { LanguageData } from "types/languageData";
import "./index.scss";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { IThirdParty } from "Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue";

interface PaymentRightSideProps {
  languageData?: LanguageData;
}

export const PaymentRightSide = ({ languageData }: PaymentRightSideProps) => {
  const { repairTypeSelected, coverageType, homePremiumResponse } = useQuoteAndBuyContext();
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

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
  return (
    <div className="payment-right-side-container">
      <PolicyStartDate languageData={languageData} isCalendarIcon={true}  />
      {subtitle ? (
        <PremiumBreakUp
          languageData={languageData}
          title={languageData?.order_summary as string}
          subtitle={subtitle}
        />
      ) : ''}
    </div>
  );
};
