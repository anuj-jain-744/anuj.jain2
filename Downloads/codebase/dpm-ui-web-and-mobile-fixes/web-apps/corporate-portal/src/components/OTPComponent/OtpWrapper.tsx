// React Imports
import React, { useCallback, useEffect, useState } from "react";
// Shared Module Utilities
import { getRandomString, useApiCall } from "@dpm/shared-module";
// Material-UI Icons
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// Local Components
import { AlertBox } from "components/AlertBox";
import OTPValidation from "components/OTPValidation";
import { useLoginAndSignupContext } from "../Login/useLoginAndSignupContext";
// Constants
import { INVALID_OTP_ERROR_CODE, RESEND_OTP_ERROR_CODE, RESEND_OTP_TIMER, INVALID_MOBILE_ERROR_CODE, PASSWORD_INPUTS, OTP_LENGTH } from "constant";
// Styles
import "./OTPComponent.scss";

export interface GetOtpResponse {
  referenceNo: string;
  sessionSecretId: string;
  timerForResend: string;
  mobileNumber: string;
  resendOtpTimer: string;
  userId: string;
}

interface BasePayload {
  otp: string;
  referenceNo: string;
  sessionSecretId: string;
  userId?: string;
  mobileNumber: string;
  type?: string;
  encryptedPassword?: string;
}

interface OTPWrapperProps {
  generateOtpUrl: string;
  validateOtpUrl: string;
  languageData: {
    otp_verification?: string;
    enter_otp_code: string;
    your_otp_will_expire: string;
    confirm_otp: string;
    resend_otp: string;
    didn_t_receive_otp: string;
    please_enter_the_otp: string;
    change_mobile_no: string;
    otp_validity_expired_msg: string;
    verify: string;
    otp_timedout_three_wrong_attempts_error_msg: string;
  };
  handleSuccessValidation: (data: { [key: string]: string }) => void;
  payload: { [key: string]: string };
  callGenerateOtp: boolean;
  closeIcon: any;
  showModal: boolean;
  contextProvider: boolean;
  setCurrentStepValue: any;
}

export const OTPWrapper: React.FC<OTPWrapperProps> = ({
  generateOtpUrl,
  validateOtpUrl,
  languageData,
  handleSuccessValidation,
  payload,
  callGenerateOtp,
  closeIcon,
  showModal,
  contextProvider,
  setCurrentStepValue
}) => {
  // OTP Modal related states
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");
  const [messageOTP, setMessageOTP] = useState("");
  const [timerResend, setTimerResend] = useState(0); // OTP timer state, default to 0 seconds
  const [resendOtpTimer, setResendOtpTimer] = useState(0); // Resend OTP enable timer 
  const [otpResponse, setOtpResponse] = useState<null | { referenceNo: string, sessionSecretId: string; mobileNumber: string }>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({ title: "", description: "" });

  let LoginContext;
  if (contextProvider) {
    LoginContext = useLoginAndSignupContext();
    const payloadLogin = LoginContext?.navigateToErrorFrom === 5 ? LoginContext?.forgotPassPayload : LoginContext?.loginPayload;
    payload = {
      ...payloadLogin,
      ...payload,
      'mobileNumber': payloadLogin?.mobileNumber
    }
  }

  const apiType = 5;
  const getScreenDetails = () => {
    let stepIDValue = {};
    switch (LoginContext?.navigateToErrorFrom) {
      case 0:
        stepIDValue = {
          id: 0,
          value: 'login',
          apiType: 13,
          validateUrl: validateOtpUrl,
          generateUrl: generateOtpUrl,
          getAPImethod: "post"
        };
        break;
      case 3:
        stepIDValue = {
          id: 3,
          value: 'changeMobileNumOTP',
          apiType: 14,
          validateUrl: "/Verify/ValidateOtp",
          generateUrl: "/Verify/GenerateOtp",
          getAPImethod: "post"
        }
        break;
      case 5:
        stepIDValue = {
          id: 5,
          value: 'signup',
          apiType: 14,
          validateUrl: '/UserSignup/ValidateOtp',
          generateUrl: '/UserSignup/GenerateOtp',
          getAPImethod: "post"
        }
        break;
      case 6:
        stepIDValue = {
          id: 6,
          value: 'forgotPass',
          apiType: 13,
          validateUrl: '/ResetPassword/ValidateOtp',
          generateUrl: '/ResetPassword/GenerateOtp',
          getAPImethod: "post"
        }
        break;
      case 6.1:
        stepIDValue = {
          id: 6.1,
          value: 'login',
          apiType: 14,
          validateUrl: '/UserSignup/ValidateOtp',
          generateUrl: "/ValidateLoginUrl/" + LoginContext?.referenceNumber,
          getAPImethod: "get"
        }
        break;
      default:
        stepIDValue = {
          id: 0,
          value: '',
          apiType: 5,
          validateUrl: validateOtpUrl,
          generateUrl: generateOtpUrl,
          getAPImethod: "post"
        }
        break;
    }
    if (LoginContext?.navigateToErrorFrom === 6) {
      payload = {}
    }
    return stepIDValue;
  }

  const url = getScreenDetails();

  const { makeApiCall, isLoading, errors, data } = useApiCall(
    url.apiType,
    url.generateUrl,
    url.getAPImethod
  );

  const {
    makeApiCall: makeValidateApiCall,
    isLoading: validateIsLoading,
    errors: validateError,
    data: validateData,
  } = useApiCall(url.apiType, url.validateUrl, "post");


  const languageOTPData = {
    otp_info_message: languageData?.enter_otp_code,
    your_otp_will_expire: languageData?.your_otp_will_expire,
    confirm_otp: languageData?.confirm_otp,
    resend_otp: languageData?.resend_otp,
    didn_t_receive_otp: languageData?.didn_t_receive_otp,
    enter_otp_code: languageData?.enter_otp_code,
    please_enter_the_otp: languageData?.please_enter_the_otp,
    change_mobile_no: languageData?.change_mobile_no,
    otp_validity_expired_msg: languageData?.otp_validity_expired_msg,
    verify: languageData?.verify,
    otp_timedout_three_wrong_attempts_error_msg: languageData?.otp_timedout_three_wrong_attempts_error_msg
  };

  const getSecretSessionId = () => {
    const sessionId = LoginContext?.loginData ? LoginContext?.loginData?.sessionSecretId : getRandomString(9, true);
    setSessionId(sessionId);
    return sessionId;
  }

  const fetchGenerateOtp = useCallback(async (isResend: boolean = false, resendSessionId: string) => {
    const sessionSecretId = isResend && resendSessionId ? resendSessionId : getSecretSessionId();
    await makeApiCall({
      ...payload,
      // sessionSecretId: sessionSecretId ?? getSecretSessionId(),
      sessionSecretId: sessionSecretId,
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

  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
  }

  const handleScenarioBackBtn = () => {
    const stepId = getScreenDetails();
    setCurrentStepValue(stepId?.id);
  }

  const validateOtp = async () => {
    const sessionSecretIdValue = sessionId || getSecretSessionId();

    const basePayload: BasePayload = {
      otp: otpValue,
      referenceNo: otpResponse?.referenceNo ?? "",
      sessionSecretId: sessionSecretIdValue,
      userId: LoginContext?.loginData?.userId,
      mobileNumber: otpResponse?.mobileNumber ?? "",
    };

    const payload = { ...basePayload };

    if (LoginContext) {
      const { navigateToErrorFrom, encryptedPassword } = LoginContext;
      switch (navigateToErrorFrom) {
        case 5:
          payload.type = "";
          break;
        case 6:
          if (encryptedPassword) payload.encryptedPassword = encryptedPassword;
          break;
        default:
          payload.type = PASSWORD_INPUTS.login;
      }
    }

    await makeValidateApiCall(payload);
  };

  useEffect(() => {
    setOtpResponse(LoginContext?.loginData);
    setTimerResend(LoginContext?.loginData?.timerForResend);
    setResendOtpTimer(LoginContext?.loginData?.resendOtpTimer ?? RESEND_OTP_TIMER); // Resend OTP button will be enabled after 30 seconds
  }, [])

  useEffect(() => {
    if (LoginContext?.stepValue) {
      setCurrentStepValue(LoginContext?.stepValue)
    }
  }, [LoginContext?.stepValue])

  useEffect(() => {
    if (callGenerateOtp) {
      fetchGenerateOtp();
    }
  }, [callGenerateOtp, fetchGenerateOtp]);

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
      setResendOtpTimer(parseInt((data as GetOtpResponse)?.resendOtpTimer ?? RESEND_OTP_TIMER));
    }
    if (errors) {
      console.error(errors);
      setErrorCode(errors?.code);
      setApiErrorMessage({
        title: errors?.name,
        description: errors.messages?.message_en ?? ""
      });

      if (errors.code === RESEND_OTP_ERROR_CODE) {
        setShowOTPModal(false);
        LoginContext?.navigateToErrorFrom === 0 ? setShowAlertModal(false) : setShowAlertModal(true);
        // setCurrentStepValue(0);
        setMessageOTP(errors.messages?.message_en ?? "");
      }
    }
  }, [isLoading, errors, data]);

  useEffect(() => {
    if (validateError) {
      if (validateError?.code === INVALID_MOBILE_ERROR_CODE) {
        LoginContext?.setErrorMessage(validateError?.messages?.message_en);
        setCurrentStepValue(3);
      } else {
        setMessageOTP(validateError?.messages?.message_en ?? "");
        setErrorCode(validateError?.code);
      }
    }
    if (validateData) {
      const navigateFrom = getScreenDetails() as { value: string };
      handleCloseAlertModal();
      setShowOTPModal(false);
      setOtpResponse(null)
      if (navigateFrom.value === 'changeMobileNumOTP') {
        setCurrentStepValue(3);
        LoginContext?.setnavigateToErrorFrom(1)
      } else if (navigateFrom.value === 'forgotPass') {
        setCurrentStepValue(4);
        LoginContext?.setnavigateToErrorFrom(1);
      } else {
        if (navigateFrom.value === 'login') {
          sessionStorage.setItem("userDetails", JSON.stringify(validateData));
          sessionStorage.setItem("iqmaId", LoginContext?.loginData?.userId);
        }
        handleSuccessValidation(navigateFrom?.value);
      }
    }
  }, [validateIsLoading, validateError, validateData, handleSuccessValidation]);

  return (
    <div className="otpwrapper-container">
      {!showModal &&
        <div className="OTPWrapper">
          <div className="navWrapper">
            <div className="back-nav-container">
              <ChevronLeftIcon className="back-icon" aria-label="Chevron Left" />
              <a className="back-button-text"
                onClick={() => handleScenarioBackBtn()}>
                {languageData?.back}
              </a>
            </div>
            <h5 className="otp-header-text">
              {languageData?.otp_verification || languageData?.confirm_otp}
            </h5>
          </div>
          <div className="modal-close-icon1">
            <CloseIcon
              data-testid="close-icon"
              className="modal-close-icon"
              onClick={() => closeIcon(false)}
            />
          </div>
        </div>
      }

      <OTPValidation
        showModal={showModal}
        setShowModal={setShowOTPModal}
        setOtpValue={setOtpValue}
        timerResend={timerResend}
        messageOTP={messageOTP}
        languageData={languageOTPData}
        isLoading={isLoading || validateIsLoading}
        isInputDisabled={errorCode === INVALID_OTP_ERROR_CODE || errorCode === RESEND_OTP_ERROR_CODE}
        handleResend={() => handleResend(sessionId)}
        setDisabledBtn={setDisabledBtn}
        resendOtpTimer={resendOtpTimer}
        handleReset={handleReset}
        contextProvider={contextProvider}
      />
      <AlertBox
        title={apiErrorMessage.title}
        description={apiErrorMessage.description}
        showAlertModal={showAlertModal}
        setShowAlertModal={handleCloseAlertModal}
      />
    </div>
  );
};
