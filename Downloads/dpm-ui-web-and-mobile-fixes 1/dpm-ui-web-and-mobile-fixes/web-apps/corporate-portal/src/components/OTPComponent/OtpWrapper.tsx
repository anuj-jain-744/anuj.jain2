import { getRandomString, useApiCall } from "@dpm/shared-module";
import CloseIcon from "@mui/icons-material/Close";
import { AlertBox } from "components/AlertBox";
import OTPValidation from "components/OTPValidation";
import { useCallback, useEffect, useState} from "react";
import './OTPComponent.scss';
import {useLoginAndSignupContext} from "../Login/useLoginAndSignupContext"
import { INVALID_OTP_ERROR_CODE, RESEND_OTP_ERROR_CODE } from "constant";

export interface GetOtpResponse {
    referenceNo: string;
    sessionSecretId: string;
    timerForResend: string;
}

interface OTPWrapperProps {
    generateOtpUrl: string;
    validateOtpUrl: string;
    languageData: {
        enter_otp_code: string;
        your_otp_will_expire: string;
        confirm_otp: string;
        resend_otp: string;
        please_enter_the_otp: string;
        change_mobile_no:string;
        otp_validity_expired_msg: string;
        verify:string;
    };
    handleSuccessValidation: (data:  {[key:string]: string}) => void;
    payload: {[key:string]: string};
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
  const [timerResend, setTimerResend] = useState(600);
  const [otpResponse, setOtpResponse] = useState<null | { referenceNo: string, sessionSecretId: string }>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState({
    title: "",
    description: ""
  });
  let LoginContext;
  if(contextProvider){
      LoginContext = useLoginAndSignupContext(); 
      const payloadLogin = LoginContext?.navigateToErrorFrom === 5 ? LoginContext?.forgotPassPayload : LoginContext?.loginPayload;
      payload = {
        ...payloadLogin,
        ...payload,
        'mobileNumber':payloadLogin?.mobileNumber        
      }
  }
  
  let apiType = 5;
  const getScreenDetails = () => {
    let stepIDValue = {};
    switch(LoginContext?.navigateToErrorFrom){
      case 0:
        stepIDValue = {
          id: 0,
          value: 'login',
          apiType : 13,
          validateUrl:validateOtpUrl,
          generateUrl: generateOtpUrl,
          getAPImethod: "post"
        };
        break;
      case 3:
        stepIDValue = {
          id: 3,
          value: 'changeMobileNumOTP',
          apiType : 13,
          validateUrl:validateOtpUrl,
          generateUrl: generateOtpUrl,
          getAPImethod: "post"
        }
        break;
      case 5:
        stepIDValue = {
          id: 5,
          value: 'forgotPassAndSignup',
          apiType : 14,
          validateUrl: '/UserSignup/ValidateOtp',
          generateUrl: LoginContext.signUpForm ? '/UserSignup/GenerateOtp' : '/GenerateOtp',
          getAPImethod: "post"
        }
        break;
      case 6:
          stepIDValue = {
            id: 6,
            value: 'login',
            apiType : 14,
            validateUrl: '/UserSignup/ValidateOtp',
            generateUrl: "/ValidateLoginUrl/"+LoginContext?.referenceNumber,
            getAPImethod: "get"
          }
          break;
      default:
        stepIDValue = {
          id: 0,
          value: '',
          apiType : 5,
          validateUrl:validateOtpUrl,
          generateUrl: generateOtpUrl,
          getAPImethod: "post"
        }
        break;
    }
    if(LoginContext?.navigateToErrorFrom === 6){
      payload = {}
    }
    return stepIDValue;
  }

  let url = getScreenDetails();

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
    enter_otp_code: languageData?.enter_otp_code,
    please_enter_the_otp: languageData?.please_enter_the_otp,
    change_mobile_no: languageData?.change_mobile_no,
    otp_validity_expired_msg: languageData?.otp_validity_expired_msg,
    verify:languageData?.verify
  };

  const getSecretSessionId = () => {
    const sessionId = LoginContext?.loginData ? LoginContext?.loginData?.sessionSecretId : getRandomString(9, true);
    setSessionId(sessionId);
    return sessionId;
  }

  const fetchGenerateOtp = useCallback(async (isResend: boolean = false) => {
    const sessionSecretId = isResend ? sessionId : getSecretSessionId();

    await makeApiCall({
        sessionSecretId: sessionSecretId, 
        ...payload
      });
  }, [makeApiCall]);

  const handleResend = async () => {
    fetchGenerateOtp(true);
  };

  const handleReset = () => {
    setOtpValue("");
    setErrorCode("");
    setMessageOTP("")
  }

  const handleClose = () => {
    setShowAlertModal(false);
  }

  const handleScenarioBackBtn = () => {
    let stepId = getScreenDetails();
    setCurrentStepValue(stepId?.id);
  }

  const validateOtp = async () => {
    const sessionSecretId =  sessionId ? sessionId : getSecretSessionId();
    await makeValidateApiCall({
      "otp":otpValue,
      "referenceNo": otpResponse?.referenceNo ?? "",
      "sessionSecretId": sessionSecretId ?? "",
      "userId":  LoginContext?.loginData?.userId
    })
  }
  
  useEffect(()=>{
    setTimerResend (LoginContext?.loginData?.timerForResend);
    setOtpResponse(LoginContext?.loginData);
  },[])

  useEffect(()=>{
    if(LoginContext?.stepValue){
      setCurrentStepValue(LoginContext?.stepValue)
    }
  },[LoginContext?.stepValue])

  useEffect(() => {
    if(callGenerateOtp) {
      fetchGenerateOtp();
    }
  }, [callGenerateOtp, fetchGenerateOtp]);    

  useEffect(() => {
      if(otpValue.length === 4) {
        validateOtp();
      }
  }, [otpValue]);

  
  useEffect(() => {
    if(data) {
      setOtpResponse(data as GetOtpResponse);
      setShowOTPModal(true);
      setTimerResend(parseInt((data as GetOtpResponse)?.timerForResend ?? "0"));
    } 
    if(errors) {
      console.error(errors);
      setErrorCode(errors?.code);
      setApiErrorMessage({
        title: errors?.name,
        description: errors.messages?.message_en ?? ""
      });
      if (errors.code === RESEND_OTP_ERROR_CODE) setShowOTPModal(false);
      setShowAlertModal(true);
    }
  }, [isLoading, errors, data]);

  useEffect(() => {
    if(validateError) {
      setMessageOTP(validateError?.messages?.message_en ?? "");
      setErrorCode(validateError?.code);
    } 
    if(validateData) {
      let navigateFrom = getScreenDetails() as { value: string };
      handleClose();
      setShowOTPModal(false);
      setOtpResponse(null)
      if(navigateFrom.value === 'login'){
        sessionStorage.setItem("userDetails", JSON.stringify(validateData));
        sessionStorage.setItem("iqmaId", LoginContext?.loginData?.userId);
      }
      handleSuccessValidation(navigateFrom.value);
    }
  }, [validateIsLoading, validateError, validateData, handleSuccessValidation]);

  return (
    <>
      {  !showModal &&
        <div className="OTPWrapper">
            <div className="navWrapper">
              <a  className="back-button" 
                onClick={()=>handleScenarioBackBtn()}>
                {languageData?.back}
              </a>
              <CloseIcon
                data-testid="close-icon"
                className="modal-close-icon"
                onClick = {() => closeIcon(false)}
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
        handleResend={handleResend}
        setDisabledBtn={setDisabledBtn}
        handleReset={handleReset}
        contextProvider = {true}
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
