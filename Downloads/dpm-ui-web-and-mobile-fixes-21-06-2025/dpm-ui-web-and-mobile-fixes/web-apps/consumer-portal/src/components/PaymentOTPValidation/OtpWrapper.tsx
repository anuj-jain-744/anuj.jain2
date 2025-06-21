// React Imports
import React, { useCallback, useEffect, useState } from "react";
import { LoaderOverlay } from "@app-shell/components/Loader";

// Shared Module Utilities
import { useApiCall } from "@dpm/shared-module";

// Local Components
import { AlertBox } from "components/AlertBox";
import OTPValidation from "./index";

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

interface OTPInfo {
  showOTPModal: boolean;
  otpResponse: null,
  errorTitle: string;
  errorDescription: string;
  messageOTP: string;
  loading: boolean;
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
  const [otpInfo, setOTPInfo] = useState<OTPInfo>({
    showOTPModal: false,
    otpResponse: null,
    errorTitle: "",
    errorDescription: "",
    messageOTP: "",
    loading: false
  });
  const [otpValue, setOtpValue] = useState<string>("");

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

  const fetchGenerateOtp = useCallback(async () => {
    setOTPInfo((prevValue) => ({
      ...prevValue,
      loading: true
    }));
    await makeApiCall(payload);
  }, [makeApiCall, payload]);

  const handleReset = () => {
    setOtpValue("");
    setOTPInfo((prevValue) => ({
      ...prevValue,
      messageOTP: ""
    }));
  }

  const handleClose = () => {
    setOTPInfo((prevValue) => ({
      ...prevValue,
      errorTitle: "",
      errorDescription: ""
    }));
  }

  const validateOtp = async () => {
    await makeValidateApiCall({
      paymentMethod: payload?.paymentMethod,
      otp: otpValue,
      transactionID: payload?.transactionID
    })
  }
  useEffect(() => {
    if (callGenerateOtp) {
      setOtpValue("");
      fetchGenerateOtp();
    }
  }, [callGenerateOtp]);

  useEffect(() => {
    if (!otpInfo?.showOTPModal && setCallGenerateOtp) {
      setCallGenerateOtp(false);
      setOtpValue("");
    }
  }, [otpInfo?.showOTPModal]);

  useEffect(() => {
    if (otpValue.length === 4) {
      validateOtp();
    }
  }, [otpValue]);

  useEffect(() => {
    if (data) {
      setOTPInfo((prevValue) => ({
        ...prevValue,
        showOTPModal: true,
        otpResponse: data,
        loading: false,
      }));
    }
    if (errors && !data) {
      setOTPInfo((prevValue) => ({
        ...prevValue,
        errorTitle: errors?.name ?? languageData?.internal_server_error,
        errorDescription: errors.messages?.message_en ?? languageData?.something_went_wrong,
        loading: false,
      }));
    }
  }, [isLoading, errors, data]);

  useEffect(() => {
    if (validateError) {
      setOTPInfo((prevValue) => ({
        ...prevValue,
        messageOTP: validateError?.messages?.message_en ?? languageData?.something_went_wrong
      }));
    }
  }, [validateError, handleSuccessValidation]);

  useEffect(() => {
    if (validateData) {
      setOTPInfo((prevValue) => ({
        ...prevValue,
        showOTPModal: false,
        otpResponse: null,
        errorDescription: "",
        errorTitle: ""
      }));
      handleSuccessValidation(validateData);
    }
  }, [validateData]);

  const setShowOTPModal = (data: boolean) => {
    setOTPInfo((prevValue) => ({
      ...prevValue,
      showOTPModal: data,
    }));
  }

  return (
    <>
      {otpInfo?.loading && <LoaderOverlay />}
      <OTPValidation
        showModal={otpInfo?.showOTPModal}
        setShowModal={setShowOTPModal}
        setOtpValue={setOtpValue}
        messageOTP={otpInfo?.messageOTP}
        languageData={languageData}
        isLoading={isLoading || validateIsLoading}
        isInputDisabled={false}
        handleReset={handleReset}
      />
      <AlertBox
        title={otpInfo?.errorTitle}
        description={otpInfo?.errorDescription}
        showAlertModal={Boolean(otpInfo.errorDescription)}
        setShowAlertModal={handleClose}
      />
    </>
  );
};
