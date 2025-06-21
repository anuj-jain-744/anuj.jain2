import React from "react";
import { LanguageData } from "types/languageData";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import DidYouKnowPlain from "Motor/QuoteAndBuy/CoveragePlan/Components/DidYouKnowPlain";
import PolicyStartDate from "components/PolicyStartDate/index";
import TravelInformation from "components/TravellerInformation/index";
import TravelPremiumBreakUp from "components/TravelPremiumBreakUp/index";
import "./index.scss";
import { productIDs } from "../../../../../../corporate-portal/src/constant"
import EditPolicyStartDateCard from "components/Travel/EditPolicyStartDateCard/EditPolicyStartDateCard";


interface ICoveragePlanRightProps {
  languageData: LanguageData | undefined | null;
  leftStep: number;
  setLeftStep: (step: number) => void
}

const TravelCoveragePlanRight: React.FC<ICoveragePlanRightProps> = ({
  languageData,
  leftStep,
  setLeftStep
}) => {
  const { travelcoverageType, travelcoveragePlan } = useQuoteAndBuyContext();

  return (
    <React.Fragment>
      <span className="w-100 py-2">
        <EditPolicyStartDateCard languageData={languageData} setLeftStep={setLeftStep} />
      </span>
      <span className="w-100 py-2">
        <TravelInformation languageData={languageData} />
      </span>
      {travelcoverageType && travelcoveragePlan ? (
        <span className="w-100 py-2">
          <TravelPremiumBreakUp languageData={languageData}
            title={languageData?.premium_breakup as string}
            subtitle=""
            producttype="Travel"
            leftStep={leftStep}
          />
        </span>
      ) : (<></>)}
      <span className="w-100 py-2">
        <DidYouKnowPlain languageData={languageData} />
      </span>
    </React.Fragment>
  );
};

export default TravelCoveragePlanRight;
