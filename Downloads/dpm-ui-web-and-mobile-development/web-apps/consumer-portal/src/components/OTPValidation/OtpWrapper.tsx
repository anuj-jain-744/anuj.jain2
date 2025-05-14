// React Imports
import React, { useCallback, useEffect, useState } from "react";

// Shared Module Utilities
import { getRandomString, useApiCall } from "@dpm/shared-module";

// Local Components
import { AlertBox } from "components/AlertBox";
import OTPValidation from "components/OTPValidation";

// Constants
import { INVALID_OTP_ERROR_CODE, RESEND_OTP_ERROR_CODE, OTP_TIMER } from "constant";

export interface GetOtpResponse {
  referenceNo: string;
  sessionSecretId: string;
  timerForResend: string;
}

export interface LanguageDataProps {
  enter_otp_code: string;
  your_otp_will_expire: string;
  confirm_otp: string;
  resend_otp: string;
  please_enter_the_mobile_verification_code?: string;
  please_enter_the_email_verification_code?: string;
  otp_validity_expired_msg?: string;
}

interface OTPWrapperProps {
  generateOtpUrl: string;
  validateOtpUrl: string;
  languageData: LanguageDataProps;
  handleSuccessValidation: (data: { [key: string]: string }) => void;
  payload: { [key: string]: string };
  callGenerateOtp: boolean;
  setCallGenerateOtp?: (value: boolean) => void;
}

export const OTPWrapper: React.FC<OTPWrapperProps> = ({
  generateOtpUrl,
  validateOtpUrl,
  languageData,
  handleSuccessValidation,
  payload,
  callGenerateOtp,
  setCallGenerateOtp
}) => {
  // OTP Modal related states
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");
  const [messageOTP, setMessageOTP] = useState("");
  const [timerResend, setTimerResend] = useState(OTP_TIMER);
  const [otpResponse, setOtpResponse] = useState<null | { referenceNo: string, sessionSecretId: string }>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });

  const { makeApiCall, isLoading, errors, data } = useApiCall(
    5,
    generateOtpUrl,
    "post"
  );

  const {
    makeApiCall: makeValidateApiCall,
    isLoading: validateIsLoading,
    errors: validateError,
    data: validateData,
  } = useApiCall(5, validateOtpUrl, "post");

  const languageOTPData = {
    otp_info_message: languageData?.enter_otp_code,
    your_otp_will_expire: languageData?.your_otp_will_expire,
    confirm_otp: languageData?.confirm_otp,
    resend_otp: languageData?.resend_otp,
    enter_otp_code: languageData?.enter_otp_code,
    please_enter_the_mobile_verification_code: languageData?.please_enter_the_mobile_verification_code,
    please_enter_the_email_verification_code: languageData?.please_enter_the_email_verification_code,
    otp_validity_expired_msg: languageData?.otp_validity_expired_msg
  };

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
    setOtpValue("");
    setErrorCode("");
    setMessageOTP("")
  }

  const handleClose = () => {
    setShowAlertModal(false);
  }

  const validateOtp = async () => {
    const sessionSecretId = sessionId ? sessionId : getSecretSessionId();
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
    if (otpValue.length === 4) {
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
    if (validateError) {
      setMessageOTP(validateError?.messages?.message_en ?? "");
      setErrorCode(validateError?.code);
    }
  }, [validateError, handleSuccessValidation]);

  useEffect(() => {
    if (validateData) {
      handleClose();
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
        languageData={languageOTPData}
        isLoading={isLoading || validateIsLoading}
        isInputDisabled={errorCode === INVALID_OTP_ERROR_CODE || errorCode === RESEND_OTP_ERROR_CODE}
        handleResend={() => handleResend(sessionId)}
        handleReset={handleReset}
      />
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleClose}
      />
    </>
  );
};
