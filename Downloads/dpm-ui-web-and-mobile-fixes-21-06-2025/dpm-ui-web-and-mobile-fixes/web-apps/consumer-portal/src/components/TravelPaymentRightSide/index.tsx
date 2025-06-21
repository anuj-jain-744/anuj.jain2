import PolicyStartDate from "components/PolicyStartDate";
import TravelPremiumBreakUp from "components/TravelPremiumBreakUp/index";

import { LanguageData } from "types/languageData";
import "./index.scss";

interface PaymentRightSideProps {
  languageData?: LanguageData;
  leftStep: any;
}

export const TravelPaymentRightSide = ({ languageData, leftStep }: PaymentRightSideProps) => {
  return (
    <div className="payment-right-side-container">
      <PolicyStartDate languageData={languageData} />
      <TravelPremiumBreakUp languageData={languageData}  
                title={languageData?.premium_breakup as string}
                subtitle=""
                producttype="Travel"
                leftStep={leftStep} 
                
                />
    </div>
  );
};
