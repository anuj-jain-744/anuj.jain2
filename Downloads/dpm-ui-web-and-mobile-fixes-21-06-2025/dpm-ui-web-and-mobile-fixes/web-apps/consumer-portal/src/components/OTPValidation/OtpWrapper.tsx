// React Imports
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
// Shared Module Utilities
import { getRandomString, useApiCall, RootState } from "@dpm/shared-module";
// Local Components
import { AlertBox } from "components/AlertBox";
import OTPValidation from "components/OTPValidation";
// Constants and types
import { LanguageData } from "types/languageData";
import { INVALID_OTP_ERROR_CODE, RESEND_OTP_ERROR_CODE, OTP_TIMER, OTP_LENGTH } from "constant";

export interface GetOtpResponse {
  referenceNo: string;
  sessionSecretId: string;
  timerForResend: string;
}
interface OTPWrapperProps {
  generateOtpUrl: string;
  validateOtpUrl: string;
  languageData: LanguageData;
  handleSuccessValidation: (data: { [key: string]: string }) => void;
  payload: { [key: string]: string };
  callGenerateOtp: boolean;
  setCallGenerateOtp?: (value: boolean) => void;
}

export const OTPWrapper: React.FC<OTPWrapperProps> = ({
  generateOtpUrl,
  validateOtpUrl,
  // languageData,
  handleSuccessValidation,
  payload,
  callGenerateOtp,
  setCallGenerateOtp
}) => {
  // Fetching language data from the Redux store
  const { languageData: consumerCmsLanguageData } = useSelector((state: RootState) => state?.consumerCmsLanguageData, shallowEqual);
  const languageData = consumerCmsLanguageData?.config[0];

  // OTP Modal related states
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");
  const [messageOTP, setMessageOTP] = useState("");
  const [timerResend, setTimerResend] = useState(OTP_TIMER);
  const [otpResponse, setOtpResponse] = useState<null | { referenceNo: string, sessionSecretId: string }>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [validateErrorNull, setValidateError] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({ title: "", description: "" });

  const { makeApiCall, isLoading, errors, data } = useApiCall(5, generateOtpUrl, "post");
  // API call for validating OTP
  const {
    makeApiCall: makeValidateApiCall,
    isLoading: validateIsLoading,
    errors: validateError,
    data: validateData,
  } = useApiCall(5, validateOtpUrl, "post");

  const getSecretSessionId = () => {
    const sessionId = getRandomString(9, true);
    setSessionId(sessionId);
    return sessionId;
  }

  const fetchGenerateOtp = useCallback(async (isResend: boolean = false, resendSessionId: string) => {
    const sessionSecretId = isResend && resendSessionId ? resendSessionId : getSecretSessionId();
    await makeApiCall({
      ...payload,
      sessionSecretId: sessionSecretId ?? getSecretSessionId(),
    });
  }, [makeApiCall]);

  const handleResend = async (resendSessionId: string) => {
    fetchGenerateOtp(true, resendSessionId);
  };

  const handleReset = () => {
    setValidateError(false);
    setOtpValue("");
    setErrorCode("");
    setMessageOTP("");
  }

  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
  }

  const validateOtp = async () => {
    const sessionSecretId = sessionId ? sessionId : getSecretSessionId();
    setValidateError(true);
    await makeValidateApiCall({
      "otp": otpValue,
      "referenceNo": otpResponse?.referenceNo ?? "",
      "sessionSecretId": sessionSecretId ?? "",
    })
  }

  useEffect(() => {
    if (callGenerateOtp) {
      setOtpValue("");
      fetchGenerateOtp();
    }
  }, [callGenerateOtp, fetchGenerateOtp]);

  useEffect(() => {
    if (!showOTPModal && setCallGenerateOtp) {
      setCallGenerateOtp(false);
      setOtpValue("");
    }
  }, [showOTPModal]);

  useEffect(() => {
    if (otpValue.length === OTP_LENGTH) {
      validateOtp();
    }
  }, [otpValue]);

  useEffect(() => {
    if (data) {
      setOtpResponse(data as GetOtpResponse);
      setShowOTPModal(true);
      setTimerResend(parseInt((data as GetOtpResponse)?.timerForResend ?? "0"));
    }
    if (errors) {
      console.error(errors);
      setErrorCode(errors?.code);
      setApiErrorMessage({
        title: errors?.name,
        description: errors.messages?.message_en ?? ""
      });

      if (errors.code === RESEND_OTP_ERROR_CODE) {
        setMessageOTP(errors.messages?.message_en ?? "");
        setShowOTPModal(false);
        // setCurrentStepValue(0);
        setShowAlertModal(true);
      }
    }
  }, [isLoading, errors, data]);

  useEffect(() => {
    if (validateError && validateErrorNull) {
      setMessageOTP(validateError?.messages?.message_en ?? "");
      setErrorCode(validateError?.code);
    }
  }, [validateError, handleSuccessValidation]);

  useEffect(() => {
    if (validateData) {
      handleCloseAlertModal();
      setShowOTPModal(false);
      setOtpResponse(null)
      handleSuccessValidation(validateData);
    }
  }, [validateData]);
  return (
    <>
      <OTPValidation
        showModal={showOTPModal}
        setShowModal={setShowOTPModal}
        setOtpValue={setOtpValue}
        timerResend={timerResend}
        messageOTP={messageOTP}
        languageData={languageData}
        isLoading={isLoading || validateIsLoading}
        isInputDisabled={errorCode === INVALID_OTP_ERROR_CODE || errorCode === RESEND_OTP_ERROR_CODE}
        handleResend={() => handleResend(sessionId)}
        handleReset={handleReset}
      />
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleCloseAlertModal}
      />
    </>
  );
};
