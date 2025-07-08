import React from "react";
import EditPolicyStartDateCard from "components/Travel/EditPolicyStartDateCard/EditPolicyStartDateCard";
import TravelInformation from "components/TravellerInformation/index";
import TravelPremiumBreakUp from "components/TravelPremiumBreakUp/index";
import DidYouKnowPlain from "Motor/QuoteAndBuy/CoveragePlan/Components/DidYouKnowPlain";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { TRAVEL } from "constant";
import "./index.scss";
import { LanguageData } from "types/languageData";

interface Props {
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
  leftStep: number;
  setLeftStep: (step: number) => void;
}

const TravelCoveragePlanRight = ({
  langData,
  leftStep,
  setLeftStep,
}: Props) => {
  const { travelcoverageType, travelcoveragePlan } = useQuoteAndBuyContext();

  return (
    <React.Fragment>
      <span className="w-100 py-2">
        <EditPolicyStartDateCard
          languageData={langData.product}
          setLeftStep={setLeftStep}
        />
      </span>
      <span className="w-100 py-2">
        <TravelInformation languageData={langData.product} />
      </span>
      {travelcoverageType && travelcoveragePlan ? (
        <span className="w-100 py-2">
          <TravelPremiumBreakUp
            langData={langData}
            title={langData.product?.premium_breakup}
            subtitle=""
            producttype="Travel"
            leftStep={leftStep}
          />
        </span>
      ) : (
        <></>
      )}
      <span className="w-100 py-2">
        <DidYouKnowPlain languageData={langData.product} productCode={TRAVEL} />
      </span>
    </React.Fragment>
  );
};

export default TravelCoveragePlanRight;
