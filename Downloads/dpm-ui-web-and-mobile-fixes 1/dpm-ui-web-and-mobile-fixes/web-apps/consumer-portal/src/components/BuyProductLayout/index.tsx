import React, { useEffect, useState } from "react";
import "./index.scss";
import BuyProductFooter from "components/BuyProductFooter";
import { LanguageData } from "types/languageData";
import { deepCopy, updateCalculatePremiumPayload, updateGenerateQuotePayload } from "utils/quoteAndBuy";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { isValidEmail, useApiCall } from "@dpm/shared-module";
import { AlertBox } from "components/AlertBox";
import { OTPWrapper } from "components/OTPValidation/OtpWrapper";
import { useLocation } from "react-router-dom";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import ResumeJourney from "components/ResumeJourney";
import useSaveRedisData from "hook/common/useSaveRedisData";
import { JAVA_API_ROUTES } from 'constant';

interface LayoutProps {
  leftPanel: JSX.Element;
  rightPanel: JSX.Element;
  leftStep: number;
  languageData: LanguageData | null;
  setLeftStep: (step: number) => void;
  navigateTo?: (url: string, data: unknown) => void;
  prodID?: string;
}

interface ApiError {
  title: string | undefined;
  description: string | undefined;
}

const vehicleType = "Motor";

const Layout: React.FC<LayoutProps> = ({
  leftPanel,
  rightPanel,
  leftStep,
  languageData,
  setLeftStep,
  navigateTo,
  prodID
}) => {
  const [isPaymentButtonDisabled, setIsPaymentButtonDisabled] = useState<boolean>(false)
  const requestPayload = useCalculatePremiumPayload();
  const location = useLocation();
  const [resumeJourney, setResumeJourney] = useState<boolean>(false);

  const propsData = location?.state?.data;

  const [callGenerateOtp, setCallGenerateOtp] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<ApiError>({
    title: "",
    description: ""
  });
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [isEnableReviewQuotation, setIsEnableReviewQuotation] = useState<boolean>(false);

  const {
    isTermCondition,
    email,
    coverageType,
    repairTypeSelected,
    sliderValueDeductibles,
    journeyData, 
    vehicleDetails, 
    setRepairTypeSelected,
    schemeCode,
    setJourneyData,
    setRedisKey,
    addDriverFormData,
    selectedBenefits,
    sliderValueSumInsured,
    setCoverageType,
    setProductName,
  } = useQuoteAndBuyContext();

  useEffect(() => setProductName(prodID ?? ""), [prodID, setProductName]);

  const { saveRedisData } = useSaveRedisData();
  const uniqueKey =
    propsData?.ownerId?.toString() +
    propsData?.mobileNumber?.toString() +
    vehicleType;

  
  
  const { makeApiCall: redisKey, data: redisData } = useApiCall<{key: string}, undefined>(
    6,
    `${JAVA_API_ROUTES?.redisGetValue}/${uniqueKey}`,
    "get",
  );

  const { handleCalculatePremium, isAllError: calculatePremiumError, isLoadingCalculatePremium, isCalculateData} = useCalculatePremiumApi();

  const apiUrl = `/Generate/Quote/${
    coverageType === "comprehensive" ? "Comp" : "TP"
  }`;
  const { makeApiCall, data, errors, isLoading } = useApiCall<{model: unknown}, unknown>(3, apiUrl, "post");

  const handleSelectCoverage = async () => {
    try {
      if (requestPayload) {
        handleCalculatePremium(requestPayload);
      }
    } catch (error) {
      console.error("One or more Calculate premium API calls failed:", error);
    }
  };

  const getReparCondition = (repairCondition: string) => {
    switch (repairCondition) {
      case "Workshop Repair":
        return 2;
      case "Agency Repair":
        return 1;
      case "Mawthoq Repair":
        return 3;
      case "thirdParty":
        return 3;
    }
  }

  const handleMakePayment = async () => {
    if (isTermCondition && isValidEmail(email ??"") ) {
      setCallGenerateOtp(true);
    }
  };

  const handleOnContinueJourney = () => {
    setResumeJourney(false);
  };

  const handleNewQuotation = () => {
    setResumeJourney(false);
  };

  const handleClose = () => {
    setShowAlertModal(false);
  };

  const handleBackBtn = () => {
    if(leftStep === 2) {
      setCoverageType(null);
      setRepairTypeSelected(null);
    }
    setLeftStep(leftStep - 1);
  };

  const productFooter = () => {
    switch (leftStep) {
      case 1:
        return (
          <BuyProductFooter
            classNames={isLoadingCalculatePremium ? "make-btn-payment": "make-btn-payment-active"}
            languageData={languageData as LanguageData}
            isBackButtonHide={true}
            handleOnClickHandler={handleSelectCoverage}
            isDisabledButton={isLoadingCalculatePremium}
            buttonTitle={
              languageData?.select_coverage
                ? languageData?.select_coverage.toString()
                : ""
            }
          />
        );
      case 2: 
        return (
          <BuyProductFooter
            classNames={!isEnableReviewQuotation ? "make-btn-payment": "make-btn-payment-active" } 
            languageData={languageData as LanguageData}
            isBackButtonHide={false}
            handleOnClickHandler={() => {
              saveRedisData("multiValue", {
                coverageType,
                repairTypeSelected,
                sliderValueDeductibles,
                selectedBenefits,
                sliderValueSumInsured,
                schemeCode,
                email
              }, 3);
              setLeftStep(3);
            }}
            isDisabledButton={!isEnableReviewQuotation}
            buttonTitle={
              languageData?.review_quotation
                ? languageData?.review_quotation.toString()
                : ""
            }
            handleBackBtn={handleBackBtn}
          />
        )
      case 3:
        return (
          <BuyProductFooter
            classNames={isPaymentButtonDisabled || isLoading ? "make-btn-payment": "make-btn-payment-active" }
            languageData={languageData as LanguageData}
            isBackButtonHide={false}
            handleOnClickHandler={handleMakePayment}
            isDisabledButton={isPaymentButtonDisabled || isLoading}
            buttonTitle={
              languageData?.make_payment
                ? languageData?.make_payment.toString()
                : ""
            }
            handleBackBtn={handleBackBtn}
          />
        );
      default:
        return <></>;
    }
  };

  
  const handleSuccessValidation = async (sliderValueDeductibles: string, sliderValueSumInsured: string) => {
    let payloadData = null;
      if(coverageType === "comprehensive") {
        payloadData = await updateCalculatePremiumPayload(
          "repairCondition",
          getReparCondition(repairTypeSelected),
          deepCopy(requestPayload)
        );
        payloadData = await updateGenerateQuotePayload(
          "vehicleValue",
          sliderValueSumInsured,
          deepCopy(payloadData)
        );
        payloadData = await updateGenerateQuotePayload(
          "deductibleAmount",
          sliderValueDeductibles,
          deepCopy(payloadData)
        );
      } else if(coverageType === "thirdparty") {  
        payloadData = await updateCalculatePremiumPayload(
          "repairCondition",
          2,
          deepCopy(requestPayload)
        );
      }
      
      payloadData = await updateGenerateQuotePayload(
        "email",
        email,
        deepCopy(payloadData)
      );
      
      if(selectedBenefits && selectedBenefits.length > 0) {
        const data = selectedBenefits?.filter((value)=>value.title).map((val) => {
          return {
            benefitCode: val?.code ?? "",
            benefitPrice: val?.price ?? "",
            benefitNameEn: val?.title ?? "",
          };
        });
        payloadData = await updateGenerateQuotePayload(
          "benefits",
          data ?? [],
          deepCopy(payloadData)
        );
      }
    await makeApiCall(payloadData);
  }
  
  useEffect(() => {
    if(!resumeJourney && !journeyData && propsData?.ownerId)
      redisKey();
  }, [resumeJourney, journeyData, redisKey, propsData?.ownerId]);

  useEffect(() => {
    if (redisData) {
      setJourneyData(typeof (redisData) === "string" ? redisData : JSON.stringify(redisData));
      setResumeJourney(true);
    } else {
      setResumeJourney(false);
    }
  }, [redisData, setJourneyData]);

  useEffect(() => {
    setRedisKey(uniqueKey);
  },[uniqueKey]);

  useEffect(() => {
     if (isCalculateData) {
      saveRedisData(
        "multiValue", {
          driverDetails: addDriverFormData,
          vehicleFormDetails: vehicleDetails,
        },
        2
      );
      setLeftStep(2);
     }
  }, [isCalculateData, setLeftStep]);

  useEffect(() => {
    if (calculatePremiumError) {
      setApiErrorMessage({
        title: languageData?.internal_server_error,
        description: languageData?.something_went_wrong,
      });
      setShowAlertModal(true);
    }
  }, [calculatePremiumError, isLoadingCalculatePremium]);
  
  useEffect(() => {
     if (isCalculateData) {
      setLeftStep(2);
     }
  }, [isCalculateData, setLeftStep]);

  useEffect(() => {
    if(data) {
      saveRedisData("multiValue", {
        quotationData: data?.model,
      }, 3);
      setCallGenerateOtp(false);
      navigateTo && navigateTo("/Product/insurance-payment", 
        {
          quoteData: data?.model,
          userInfo: propsData,
          productCode: '01'
        });
    } 
    if(errors) {
      console.error(errors);
      setApiErrorMessage({
        title: errors?.name || "Error",
        description: errors.messages?.message_en ?? ""
      });
      setShowAlertModal(true);
    }
  }, [data, errors]);

  useEffect(()=> {
    setIsPaymentButtonDisabled(!(isTermCondition && isValidEmail(email ?? "")));
  },[isTermCondition, email]);

  useEffect(() => {
    if(coverageType === "comprehensive") {
      if(repairTypeSelected) {
        setIsEnableReviewQuotation(true);
      } else {
        setIsEnableReviewQuotation(false);
      }
    } else if(coverageType === "thirdparty") { 
      setIsEnableReviewQuotation(true);
    } else {
      setIsEnableReviewQuotation(false);
    }
  }, [repairTypeSelected, coverageType]);

  return (
    <div className="quote-container-motor">
      {languageData && (
        <ResumeJourney
          show={resumeJourney}
          onContinue={handleOnContinueJourney}
          onNew={handleNewQuotation}
          languageData={languageData}
          setLeftStep={setLeftStep}
        />
      )}
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      />
      {languageData && (
        <OTPWrapper 
          generateOtpUrl={"GenerateOtp"} 
          validateOtpUrl={"ValidateOtp"} 
          languageData={{
            enter_otp_code: languageData.enter_otp_code,
            your_otp_will_expire: languageData.your_otp_will_expire,
            confirm_otp: languageData.confirm_otp,
            resend_otp: languageData.resend_otp,
          }}
          handleSuccessValidation={() => {
            handleSuccessValidation(sliderValueDeductibles, sliderValueSumInsured)
          }}
          payload={{
            mobileNumber: propsData?.mobileNumber,
          }}
          callGenerateOtp={callGenerateOtp}
          setCallGenerateOtp={setCallGenerateOtp}
        />
      )}
      <div className="leftPanel">{leftPanel}</div>
      <div className="rightPanel">{rightPanel}</div>
      {productFooter()}
    </div>
  );
};

export default Layout;
