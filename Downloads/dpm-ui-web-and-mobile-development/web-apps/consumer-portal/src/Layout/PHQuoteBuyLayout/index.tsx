import { useEffect, useState } from "react";
import { BackFooter } from "components/index";
import { LanguageData } from "types/languageData";
import { usePHQuoteBuyContext } from "context/PHQuoteBuyContext";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { deepCopy, ucFirstAllWords, updateCalculatePremiumPayload } from "utils/quoteAndBuy";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { useLocation } from "react-router-dom";
import { AlertBox } from "components/AlertBox";
import { formatDate, apiFormatDate } from "utils/formatDate";
import { isValidEmail, useApiCall } from "@dpm/shared-module";
import { useCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import usePropertyPayload from "Home/QuoteAndBuy/hooks/usePropertyPayload";
import { useUploadFile } from "Home/QuoteAndBuy/hooks/useUploadFile";
import { apiRoutes, PREMIUM_DATA, commonKeywords, HOME_COVERAGE_PLANS_TYPES, JAVA_API_ROUTES, HOME } from "constant";
import QuotationHandling from "components/QuotationHandling";
import useSaveRedisData from "hook/common/useSaveRedisData";
import PanelRight from "components/PanelRight";

import "./index.scss";

interface LayoutProps {
  leftPanel: JSX.Element;
  rightPanel: JSX.Element;
  languageData: LanguageData;
  navigateTo: () => void;
  prodID?: string;
}

export const PHQuoteBuyLayout: React.FC<LayoutProps> = ({ leftPanel, rightPanel, languageData, navigateTo, prodID }) => {
  const {
    homeConfig,
    showCanvas,
    setDisableLink,
    setShowCanvas,
    setLeftStep,
    stepValue,
    leftStep,
    setStepValue,
    disableLink,
    apiErrorMessage,
    setApiErrorMessage,
    showAlertModal,
    setShowAlertModal,
    resetApiErrorMessage,
    formAddressSelection,
    setFormAddressSelection,
    showPropertyMap,
    buildYearError,
    loading,
    setLoading,
    quotation,
    setQuotation,
    propertyPhotos,
    selectedContetBenefits,
    setSelectedContetBenefits,
    declaration,
    homePolicyRenewal,
    setHomePolicyRenewal
  } = usePHQuoteBuyContext();

  const {
    journeyData,
    setJourneyData,
    setRedisKey,
    homePremiumResponse,
    setHomePremiumResponse,
    isTermCondition,
    email,
    repairTypeSelected,
    setRepairTypeSelected,
    coverageType,
    setCoverageType,
    requestPayload,
    selectedBenefits,
    updateRequestPayload,
    policyStartDate,
    setProductName,
    schemeCode
  } = useQuoteAndBuyContext();

  useEffect(() => setProductName(prodID ?? ""), [prodID, setProductName]);

  const {
    declareOptions
  } = commonKeywords;

  const location = useLocation();
  const propsData = location?.state?.data;
  const [resumeJourney, setResumeJourney] = useState<boolean>(false);

  const { init, getRiskID, userAddressFormSelection, updateDeclarationItems, renewalPayloadRequest, contentBenefitsDeclaration } = usePropertyPayload();
  const { makeApiCall: uploadPhotos } = useUploadFile();

  const { back, selectCoverage, summaryTabLabel, review_quotation, get_quote_pay } =
    homeConfig;

  const { saveRedisData } = useSaveRedisData();

  const uniqueKey =
    propsData?.ownerId?.toString() +
    propsData?.mobileNumber?.toString() +
    HOME;

  const footerLanguage = {
    back: back,
    step1: selectCoverage,
    step2: review_quotation,
    step3: get_quote_pay
  };

  const { makeApiCall: redisKey, data: redisData } = useApiCall<{ key: string }, undefined>(
    6,
    `${JAVA_API_ROUTES?.redisGetValue}/${uniqueKey}`,
    "get",
  );

  const handleModalClose = () => {
    setShowAlertModal(false);
    setApiErrorMessage(resetApiErrorMessage);
    if (viewPoilcyError || (homePolicyRenewal && isError)) {
      navigateTo && navigateTo('/Dashboard');
    }
  }

  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);

  // set viewPolicy hooks for policy renewal use cases
  const { makeApiCall: viewPoilcy, data: viewPoilcyData, errors: viewPoilcyError, isLoading: viewPoilcyLoading } = useApiCall(10, apiRoutes.homeViewPolicy, "post");

  // set directDraft hooks for creating policy quotation 
  const { makeApiCall, data: directDraft, errors, isLoading: directDraftLoading } = useApiCall(10, apiRoutes.homeDirectDraft, "post");

  // set calculate premium hooks
  const { handleCalculatePremium, isError, isLoadingCalculatePremium, data } = useCalculatePremiumApi()

  const handleBackClick = () => {
    if (leftStep === 2) {
      setCoverageType(null);
      setRepairTypeSelected(null);
    }
    setStepValue((prev: number) => prev - 1);
    setLeftStep((prev: number) => prev - 1);
  };

  // add the content benefits items to the payload request if not added it in existing payload
  const makeDeclarationItems = (data: [], declarationItems: { itemDescription: string, sarValue: string }[]) => {
    data.forEach((item: { category: string, value: string }) => {
      const checkInItem = declarationItems.findIndex(value => value.itemDescription === item.category);
      if (checkInItem === -1) {
        declarationItems.push({ itemDescription: item.category, sarValue: item.value })
      }
    })
    return declarationItems;
  }

  // update the payload request for content benefits and policy start date
  const updatePremiumPayload = async (requestPayload, policyStartDate: string | null) => {
    if (selectedContetBenefits.length) {
      const policyCoverage = requestPayload.policyRisk[0].policyCoverage;
      const declarationIndex = policyCoverage.findIndex((data) => data.coverageCode === languageData?.defaultCoverageCode)
      // if content benefits already existing in payload, need to add new content benefits too.
      if (!policyCoverage[declarationIndex].declarationItem) {
        policyCoverage[declarationIndex]['declarationItem'] = [];
      }
      makeDeclarationItems(selectedContetBenefits, policyCoverage[declarationIndex].declarationItem)
    }
    // update the policy start date in request payload
    if (policyStartDate) {
      requestPayload.effectiveDate = apiFormatDate(policyStartDate, '/');
    }
    await handleCalculatePremium(requestPayload);
  }

  const handleLinkClick = async () => {
    if (leftStep === 1) {
      setLoading(true);
      let payload = init();
      if (requestPayload && Object.keys(requestPayload).length > 0) {
        payload = requestPayload;
      }
      const currrentDate = formatDate(new Date());
      const payloadScheme = userAddressFormSelection(payload, formAddressSelection, propsData, showPropertyMap, languageData, currrentDate)
      updateRequestPayload(payloadScheme);
      saveRedisData("multiValue", {
        formAddressSelection,
        payloadScheme
      }, 2, false);
      await handleCalculatePremium(payloadScheme);
    }
    if (leftStep === 2 && repairTypeSelected) {
      updatePremiumPayload(requestPayload, policyStartDate);
      if (!homePolicyRenewal) {
        const savedRedisData = {
          coverageType,
          repairTypeSelected,
          selectedBenefits,
          selectedContetBenefits,
          policyStartDate,
          propertyPhotos,
          payloadScheme: requestPayload,
        };
        if (schemeCode) { // save the scheme code in redis if available
          savedRedisData['schemeCode'] = schemeCode;
        }
        saveRedisData("multiValue", savedRedisData, 3, false);
      }
    }
    if (leftStep === 3 && repairTypeSelected && isTermCondition && isValidEmail(email)) {
      const declare = Array.isArray(languageData?.personarrary)
        ? languageData?.personarrary
        : []
      const riskID = getRiskID(homePremiumResponse, repairTypeSelected, languageData?.defaultCoverageCode);
      const payloadScheme = updateDeclarationItems(requestPayload, declaration, declare, riskID)
      updateRequestPayload(payloadScheme);
      setCallGenerateOtp(true);
    }
  };


  const handleOnContinueJourney = () => {
    setResumeJourney(false);
  };

  const handleNewQuotation = () => {
    setResumeJourney(false);
  };

  // call the view policy api to get the policy related things based on policy number.
  useEffect(() => {
    if (propsData?.policyNumber && !homePolicyRenewal) {
      setLoading(true);
      viewPoilcy({
        apiSource: "Portal",
        policyNo: propsData?.policyNumber,
        endorsementNo: "",
        isLatestSnapshot: "N"
      });
    }
  }, [propsData?.policyNumber, homePolicyRenewal])

  // create a premium payload request related to policy renewal changes stored in the context 
  const setPolicyRenewalChanges = async (policyData) => {
    const payloadScheme = renewalPayloadRequest(policyData, languageData);
    updateRequestPayload(payloadScheme);
    const policyForm = policyData?.policyLob[0];
    const policyRisk = policyForm?.policyRisk[0];
    const primaryAddress = policyData?.policyCustomer[0]?.primaryAddress;
    const propertyOptions = languageData?.property_form_values_string?.type_form?.option;
    const propertyNo = Number(policyForm?.ownerOrTenant) - 1;
    const coverageValue = policyForm?.planCode?.replace(/\s+/g, '').toLowerCase() || null;

    setFormAddressSelection((prev) => ({
      ...prev,
      propertyFloor: policyRisk?.noOfFloors,
      propertyBuildYear: policyRisk?.yearOfConstruction,
      propertyType: { activeIndex: propertyNo, activeLabel: propertyOptions[propertyNo] }
    }));

    setHomePolicyRenewal({
      policyNumber: propsData?.policyNumber,
      expiryDate: policyData?.policyBasic.expiryDate,
      existingPremium: policyData?.policyBasic?.premiumInfo,
      contentBenefits: contentBenefitsDeclaration(policyRisk?.policyCoverage, languageData),
      coverageType: ucFirstAllWords(policyForm?.planCode),
      coveragePlan: coverageValue && HOME_COVERAGE_PLANS_TYPES[coverageValue],
      primaryAddress: primaryAddress
    })

    await handleCalculatePremium(payloadScheme);
  }


  // trigger the useEffect to set the policy renewal changes getting from view policy API for policy renewal
  useEffect(() => {
    if (viewPoilcyData && !viewPoilcyLoading && !repairTypeSelected && !coverageType) {
      setPolicyRenewalChanges(viewPoilcyData);
    }
  }, [viewPoilcyData, viewPoilcyLoading])

  // trigger the useEffect if view policy API getting failed for policy renewal
  useEffect(() => {
    if (viewPoilcyError) {
      setLoading(false);
      setShowAlertModal(true);
      setApiErrorMessage({
        title: viewPoilcyError?.name || languageData?.internal_server_error,
        description: viewPoilcyError.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [viewPoilcyError])

  // convert the array structure from payload request to additional benefits functionality updated
  function renameBenefits(benefits: { itemDescription: string, sarValue: string }[]) {
    const replaceBenefits: { category: string, value: string }[] = [];
    benefits?.forEach((obj) => (
      replaceBenefits?.push({
        'category': obj?.itemDescription,
        'value': obj.sarValue
      })
    ));
    return replaceBenefits;
  }

  // trigger the useEffect to call the calculation premium API showed the price under coverage plan and type
  useEffect(() => {
    if (data && !isError && !isLoadingCalculatePremium) {
      setLoading(false);
      if (leftStep === 1 && !homePolicyRenewal) {
        setStepValue(1);
        setLeftStep(2);
      }
      if (leftStep === 2 && coverageType) {
        if (homePolicyRenewal) { // for renewal case, only two steps are there, so the step value starts from one
          setStepValue(1);
        } else {
          setStepValue(2);
        }
        setLeftStep(3);
      }
      if (leftStep === 2 && homePolicyRenewal && !coverageType) { // policy renewal 
        setCoverageType(homePolicyRenewal?.coveragePlan);
        setRepairTypeSelected(homePolicyRenewal?.coverageType);
        if (homePolicyRenewal?.contentBenefits) {
          const benefits = renameBenefits(homePolicyRenewal?.contentBenefits)
          setSelectedContetBenefits(benefits);
        }
      }
      setHomePremiumResponse(data);
    }
  }, [data, isError, isLoadingCalculatePremium])

  useEffect(() => {
    if (isError && isLoadingCalculatePremium) {
      setLoading(false);
      setShowAlertModal(true);
      setApiErrorMessage({
        title: isError?.name || languageData?.internal_server_error,
        description: isError.messages?.message_en ?? languageData?.something_went_wrong,
      });
    }
  }, [isError, isLoadingCalculatePremium])

  //Use this to handle the steps
  useEffect(() => {
    const contentBenefits = selectedContetBenefits?.filter((item) => (!item?.category || !item?.value) || (item?.errors && (item?.errors?.category || item?.errors?.value)))
    let validateDeclaration: boolean = true;
    if (leftStep === 3) {
      const declare = Array.isArray(languageData?.personarrary)
        ? languageData?.personarrary
        : []
      const mandatoryDecalredItems = declare?.filter((item) => {
        const selectedItems = declaration && declareOptions[declaration[item.key]];
        return selectedItems && item?.value && item?.value !== selectedItems
      });
      validateDeclaration = mandatoryDecalredItems?.length === 0;
    }
    if (leftStep === 1 &&
      (buildYearError === null || buildYearError === "") &&
      formAddressSelection?.propertyBuildYear !== ""
    ) {
      setDisableLink(false);
    } else if (leftStep === 2 && repairTypeSelected && !contentBenefits.length) {
      setDisableLink(false);
    } else if (leftStep === 3 && isTermCondition && validateDeclaration && isValidEmail(email ?? "")) {
      setDisableLink(false);
    } else {
      setDisableLink(true);
    }
  }, [
    buildYearError,
    formAddressSelection.propertyBuildYear,
    isTermCondition,
    email,
    stepValue,
    repairTypeSelected,
    selectedContetBenefits,
    coverageType,
    declaration,
  ]);

  useEffect(() => {
    if (directDraft) {
      setQuotation(directDraft);
      if (!homePolicyRenewal) {
        saveRedisData('multivalue', { quotation }, 3, false);
      }
      if (propertyPhotos && propertyPhotos.length > 0) {
        uploadPhotos(propertyPhotos, directDraft?.quoteNo);
      }
      navigateTo && navigateTo("/product/insurance-payment",
        {
          quoteData: directDraft,
          userInfo: propsData,
          productCode: '02'
        });
    }
    if (errors) {
      setApiErrorMessage({
        title: errors?.name || languageData?.internal_server_error,
        description: errors.messages?.message_en ?? languageData?.something_went_wrong
      });
      setShowAlertModal(true);
    }
  }, [directDraft, errors]);

  useEffect(() => {
    if (!propsData?.policyNumber) {
      setRedisKey(uniqueKey);
    }
  }, [])

  useEffect(() => {
    if (!resumeJourney && !journeyData && propsData?.ownerId && !propsData?.policyNumber)
      redisKey();
  }, [resumeJourney, journeyData, redisKey, propsData?.ownerId, homePolicyRenewal]);

  useEffect(() => {
    if (redisData) {
      setJourneyData(typeof (redisData) === "string" ? redisData : JSON.stringify(redisData));
      setResumeJourney(true);
    } else {
      setResumeJourney(false);
    }
  }, [redisData, setJourneyData]);

  // in policy renewal case,if not updated the renewal information in local store the application shows as null
  if (propsData?.policyNumber && !homePolicyRenewal) {
    return null;
  }
  return (
    <div className="quote-container">
      <QuotationHandling
        show={resumeJourney}
        onContinue={handleOnContinueJourney}
        onNew={handleNewQuotation}
        languageData={homeConfig}
        setLeftStep={setLeftStep}
      />
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleModalClose}
      />

      <OTPWrapper
        generateOtpUrl={"GenerateOtp"}
        validateOtpUrl={"ValidateOtp"}
        languageData={{
          enter_otp_code: languageData.enter_otp_code,
          your_otp_will_expire: languageData.your_otp_will_expire,
          confirm_otp: languageData.confirm_otp,
          resend_otp: languageData.resend_otp,
        }}
        handleSuccessValidation={async () => {
          setCallGenerateOtp(false)
          const coverageType: string = repairTypeSelected.replace(/\s+/g, '').toLowerCase();
          const payloadScheme = updateCalculatePremiumPayload(
            "planCode",
            PREMIUM_DATA[coverageType],
            deepCopy(requestPayload)
          );
          await makeApiCall(payloadScheme);
        }}
        payload={{
          mobileNumber: propsData?.mobileNumber,
        }}
        callGenerateOtp={callGenerateOtp}
        setCallGenerateOtp={setCallGenerateOtp}
      />
      <div className="leftPanel">
        {/* Use below to render panel heading based on step */}
        {leftPanel}
      </div>
      <div className="rightPanel"><PanelRight>{rightPanel}</PanelRight></div>
      <BackFooter
        isBackBtnDisabled={(propsData?.policyNumber && leftStep === 2) || leftStep === 1}
        disableLinkButton={disableLink}
        isQuoteAndBuy={true}
        isQuoteLoading={loading || directDraftLoading}
        stepValue={leftStep}
        languageData={footerLanguage}
        handleBackClick={handleBackClick}
        handleLinkClick={handleLinkClick}
      />
    </div>
  );
};
