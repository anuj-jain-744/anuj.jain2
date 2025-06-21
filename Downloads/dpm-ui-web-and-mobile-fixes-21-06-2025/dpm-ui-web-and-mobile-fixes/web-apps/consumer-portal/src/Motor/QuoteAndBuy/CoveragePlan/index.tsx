import React, { useEffect, useState } from "react";
import CoveragePlanLeft from "./CoveragePlanLeft";
import { LoaderOverlay } from "@app-shell/components/Loader";
import { LanguageData } from "types/languageData";
import { resetCoverageCodePayload } from "utils/quoteAndBuy";
import { calculatePremium } from "Home/QuoteAndBuy/utils/calculatePremium";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import { CompensationTypeKeys, ICoveragePlanData } from "types/coverageplan";
import { compensationTypeCard } from "./CommonFunction/CommonFunction";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { IComprehensive, IThirdParty, Contents } from "./ConstantValue/ConstantValue";
import { AlertBox } from "../../../components/AlertBox";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import useViewPolicyCall from "./hook/useViewPolicyCall";
import { CalculatePremiumApiPayload } from "types/HomeCalculatePremiumApiPayload";

interface ICoveragePlanProps {
  languageData: LanguageData | undefined | null;
}

interface StateEventProps {
  payloadRequest: CalculatePremiumApiPayload | null;
  errorTitle?: string | undefined;
  errorDescription?: string | undefined;
  loading: boolean;
}

const CoveragePlan: React.FC<ICoveragePlanProps> = ({ languageData }) => {
  const {
    setRepairTypeSelected,
    coverageType,
    setCoverageType,
    requestPayload,
    updateRequestPayload,
    homePremiumResponse,
    setHomePremiumResponse,
    isRenewpolicy,
    viewPolicyData,
    isRenewPolicyData,
    selectedBenefits,
    setSelectedBenefits,
    isTpOnly
  } = useQuoteAndBuyContext();

  // set calculate home premium hooks
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data: homeCalculatePremiumResponse } = useCalculatePremiumApi();
  const [homePremiumHandling, setHomePremiumHandling] = useState<StateEventProps>({
    payloadRequest: null,
    errorTitle: "",
    errorDescription: "",
    loading: false
  });

  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;
  const { formAddressSelection, selectedContetBenefits, setSelectedContetBenefits } = usePHQuoteBuyContext();
  let coveragePlanData = isHome ? languageData?.coverage_plan : languageData?.comprehensive_third_party
  const propertyType = Number(formAddressSelection?.propertyType?.activeIndex);
  if (isHome && propertyType === 1) { // home use case of rental house property type
    coveragePlanData = languageData?.coverage_plan.filter((item) => item.key === Contents);
  }
  const Coverageplandata: ICoveragePlanData[] =
    coveragePlanData as unknown as ICoveragePlanData[];
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

  const handleClosePremium = () => {
    setHomePremiumHandling((prevprops) => ({
      ...prevprops,
      errorTitle: "",
      errorDescription: "",
    }));
  }


  const { viewPolicyCall } = useViewPolicyCall({
    setShowAlertModal,
    setApiErrorMessage,
  });



  useEffect(() => {
    const drivers = viewPolicyData?.policyLob?.[0]?.policyRisk?.[0]?.drivers;
    if (Array.isArray(drivers) && drivers.length > 0) {
      // setIsAllLoaded(true);
    }
  }, [viewPolicyData]);

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
      const updatedPayload = resetCoverageCodePayload(requestPayload, languageData?.defaultCoverageCode);
      if (selectedContetBenefits?.length || selectedBenefits?.length) {
        handleCalculatePremium(updatedPayload);
        setHomePremiumHandling((prevprops) => ({ ...prevprops, payloadRequest: updatedPayload, loading: true }));
      } else {
        setRepairTypeSelected(null);
        updateRequestPayload(updatedPayload);
      }
    }
    setCoverageType(coverageType as CompensationTypeKeys);
    // const repairType
  };

  // trigger the useEffect to call the calculation premium API showed the price under coverage plan and type
  useEffect(() => {
    if (homeCalculatePremiumResponse && !isError && !isLoadingCalculatePremium && homePremiumHandling?.payloadRequest) {
      updateRequestPayload(homePremiumHandling.payloadRequest);
      setRepairTypeSelected(null);
      setSelectedContetBenefits([]);
      setSelectedBenefits([]);
      setHomePremiumHandling((prevprops) => ({ ...prevprops, payloadRequest: null, loading: false }));
      setHomePremiumResponse(homeCalculatePremiumResponse);
    }
  }, [homeCalculatePremiumResponse, isError, isLoadingCalculatePremium, homePremiumHandling])

  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setHomePremiumHandling((prevprops) => ({
        ...prevprops, loading: false,
        errorTitle: isError?.name || languageData?.internal_server_error,
        errorDescription: isError.messages?.message_en ?? languageData?.something_went_wrong,
      }));
    }
  }, [isError, isLoadingCalculatePremium])

  useEffect(() => {
    // set as default plan which is higher coverage rate for owned house property type
    if (isHome) {
      if (propertyType === 0) {
        const homeCoveragePlans: [] = languageData?.coverage_plan?.map((item) => (item.key));
        const maxPricePlans = {};

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
    if (isRenewpolicy) {
      if (coverageType) {
        onchangeHandlerCoveragePlanType(coverageType.toLowerCase() as CompensationTypeKeys);
      }
    }
  }, [coverageType, isRenewpolicy]);

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
  }, [coverageType, isRenewpolicy]);

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

 // for Third party & Renew policy case only
  useEffect(() => {
    if (isRenewpolicy && isTpOnly && coverageType) {
      setCoverageType(IThirdParty as CompensationTypeKeys);
      setCoverageTypeDowngrading(false);
    }
  }, [isTpOnly, isRenewpolicy, coverageType])


  return (
    <div data-testid="CoveragePlan-test">
      {homePremiumHandling.loading && <LoaderOverlay />}
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
        classes={apiErrorMessage.classes}
      />
      <AlertBox
        title={homePremiumHandling.errorTitle}
        description={homePremiumHandling.errorDescription}
        showAlertModal={Boolean(homePremiumHandling.errorTitle && homePremiumHandling.errorDescription)}
        setShowAlertModal={handleClosePremium}
        classes={apiErrorMessage.classes}
      />
      {/* for left content */}
      <CoveragePlanLeft
        languageData={languageData}
        coveragePlanData={Coverageplandata}
        onChange={onchangeHandlerCoveragePlanType}
        //selected card
        coveragePlanSelected={coverageType}
        //for renew coverage type downgrade alert
        isCoverageTypeDowngrading={isCoverageTypeDowngrading}
        clickHandlerRenewDowngrade={onclickHandlerRenewDowngrade}
      />
    </div>
  );
};


export default CoveragePlan;
