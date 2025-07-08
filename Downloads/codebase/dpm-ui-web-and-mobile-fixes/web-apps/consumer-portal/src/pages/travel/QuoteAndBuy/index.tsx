import { useState, useEffect } from "react";
import { TravelPolicyProvider } from "pages/travel/Policy-services/PolicyContext";
import TravelSucces from "components/TravelSucces";
import StepsProgress from "components/StepsProgress";
import BuyProductLayout from "components/BuyProductLayoutTravel";
import UserCard from "Motor/QuoteAndBuy/UserCard/UserCard";
import TravelCoveragePlanRight from "components/QuoteAndBuy/CoveragePlan/TravelCoveragePlanRight";
import "./index.scss";
import { LanguageData } from "types/languageData";

interface Props {
  langData: {
    consumer: LanguageData;
    product: LanguageData;
  };
}

const TravelInsurance = ({ langData }: Props) => {
  const [stepValue, setStepValue] = useState(0);
  const [leftStep, setLeftStep] = useState(0);

  const rightSide = () => {
    switch (leftStep) {
      case 0:
      case 1:
        return <UserCard languageData={langData.consumer} />;
      case 2:
      case 3:
      case 4:
        return (
          <TravelCoveragePlanRight
            langData={langData}
            leftStep={leftStep}
            setLeftStep={setLeftStep}
          />
        );
      default:
        return <></>;
    }
  };

  const onClickhandler = () => {
    setStepValue(2);
  };

  useEffect(() => {
    if (leftStep === 4) setStepValue(3);
    if (leftStep === 3) setStepValue(2);
    if (leftStep === 2) setStepValue(1);
    if (leftStep < 2) setStepValue(0);
  }, [leftStep]);

  return (
    <div className="containertravelquote" data-testid="quote-buy">
      {leftStep === 5 && (
        <TravelPolicyProvider>
          <TravelSucces status={true} data={langData.product} flag={true} />
        </TravelPolicyProvider>
      )}
      {leftStep !== 5 && (
        <>
          <StepsProgress
            progressData={Object.values(langData.product?.travelBuySteps ?? {})}
            currentStep={stepValue}
            onClickhandler={onClickhandler}
          />
          <BuyProductLayout
            rightPanel={rightSide()}
            leftStep={leftStep}
            languageData={langData.product}
            setLeftStep={setLeftStep}
          />
        </>
      )}
    </div>
  );
};

export default TravelInsurance;
