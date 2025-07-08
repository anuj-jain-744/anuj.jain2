import BuyProductHeading from "components/BuyProductHeading";
import { Modal, ModalBody } from "react-bootstrap";
import promoCodeIcon from "./../../assets/QuoteAndBuy/promoCodeIcon.svg";
import "./index.scss";
import { OptionPromoCard } from "./OptionPromoCard";
import { useEffect, useState } from "react";
import { isValidEmail, useApiCall } from "@dpm/shared-module";
import { useQuoteAndBuyContext } from "components/hooks/useQuoteAndBuyContext";
import { PromoCodeConfigResponse } from "components/PremiumBreakUp";
import { JAVA_API_ROUTES, TRAVELER } from "../../constant";
import { PromoCodeRequest, PromoCodeResponse, PromoCodeScheme } from "types/promoCodeType";
import { useCalculatePremiumApi } from "hook/motor/useCalculatePremiumApi";
import { useCalculatePremiumApi as homeUseCalculatePremiumApi } from "hook/home/useCalculatePremiumApi";
import useCalculatePremiumPayload from "Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload";
import SuccessCelebration from "./successCelebration";
import { CalculatePremiumPayload } from "types/CalculatePremiumApiPayload";

interface PromoCodeProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  promoCodeHeading: string;
  languageData: PromoCodeConfigResponse;
  setCallGenerateOtp: (val: boolean) => void;
  emailVal: string;
  setEmailVal: (val: string) => void;
  isCouponApplied: boolean;
  setIsCouponApplied: (val: boolean) => void;
  productType?: string;
  setLeftStep?: (val: number) => void;
}

export function Promocode({
  isOpen,
  setIsOpen,
  promoCodeHeading,
  languageData,
  setCallGenerateOtp,
  emailVal,
  setEmailVal,
  isCouponApplied,
  setIsCouponApplied,
  productType,
  setLeftStep
}: Readonly<PromoCodeProps>) {

  const [promoCodeValue, setPromoCodeValue] = useState<string>("");
  const [isPromoCodeDisabled, setIsPromoCodeDisabled] = useState<boolean>(true);
  const [promoCodeError, setPromoCodeError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const { setSchemeCode, homePremiumResponse, requestPayload: homePayload, updateRequestPayload } = useQuoteAndBuyContext();
  const [isPromoEmailActive, setIsPromoEmailActive] = useState<boolean | null>(null);
  const [isApiCall, setIsapiCall] = useState<boolean>(false);
  const [tempHomePayload, setTempHomePayload] = useState<CalculatePremiumPayload | null>(null);
  const requestPayload = useCalculatePremiumPayload();

  const { makeApiCall, data, isLoading, errors, setData } = useApiCall<PromoCodeResponse, PromoCodeRequest>(5, JAVA_API_ROUTES.schemeCode, "post");
  const isHome = homePremiumResponse && Object.keys(homePremiumResponse).length > 0;

  let premium = {};

  if (isHome) {
    premium = homeUseCalculatePremiumApi();
  } else if (productType !== TRAVELER) {
    premium = useCalculatePremiumApi();
  }

  const handlePromoCodeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCodeValue(event.target.value);
    setEmailVal("");
    setIsPromoEmailActive(false);
    setEmailError("");
    setIsapiCall(false);
  };

  const handleEmailValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailVal(event.target.value);
    setPromoCodeValue("");
    setIsPromoEmailActive(true);
    setPromoCodeError("");
    setIsapiCall(false);
  };

  const handleData = (schemeCode: PromoCodeScheme) => {
    
    let requestPayloadScheme = {
      ...requestPayload,
      policyBasic: {
        ...requestPayload?.policyBasic,
        schemeCode: schemeCode.schemeCode,
      }
    }

    if (isHome) { // home specific request payload to pass scheme code
      requestPayloadScheme = {
        ...homePayload,
        schemeCode: schemeCode.schemeCode,
      }
      setTempHomePayload(requestPayloadScheme);
      premium.handleCalculatePremium(requestPayloadScheme);
    }
    else if (productType !== TRAVELER)
      premium.handleCalculatePremium(requestPayloadScheme);
    if (isPromoEmailActive) {
      setSchemeCode(schemeCode);
    }
  };

  const handlePrmoCodeValid = async () => {
    await makeApiCall({ schemeType: 3, promoCode: promoCodeValue });
    setIsapiCall(true);
  };

  const handleEmailValid = async () => {
    await makeApiCall({ schemeType: 2, domainEmail: emailVal });
    setIsapiCall(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    setPromoCodeValue("");
    setEmailVal("");
    setData(null);
    setEmailError("");
    setPromoCodeError("");
    setIsCouponApplied(false);
    setIsEmailValid(true);
    setIsPromoCodeDisabled(true);
    setIsapiCall(false);
  };

  useEffect(() => {
    setIsPromoCodeDisabled(promoCodeValue === "");
  }, [promoCodeValue]);

  useEffect(() => {
    if (premium.isCalculateData && data && data.model.schemes.length && isApiCall) {
      if (!isPromoEmailActive) {
        setSchemeCode(data.model.schemes[0]);
        setIsCouponApplied(true);
      }
    }
    if (!isHome && premium.isAllError) {
      setPromoCodeError(!isPromoEmailActive ? premium.isError[0] : "");
      setEmailError(isPromoEmailActive ? premium.isError[0] : "");
    }
  }, [premium.isError, premium.isCalculateData, data, isApiCall]);

  useEffect(() => {
    if (premium.data && data && data.model.schemes.length) {
      if (tempHomePayload) {
        updateRequestPayload(tempHomePayload);
        setTempHomePayload(null);
      }
      if (!isPromoEmailActive) {
        setSchemeCode(data.model.schemes[0]);
        setIsCouponApplied(true);
      }
    }
    if (isHome && premium.isError) {
      setPromoCodeError(!isPromoEmailActive ? premium.isError?.messages?.message_en ?? languageData?.internal_server_error: languageData?.internal_server_error);
      setEmailError(isPromoEmailActive ? premium.isError?.messages?.message_en ?? languageData?.internal_server_error: languageData?.internal_server_error);
    }
  }, [premium.isError, premium.data, data, isApiCall]);

  useEffect(() => {
    if (data?.model.schemes.length && isApiCall/* && productType === TRAVELER*/) {
      if (!isPromoEmailActive) {
        setSchemeCode(data.model.schemes[0]);
        setIsCouponApplied(true);
        setTimeout(() => {
          setLeftStep && setLeftStep(2);
        }, 3000);
      }
    }
  }, [data, isApiCall, setLeftStep]);

  useEffect(() => {
    setIsEmailValid(!isValidEmail(emailVal));
  }, [emailVal]);

  useEffect(() => {
    if (isOpen) {
      handleReset();
    }
  }, [isOpen]);

  //Updated logic for handling API responses and modal closing
  useEffect(() => {
    if (data && data.model.schemes.length > 0) {
      if(!isPromoEmailActive) {
        handleData(data.model.schemes[0]);
      } else {
        // Email-based promo code - close modal first, then trigger OTP
        setCallGenerateOtp(true);
        handleClose();
      }
    }
  }, [data, isPromoEmailActive, isApiCall]);

  useEffect(() => {
    if (errors) {
      if (errors?.messages?.message_en) {
        setPromoCodeError(!isPromoEmailActive && isApiCall ? errors.messages.message_en: "");
        setEmailError(isPromoEmailActive && isApiCall ? errors.messages.message_en: "");
      }
    }
  }, [errors, isPromoEmailActive]);

  useEffect(() => {
    if (data && isCouponApplied) {
      if (isPromoEmailActive) {
        handleData(data?.model.schemes[0]);
      } else {
        setTimeout(() => {
          handleClose();
          setData(null);
        }, 3000);
      }
    }
  }, [isCouponApplied, data]);

  return (
    <Modal
      show={isOpen}
      onHide={handleClose}
      centered={isCouponApplied}
      size={isCouponApplied ? "sm" : "lg"}
      backdrop="static"
      keyboard={false}
      className={!isCouponApplied ? "promo-code-modal" : "promo-code-success"}
    >
      {!isCouponApplied && (
        <>
          <Modal.Header closeButton>
            <BuyProductHeading
              heading={promoCodeHeading}
              headingImage={promoCodeIcon}
              classNames={"border-none"}
            />
          </Modal.Header>
          <ModalBody>
            <div className="promo-code-content">
              <OptionPromoCard
                mainHeading={languageData?.field_do_you_have_a_promo_code}
                mainContent={languageData?.field_enter_the_promo_code}
                subHeading={languageData?.filed_promocode}
                inputBox={{
                  placeholder: languageData?.field_enter_promo_code_placehold,
                  onChangehandler: handlePromoCodeValue,
                  value: promoCodeValue,
                  isButtonEnabled: isPromoCodeDisabled || isLoading,
                  buttonTitle: languageData?.field_apply,
                  onClickhandler: handlePrmoCodeValid,
                  errorMessage: promoCodeError,
                  isActive: !isPromoEmailActive,
                }}
              />
              <OptionPromoCard
                mainHeading={languageData?.field_are_you_a_corporate_employ}
                mainContent={languageData?.field_if_yes_please_keep_your_em}
                subHeading={languageData?.field_corporate_email_id}
                inputBox={{
                  placeholder: languageData?.field_enter_corporate_email_id,
                  onChangehandler: handleEmailValue,
                  value: emailVal,
                  isButtonEnabled: isEmailValid || isLoading,
                  buttonTitle: languageData?.field_send_promo_code,
                  onClickhandler: handleEmailValid,
                  errorMessage: emailError,
                  isActive: isPromoEmailActive ?? false,
                }}
              />
            </div>
          </ModalBody>
        </>
      )}
      {isCouponApplied && (
        <>
          <SuccessCelebration successMessage={languageData?.promo_code_applied_successfully} />
        </>
      )}
    </Modal>
  );
}