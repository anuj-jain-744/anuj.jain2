import { FC, useEffect, useMemo } from "react";
import StepsProgress from "components/StepsProgress";
import "./index.scss";
import ReviewQuotation from "Motor/QuoteAndBuy/ReviewQuotation/ReviewQuotation";
import UserCard from "Motor/QuoteAndBuy/UserCard/UserCard";
import { QuoteAndBuyProvider } from "Motor/QuoteAndBuy/QuoteAndBuyContext";
import { CombinedData, LanguageData } from "types/languageData";
import { PaymentRightSide } from "components/PaymentRightSide";
import CoveragePlan from "Motor/QuoteAndBuy/CoveragePlan";
import CoveragePlanRight from "Motor/QuoteAndBuy/CoveragePlan/CoveragePlanRight";
import Success from "Motor/SuccessPage";
import { useLocation } from "react-router-dom";
import { stepProgressToRenew } from 'utils/quoteAndBuy'


//New Added for Home
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { PHQuoteBuyLayout } from "Layout/PHQuoteBuyLayout";
import { NationalAddressCard } from "components/NationalAddressCard";

interface Props {
  configData?: LanguageData | null;
  productName?: string;
  navigateTo: () => void;
}

const PersonalHomeQuoteAndBuy: FC = ({ configData, productName, navigateTo }: Props) => {
  const {
    setHomeConfig,
    leftStep,
    stepValue,
    setLeftStep,
    setUserDetails,
    quotation,
    homePolicyRenewal,
  } = usePHQuoteBuyContext();
  const { homeBuySteps } = configData;

  configData['isLatest'] = 'home';
  const location = useLocation();
  const propsData = location?.state?.data;


  useEffect(() => {
    setHomeConfig(configData);
    setUserDetails(location?.state?.data);
  }, [configData]);

  const leftSide = useMemo(() => {
    switch (leftStep) {
      case 1:
        return <NationalAddressCard addressData={propsData?.addressData} />;
      case 2:
        return <CoveragePlan languageData={configData} />;
      case 3:
        return (
          <ReviewQuotation
            languageData={configData as CombinedData}
            leftStep={leftStep}
            setLeftStep={setLeftStep}
          />
        );

      default:
        return <></>;
    }
  }, [leftStep]);

  const rightSide = useMemo(() => {
    switch (leftStep) {
      case 1:
        return <UserCard languageData={configData} />;
      case 2:
        return <CoveragePlanRight languageData={configData} />;
      case 3:
        return <PaymentRightSide languageData={configData as LanguageData} />;
      default:
        return <></>;
    }
  }, [leftStep]);

  useEffect(() => {
    if (propsData?.policyNumber && !homePolicyRenewal) {
      setLeftStep(2);
    }
  }, [propsData?.policyNumber, homePolicyRenewal])

  const homeSteps = Object.values(propsData?.policyNumber ? stepProgressToRenew(homeBuySteps) : homeBuySteps);

  return (
    <div className="shared-quote-buy-container" data-testid="quote-buy">
      {leftStep === 4 && <Success status="success" data={quotation} flag={true} languageData={configData} />}
      {leftStep !== 4 && (
        <>
          <StepsProgress
            progressData={homeSteps}
            currentStep={stepValue}
          />
          <QuoteAndBuyProvider>
            <PHQuoteBuyLayout
              leftPanel={leftSide}
              rightPanel={rightSide}
              languageData={configData}
              navigateTo={navigateTo}
              prodID={productName}
            />
          </QuoteAndBuyProvider>
        </>
      )}
    </div>
  );
};

export { PersonalHomeQuoteAndBuy };
