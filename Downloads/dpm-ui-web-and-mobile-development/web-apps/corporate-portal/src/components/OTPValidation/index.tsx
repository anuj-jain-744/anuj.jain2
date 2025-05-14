import React, { Suspense, useEffect, useState, useRef } from "react";
import { Modal, Spinner } from "react-bootstrap"; // Assuming you're using react-bootstrap for modal
import "./index.scss";
import OTPForm from "./OTPForm";
import { useLoginAndSignupContext } from "../Login/useLoginAndSignupContext";

const LoaderOverlay = () => {
  return (
    <div className="loader-overlay-otp">
      <Spinner animation="border">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  setOtpValue: (otp: string) => void;
  otpValue: string;
  timerResend?: number;
  messageOTP: string;
  isLoading?: boolean;
  handleResend: () => void;
  handleReset: () => void;
  setDisabledBtn: (value: boolean) => void;
  languageData: {
    otp_verification?: string;
    otp_info_message?: string | undefined;
    your_otp_will_expire?: string | undefined;
    confirm_otp?: string | undefined;
    enter_otp_code?: string | undefined;
    resend_otp?: string;
    please_enter_the_otp: string;
    change_mobile_no: string;
    otp_validity_expired_msg: string;
    verify: string;
    otp_timedout_three_wrong_attempts_error_msg: string;
  };
  isInputDisabled?: boolean;
  // Add other props as needed
  contextProvider: boolean;
  errorCode: string;
  resendOTPBtnDisabled: boolean;
}

const OTPValidation: React.FC<Props> = ({
  showModal,
  setShowModal,
  setOtpValue,
  otpValue,
  timerResend,
  messageOTP,
  languageData,
  isLoading,
  handleResend,
  isInputDisabled,
  handleReset,
  setDisabledBtn,
  contextProvider,
  errorCode,
  resendOTPBtnDisabled
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // timeOTP seconds
  const [otpValueIn, setOtpValueIn] = useState<string[]>(Array(4).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [inputDisable, setInputDisable] = useState<boolean>(false); // State to control disabled attribute

  let maskedMobNum;
  let LoginContext, navigateToErrorFrom;
  if (contextProvider) {
    LoginContext = useLoginAndSignupContext();
    navigateToErrorFrom = LoginContext.navigateToErrorFrom;
    maskedMobNum = LoginContext?.loginData?.mobileNumber
      ? LoginContext?.loginData?.mobileNumber
      : LoginContext?.contextMobNum;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newArr = [...otpValueIn];
    const { value } = e.target;

    if (/^\d$/.test(value)) { // Allow only digits
      newArr[index] = value;
      setOtpValueIn(newArr);
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") { // Handle backspace or delete
      newArr[index] = "";
      setOtpValueIn(newArr);
    } else {
      e.target.value = "";
    }

    if (showModal) {
      setOtpValue(newArr.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Delete" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleStepValue = (value) => {
    if (contextProvider) {
      LoginContext?.setStepValue(value);
    }
  };

  const handleClose = () => {
    setDisabledBtn(false);
    handleReset();
    if (timerResend) setTimeLeft(timerResend);
    setIsResendDisabled(false);
    setInputDisable(false);
    setOtpValue("");
    setOtpValueIn(Array(4).fill(""));
    for (let i = 0; i < 4; i++) {
      const inputElement = document.getElementById(
        `input-otp${i + 1}`
      ) as HTMLInputElement;
      inputElement.value = "";
    }
  };

  const handleResendOTP = async () => {
    handleClose();
    handleResend();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getFormattedOTPExpiryMessage = (timeLeft: number): JSX.Element => {

    const formattedTime = formatTime(timeLeft);
    const msg = languageData?.your_otp_will_expire
      ? languageData?.your_otp_will_expire
      : "";
    const htmlContent = msg.replace(
      "<DYNAMIC_SECONDS>",
      `<span class="text-wrapper-4">${formattedTime}</span>`
    );

    return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  useEffect(() => {
    if (showModal || contextProvider) {
      setTimeLeft((timerResend) ?? 120);
    }
  }, [showModal, timerResend, contextProvider]);

  useEffect(() => {
    if (timeLeft > 0 && !isLoading) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setIsResendDisabled(false);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft, isLoading]);

  useEffect(() => {
    // By intially, load the component to clear all otp input box values as empty
    if (!otpValue) {
      setOtpValueIn(Array(4).fill(""));
    }
  }, [otpValue]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {!showModal && contextProvider && (
        <div className="OTPFormValidation">
          {isLoading && <LoaderOverlay />}
          <div className="contentWrapperNew">
            <div className="content">{languageData?.please_enter_the_otp}</div>
            <div className="mobileNo">
              <p>{maskedMobNum}</p>
              {navigateToErrorFrom === 0 && (
                <a
                  href="#"
                  className="hyperlink"
                  onClick={() => handleStepValue(3)}
                >
                  {languageData?.change_mobile_no}
                </a>
              )}
            </div>
          </div>
          <div className="modal-body">
            <OTPForm
              languageData={languageData}
              inputRefs={inputRefs}
              inputDisable={inputDisable}
              isInputDisabled={isInputDisabled}
              otpValueIn={otpValueIn}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              messageOTP={messageOTP}
              timeLeft={timeLeft}
              getFormattedOTPExpiryMessage={getFormattedOTPExpiryMessage}
              isResendDisabled={isResendDisabled}
              handleResendOTP={handleResendOTP}
              errorCode={errorCode}
              resendOTPBtnDisabled={resendOTPBtnDisabled}
              setOtpValue={setOtpValue}
            />
          </div>
        </div>
      )}
      {/* Modal */}
      <Modal
        className="OTPFormValidation"
        show={showModal}
        onHide={() => {
          handleClose();
          setShowModal(false);
        }}
        centered
      >
        {isLoading && <LoaderOverlay />}
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="modal-title">
              {languageData?.otp_verification || languageData?.confirm_otp}
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(languageData.enter_otp_code || languageData.otp_info_message) && (
            <div
              className="messageSection"
              dangerouslySetInnerHTML={{
                __html:
                  (languageData.enter_otp_code ||
                    languageData.otp_info_message) ??
                  "",
              }}
            ></div>
          )}
          <div className="frame-opt-txt">
            <div className="field-wrapper">
              {Array.from({ length: 4 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`digitInputField field ${inputDisable || isInputDisabled || (timeLeft === 0) ? "disabled" : ""}`}
                  id={`input-otp${index + 1}`}
                  type="text"
                  maxLength={1}
                  autoComplete="off"
                  placeholder="-"
                  value={otpValueIn[index]}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={inputDisable || isInputDisabled || (timeLeft === 0)}
                />
              ))}
            </div>
          </div>
          {(messageOTP || timeLeft === 0) && (
            <div className="frame-opt-error">
              {messageOTP ||
                languageData?.otp_timedout_three_wrong_attempts_error_msg}
            </div>
          )}
          <div className="expireOTPSection">
            <div className="expireOTPInnerDiv">
              {timeLeft !== 0 && !isInputDisabled && (
                <span className="span">
                  {getFormattedOTPExpiryMessage(timeLeft)}
                </span>
              )}
            </div>
            <div className="expireOTPInnerDiv2">
              {(timeLeft == 0 && !isResendDisabled) || isInputDisabled ? (
                <a className="hyperlink" target="#"
                  onClick={handleResendOTP}
                >
                  {languageData?.resend_otp}
                </a>
              ) : (
                <a className="hyperlink disabled" target="#">
                  {languageData?.resend_otp}
                </a>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Suspense>
  );
};

export default OTPValidation;
