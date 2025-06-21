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
import { JAVA_API_ROUTES, MOTOR } from 'constant';
import { RenewPolicyDataProps} from "types/quoteAndBuy";

interface LayoutProps {
  leftPanel: JSX.Element;
  rightPanel: JSX.Element;
  leftStep: number;
  languageData: LanguageData | null;
  setLeftStep: (step: number) => void;
  navigateTo?: (url: string, data: unknown) => void;
  isValidPolicy:boolean;
  isValidParam:boolean;
  renewPolicyData: RenewPolicyDataProps;
  setRenewStep?: (value: number) => void;
  prodID?: string;
}

interface ApiError {
  title: string | undefined;
  description: string | undefined;
}

const Layout: React.FC<LayoutProps> = ({
  leftPanel,
  rightPanel,
  leftStep,
  languageData,
  setLeftStep,
  navigateTo,
  isValidPolicy,
  isValidParam,
  renewPolicyData,
  setRenewStep,
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
    setQuoteNumber,
    setExpiryDate,
    setReferanceNumber,
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
    setIsRenewpolicy,
   isRenewpolicy,
    setIsRenewPolicyData,
    setProductName,
    premium,
  } = useQuoteAndBuyContext();

  useEffect(() => setProductName(prodID ?? ""), [prodID, setProductName]);

  const { saveRedisData } = useSaveRedisData();
  const uniqueKey =
    propsData?.ownerId?.toString() +
    propsData?.mobileNumber?.toString() +
    MOTOR;

  const { makeApiCall: redisKey, data: redisData } = useApiCall<{key: string}, undefined>(
    6,
    `${JAVA_API_ROUTES?.redisGetValue}/${uniqueKey}`,
    "get",
  );

  const { handleCalculatePremium, isAllError: calculatePremiumError, isLoadingCalculatePremium, isCalculateData, errorResponse} = useCalculatePremiumApi();

  const apiUrl = `/Generate/Quote/${
    coverageType === "comprehensive" ? "Comp" : "TP"
  }`;
  const { makeApiCall, data, errors, isLoading } = useApiCall<{model: unknown}, unknown>(3, apiUrl, "post");

  const handleSelectCoverage = async () => {
    setShowAlertModal(false);
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
      case "Agency Repair":
        return 1;
      case "Workshop Repair":
        return 2;
      case "Mawthoq Repair":
        return 3;
      case "thirdParty":
        return null;
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
    (isValidParam && isValidPolicy && setRenewStep) && setRenewStep(0);

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
            //isBackButtonHide={false}
            isBackButtonHide={isValidPolicy && isValidParam}
            handleOnClickHandler={() => {
              (isValidParam && isValidPolicy && setRenewStep) && setRenewStep(1);
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

              if (isValidPolicy && isValidParam && setRenewStep) {
                setRenewStep(2);
              }

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

  useEffect(() => {
    setIsRenewpolicy(isValidParam && isValidPolicy);
    if (isValidParam && isValidPolicy) {
      setIsRenewPolicyData(renewPolicyData);
    }
  }, [isValidPolicy,isValidParam,setIsRenewpolicy,renewPolicyData]);

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
        const data = selectedBenefits?.filter((value)=>value.benefitNameEn).map((val) => {
          return {
            benefitCode: val?.benefitCode ?? "",
            benefitPrice: val?.benefitPrice ?? "",
            benefitNameEn: val?.benefitNameEn ?? "",
            benefitCategory: val?.benefitCategory?? "",
            benefitId: val?.benefitId?? "",
            benefitNameAr: val?.benefitNameAr ?? "",
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
      const data = typeof (redisData) === "string" ? redisData : JSON.stringify(redisData);
      const parsedData = JSON.parse(data);
      if(parsedData?.expiryDate) {
        if(new Date() > new Date(parsedData?.expiryDate)) {
          saveRedisData("empty", null, 1);
          setResumeJourney(false);
          return;
        }
      }
      setJourneyData(data);
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
        title: errorResponse?.name ?? languageData?.internal_server_error,
        description: errorResponse?.message ?? languageData?.something_went_wrong,
      });
      setShowAlertModal(true);
    }
  }, [calculatePremiumError, errorResponse, languageData]);

  useEffect(() => {
    if (isCalculateData) {
      setShowAlertModal(false);
      setLeftStep(2);
    }
  }, [isCalculateData, setLeftStep]);

  useEffect(() => {
    if(data) {
      setQuoteNumber(data?.model?.quoteNo);
      setExpiryDate(data?.model?.quotationExpiryDate);
      setReferanceNumber(data?.model?.quoteReferenceNo);
      saveRedisData("multiValue", {
        quoteNumber:data?.model?.quoteNo,
        expiryDate:data?.model?.quotationExpiryDate,
        referanceNumber:data?.model?.quoteReferenceNo
      }, 3);
      setCallGenerateOtp(false);
      navigateTo && navigateTo("/Product/insurance-payment",
        {
          quoteData: data?.model,
          userInfo: propsData,
          productCode: '01'
        });
        setShowAlertModal(false);
    }
    if(errors) {
      setApiErrorMessage({
        title: errors?.name || "Error",
        description: errors.messages?.message_en ?? ""
      });
      setShowAlertModal(true);
    }
  }, [data, errors]);

  useEffect(()=> {
    setIsPaymentButtonDisabled(!(isTermCondition && isValidEmail(email ?? "") && premium > 0));
  },[isTermCondition, email, premium]);

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
      {languageData && !isRenewpolicy && (
        <ResumeJourney
          redisData={redisData}
          show={resumeJourney}
          onContinue={handleOnContinueJourney}
          onNew={handleNewQuotation}
          languageData={languageData}
          setLeftStep={setLeftStep}
          navigateTo={navigateTo}
        />
      )}
      { showAlertModal && <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      /> }
      {languageData && (
        <OTPWrapper
          generateOtpUrl={"GenerateOtp"}
          validateOtpUrl={"ValidateOtp"}
          languageData={{
            enter_otp_code: languageData?.enter_otp_code,
            your_otp_will_expire: languageData?.your_otp_will_expire,
            confirm_otp: languageData?.confirm_otp,
            resend_otp: languageData?.resend_otp,
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