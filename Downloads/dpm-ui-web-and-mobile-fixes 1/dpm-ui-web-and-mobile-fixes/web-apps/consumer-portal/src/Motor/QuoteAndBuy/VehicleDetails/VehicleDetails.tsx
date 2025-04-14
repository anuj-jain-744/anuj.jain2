import React, { useEffect, useState } from "react";
import style from "./VehicleDetails.module.scss";
import VehicleDetailSection from "./VehicleDetailSection";
import UserCard from "../UserCard/UserCard";
import ValidateVehicle from "../ValidateVehicle/ValidateVehicle";
import useLanguageData from "Motor/Policy-services/AccessPolicyDocuments/hooks/useLanguageData";
import ErrorPage from "components/ErrorComponent/Error";
import ReviewQuotation from "../ReviewQuotation/ReviewQuotation";
import CoveragePlan from "../CoveragePlan";
import PolicyStartDate from "../../../components/PolicyStartDate";
import VehicleInformation from "../CoveragePlan/CoveragePlanRight/VehicleInformation"; 
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";   
import PremiumBreakUp from "../../../components/PremiumBreakUp";
import DidYouKnowPlain from "../CoveragePlan/Components/DidYouKnowPlain";
import SumInsuredDeductibleCard from "../CoveragePlan/Components/SumInsuredDeductibleCard";

interface VehicleDetailsProps {
  navigateTo?: (url: string) => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ navigateTo }) => {
  const {
    languageData,
    isLoading: isLanguageLoading,
    error: languageError,
  } = useLanguageData();
  
  const [vehicleDetail, setVehicleDetail] = useState({});
  const { stepValue, setStepValue, repairTypeSelected, coverageType } =
    useQuoteAndBuyContext();
  
  const renderStep = () => {
    switch (stepValue) {
      case 0:
        return (
          <ValidateVehicle
            data={languageData || {}}
            setVehicleDetail={setVehicleDetail}
            setStepValue={setStepValue}
          />
        );
      case 1:
        return (
          <VehicleDetailSection
            navigateTo={navigateTo}
            languageData={languageData}
          />
        );
      case 2:
        return <CoveragePlan languageData={languageData} />;
      case 3:
        return <ReviewQuotation languageData={languageData} />;
      default:
        return null;
    }
  };

  if (languageError) {
    return <ErrorPage />;
  }
  

  return (
    <div className={style.container}>
      <div className={style.leftPanel}>{renderStep()}</div>
      <div className={style.rightPanel}>
        <UserCard languageData={languageData} />

        {stepValue === 2 && (
          <React.Fragment>
            {/* for coverage right content */}
            <span className="w-100 pt-2">
              <PolicyStartDate languageData={languageData} />
            </span>
            <span className="w-100 py-2">
              <VehicleInformation languageData={languageData} />
            </span>
            {repairTypeSelected && (
              <span className="w-100 py-2">
                <SumInsuredDeductibleCard />
              </span>
            )}
            <span className="w-100 py-2">
              {repairTypeSelected ? (
                <PremiumBreakUp
                languageData={languageData}
                title={languageData?.premium_breakup as string}
                subtitle={languageData?.comprehensive as string}
              />
              ):(coverageType === "thirdparty" && (
                <PremiumBreakUp
                  languageData={languageData}
                  title={languageData?.premium_breakup as string}
                  subtitle={languageData?.third_party as string}
                />))}
            </span>
            <DidYouKnowPlain languageData={languageData} />
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
