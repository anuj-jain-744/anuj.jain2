import { useState, useEffect } from "react";
import StepsProgress from "components/StepsProgress";
import BuyProductLayout from "components/BuyProductLayout";
import "./index.scss";
import useLanguageData from "Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";

import ValidateVehicle from "Motor/QuoteAndBuy/ValidateVehicle/ValidateVehicle";
import VehicleDetailSection from "Motor/QuoteAndBuy/VehicleDetails/VehicleDetailSection";
import ReviewQuotation from "Motor/QuoteAndBuy/ReviewQuotation/ReviewQuotation";
import UserCard from "Motor/QuoteAndBuy/UserCard/UserCard";
import { QuoteAndBuyProvider } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { CombinedData, LanguageData } from "types/languageData";
import { PaymentRightSide } from "components/PaymentRightSide";
import CoveragePlan from "Motor/QuoteAndBuy/CoveragePlan";
import CoveragePlanRight from "Motor/QuoteAndBuy/CoveragePlan/CoveragePlanRight";
import { stepProgressRenew } from "Motor/QuoteAndBuy/CoveragePlan/CommonFunction/CommonFunction";
import { useLocation } from 'react-router-dom';

interface MotorInsuranceProps {
  navigateTo?: (url: string) => void;
  productName?: string;
}

const MotorInsurance: React.FC<MotorInsuranceProps> = ({ navigateTo, productName }) => {
  const location = useLocation();
 const { isValidPolicy, isValidParam} = location.state.data;
  const [stepValue, setStepValue] = useState(0);
  const [leftStep, setLeftStep] = useState(isValidParam && isValidPolicy ? 2 : 0);
  const [renewStep, setRenewStep] = useState(0);


  const {
    languageData,
  } = useLanguageData();

  const leftSide = () => {
    switch (leftStep) {
      case 0:
        return (
          <ValidateVehicle
            data={languageData || {}}
            setLeftStep={setLeftStep}
          />
        );
      case 1:
        return <VehicleDetailSection languageData={languageData} leftStep={leftStep} setLeftStep={setLeftStep} navigateTo={navigateTo}/>
      case 2:
        return <CoveragePlan languageData={languageData} />;
      case 3:
        return <ReviewQuotation languageData={languageData as CombinedData} leftStep={leftStep} setLeftStep={setLeftStep}/>;

      default:
        return <></>;
    }
  };

  const rightSide = () => {
    switch (leftStep) {
      case 0:
      case 1:
        return <UserCard languageData={languageData} />;
      case 2:
        return <CoveragePlanRight languageData={languageData} />;
      case 3:
        return <PaymentRightSide 
        languageData={languageData as LanguageData} 
        setLeftStep={setLeftStep}
        leftStep={leftStep}
        />;
      default:
        return <></>;
    }
  };

  const onClickhandler = () => {
    setStepValue(2);
  };

  useEffect(() => {
    if(leftStep === 3)
      setStepValue(2);
    if(leftStep === 2)
      setStepValue(1);
    if(leftStep < 2)
      setStepValue(0);
  }   , [leftStep]);
  return (
    <div className="quote-buy-container" data-testid="quote-buy">
      {leftStep !== 4 && (
        <>
        <StepsProgress
        progressData={
              //coverage_plan_for_renew
              isValidParam && isValidPolicy
                ? Object.values(
                    stepProgressRenew(languageData?.motorBuySteps ?? {}) ?? {}
                  )
                : Object.values(languageData?.motorBuySteps ?? {})
            }
        currentStep={isValidParam && isValidPolicy ? renewStep: stepValue}
        onClickhandler={onClickhandler}
      />
      <QuoteAndBuyProvider>
        <BuyProductLayout
          leftPanel={leftSide()}
          rightPanel={rightSide()}
          leftStep={leftStep}
          languageData={languageData as LanguageData}
          setLeftStep={setLeftStep}
          navigateTo={navigateTo}
          isValidPolicy={isValidPolicy}
          isValidParam={isValidParam}
          renewPolicyData={location.state.data} //renewPolicyData
          setRenewStep={setRenewStep}
          prodID={productName}
        />
      </QuoteAndBuyProvider>
      </>
      )}
    </div>
  );
};

export { MotorInsurance };
