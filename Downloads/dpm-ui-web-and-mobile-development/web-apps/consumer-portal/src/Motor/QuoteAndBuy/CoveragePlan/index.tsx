import React, { useEffect, useState } from "react";
import CoveragePlanLeft from "./CoveragePlanLeft";
import { LanguageData } from "types/languageData";
import { resetCoverageCodePayload } from "utils/quoteAndBuy";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import { compensationTypeCard,getRepairCondition,formatDOB } from "./CommonFunction/CommonFunction";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { IComprehensive, IThirdParty, Contents } from "./ConstantValue/ConstantValue";
import { useApiCall } from "@dpm/shared-module";
import { JAVA_API_ROUTES } from "../../../constant";
import { DriverDetailsResponseData, VehicleDetailsResponseData } from "types/quoteAndBuy";
import { DriverDetailsRequest } from "types/DriverDetailsApi";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";
import { AlertBox } from "../../../components/AlertBox";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import useViewPolicyCall from "./hook/useViewPolicyCall";
interface ICoveragePlanProps {
  languageData: LanguageData | undefined | null;
  isRepairTypeChecked?: boolean;
}

const CoveragePlan: React.FC<ICoveragePlanProps> = ({ languageData }) => {
  const { 
    setRepairTypeSelected, 
    coverageType, 
    setCoverageType, 
    repairTypeSelected,
    requestPayload, 
    updateRequestPayload, 
    homePremiumResponse, 
    isRenewpolicy,
    viewPolicyData,
    isRenewPolicyData 
  } = useQuoteAndBuyContext();

  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;
  const { formAddressSelection } = usePHQuoteBuyContext();
  let coveragePlanData = isHome ? languageData?.coverage_plan : languageData?.comprehensive_third_party
  const propertyType = Number(formAddressSelection?.propertyType?.activeIndex);
  if (isHome && propertyType === 1) { // home use case of rental house property type
    coveragePlanData = languageData?.coverage_plan.filter((item) => item.key === Contents);
  }
  const Coverageplandata: ICoveragePlanData[] =
    coveragePlanData as unknown as ICoveragePlanData[];
  //coverage plan selected card state
  const [isRepairTypeChecked, setIsRepairTypeChecked] = useState(false);
  //confirmation alert whether user wants to really switch coverage plan
  const [isCoverageTypeDowngrading, setCoverageTypeDowngrading] =
    useState(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: "",
    classes: ""
  });


const handleClose = () => {
  setShowAlertModal(false);
};

const handleSetCoverageType = (coverageName: string) => {
  setCoverageType(coverageName as CompensationTypeKeys);
};



const { viewPolicyCall } = useViewPolicyCall({
  setShowAlertModal,
  setApiErrorMessage,
});



  useEffect(() => {
    const drivers = viewPolicyData?.policyLob?.[0]?.policyRisk?.[0]?.drivers;
      if (Array.isArray(drivers) && drivers.length > 0) {
      // setIsAllLoaded(true);
    }
  },[viewPolicyData]);

  useEffect(() => {

    if (isRenewPolicyData && viewPolicyData) {
      viewPolicyCall(viewPolicyData);
    }
  }, [viewPolicyData, isRenewPolicyData]);

// renew policy Ends

// coverage Plan Starts
  const onchangeHandlerCoveragePlanType = (title: string) => {
    // call common fn that returns which banner card selected
    const res = compensationTypeCard(
      title?.split(" ")?.join("")?.toLocaleLowerCase() as CompensationTypeKeys
    );
    const coverageType = res?.toLocaleLowerCase() as CompensationTypeKeys;
    if (isHome) {
      setRepairTypeSelected(null);
      const updatedPayload = resetCoverageCodePayload(requestPayload, languageData?.defaultCoverageCode);
      updateRequestPayload(updatedPayload);
    }
    setCoverageType(coverageType as CompensationTypeKeys);
    // const repairType
  };

  const handleRepairTypeChecked = (checked: boolean) => {
    setIsRepairTypeChecked(repairTypeSelected);
  };


  useEffect(() => {
    // set as default plan which is higher coverage rate for owned house property type
    if (isHome) {
      if (propertyType === 0) {
        const homeCoveragePlans: [] = languageData?.coverage_plan?.map((item) => (item.key));
        let maxPricePlans = {};

        homeCoveragePlans?.forEach((item) => {
          const coverageType = Object.keys(languageData?.[item]?.[0] ?? {});
          const premiumResponse: Record<string, any> = {
            [coverageType[1]]: homePremiumResponse[coverageType[1]],
            [coverageType[2]]: homePremiumResponse[coverageType[2]]
          };
          const prices = calculatePremium(premiumResponse);
          maxPricePlans[item] = prices.maxFinalPrice;
        })
        const maxPlan = Object.keys(maxPricePlans).reduce((a, b) => maxPricePlans[a] > maxPricePlans[b] ? a : b);
        setCoverageType(maxPlan);
      }
      else {
        setCoverageType(Contents);
      }
    }
  }, []);


  useEffect(() => {
    if (isRenewpolicy){
      if (coverageType) {
       onchangeHandlerCoveragePlanType(coverageType.toLowerCase() as CompensationTypeKeys);
      }
    }
  }, [coverageType,isRenewpolicy]);

  useEffect(() => {
    // updating use context for selected coverage type
    if (coverageType) {
      setCoverageType(coverageType);
      if (coverageType === IThirdParty) {
        setRepairTypeSelected(null);
        //show alert for confirmation whether user wants to really switch coverage plan only for renew
        if (isRenewpolicy) {
          setCoverageTypeDowngrading(true);
        }
      }
    }
  }, [setRepairTypeSelected, coverageType,isRenewpolicy]);

  // renew downgrade modal dialog handler
  const onclickHandlerRenewDowngrade = async (val: string) => {
    switch (val) {
      case "close":
      case "cancel":
        // set coverage type to comprehensive only
        setCoverageType(IComprehensive as CompensationTypeKeys);
        // to set modal dialog to close state
        setCoverageTypeDowngrading(false);
        break;
      case "switch":
        // set coverage type to thirdparty
        setCoverageType(IThirdParty as CompensationTypeKeys);
        // to set modal dialog to close state
        setCoverageTypeDowngrading(false);
        break;
    }
  };


  return (
    <div data-testid="CoveragePlan-test">
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
        classes= {apiErrorMessage.classes}
      />
      {/* for left content */}
      <CoveragePlanLeft
        languageData={languageData}
        coveragePlanData={Coverageplandata}
        onChange={onchangeHandlerCoveragePlanType}
        //selected card
        coveragePlanSelected={coverageType}
        onRepairTypeChecked={handleRepairTypeChecked}
        //for renew coverage type downgrade alert
        isCoverageTypeDowngrading={isCoverageTypeDowngrading}
        clickHandlerRenewDowngrade={onclickHandlerRenewDowngrade}
      />
    </div>
  );
};


export default CoveragePlan;
