 
import { useState, useEffect } from "react";
import "./index.scss";
import StepsProgress from "components/StepsProgress";
import BuyProductLayout from "components/BuyProductLayoutTravel";
import UserCard from "Motor/QuoteAndBuy/UserCard/UserCard";
import { LanguageData, TravelData } from "types/languageData"; // LanguageData,
import TravelSucces from "components/TravelSucces";
import useLanguageData from "Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import { useApiCall } from "@dpm/shared-module";
import TravelCoveragePlanRight from "components/QuoteAndBuy/CoveragePlan/TravelCoveragePlanRight";
import { TravelPolicyProvider } from "pages/travel/Policy-services/PolicyContext";
interface TravelAPIResponse {
  config: TravelData;
}

const TravelInsurance: React.FC = () => {

  const [stepValue, setStepValue] = useState(0);
  const [leftStep, setLeftStep] = useState(0);
  const [travelData, setTravelData] = useState<TravelData>();

  const { data, makeApiCall } = useApiCall<TravelAPIResponse, undefined>(
    1,
    "travel-config",
    "get"
  );
  useEffect(() => {
    makeApiCall();
  }, []);

  useEffect(() => {
    if (data) {
      setTravelData(data?.config);
    }
  }, [data]);
  const { languageData } = useLanguageData();

  const rightSide = () => {
    switch (leftStep) {
      case 0:
      case 1:
        return <UserCard languageData={languageData} />;
      case 2:
        return <TravelCoveragePlanRight languageData={travelData} leftStep={leftStep} />;
      case 3:
        return <TravelCoveragePlanRight languageData={travelData} leftStep={leftStep} />; 
      case 4:
        return <TravelCoveragePlanRight languageData={travelData} leftStep={leftStep}  />;
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
    <div
      className="containertravelquote"
      data-testid="quote-buy"
    >
      {leftStep === 5 && 
      
      <TravelPolicyProvider>
      <TravelSucces status={true}  data={travelData} flag={true} />
      </TravelPolicyProvider>
      
      }
      {leftStep !== 5 && (
        <>
          <StepsProgress
            progressData={Object.values(travelData?.travelBuySteps ?? {})}
            currentStep={stepValue}
            onClickhandler={onClickhandler}
          />
          
            <BuyProductLayout
              rightPanel={rightSide()}
              leftStep={leftStep}
              languageData={travelData as LanguageData}
              setLeftStep={setLeftStep}
            />
          
        </>
      )}
    </div>
  );
};

export default TravelInsurance;
