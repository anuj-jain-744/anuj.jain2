import React, { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { Modal, Spinner } from "react-bootstrap"; // Assuming you're using react-bootstrap for modal
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { myProfile, OTP_LENGTH } from "constant";
import "./index.scss";

export const LoaderOverlay = () => {
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
  timerResend?: number;
  resendOtpTimer?: number;
  messageOTP: string;
  isLoading?: boolean;
  handleResend: () => void;
  handleReset: (val: boolean) => void;
  setDisabledBtn?: (value: boolean) => void;
  languageData: LanguageData
  isInputDisabled?: boolean;
}

const OTPValidation: React.FC<Props> = ({
  showModal,
  setShowModal,
  setOtpValue,
  timerResend,
  resendOtpTimer,
  messageOTP,
  languageData,
  isLoading,
  handleResend,
  isInputDisabled,
  handleReset,
  setDisabledBtn,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // timeOTP seconds
  const [resendTimer, setResendTimer] = useState(0); // Resend OTP enable after configured timer - initial state
  const [otpValueIn, setOtpValueIn] = useState<string[]>(Array(4).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [inputDisable, setInputDisable] = useState<boolean>(false); // State to control disabled attribute

  const myProfileData = useSelector((state: RootState) => state.profileData);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newArr = [...otpValueIn];
      const { value } = e.target;
      newArr[index] = value;
      setOtpValueIn(newArr);
      if (/^\d$/.test(value)) {
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      } else {
        e.target.value = "";
      }
      setOtpValue(newArr.join(""));
    },
    [otpValueIn, setOtpValue]
  );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCloseOTPModal = (isResend:  boolean) => {
    if (setDisabledBtn) setDisabledBtn(false);
    handleReset(isResend);
    if (timerResend) {
      setTimeLeft(timerResend);
      setResendTimer(resendOtpTimer ?? 0); // Reset resend timer to initial value
    }
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
    handleCloseOTPModal(true);
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
    if (showModal) {
      setTimeLeft(timerResend ?? 0); // Default to OTP_TIMER = 180 seconds if timerResend is not provided
      setResendTimer(resendOtpTimer ?? 0); // Default to 0 if resendOtpTimer is not provided
    }
  }, [showModal, timerResend]);

  // Effect to handle the countdown timer for OTP and resend OTP
  useEffect(() => {
    if (timeLeft > 0 && !isLoading) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft > 0 ? timeLeft - 1 : 0);
      }, 1000);
      const resendtimerId = setTimeout(() => {
        setResendTimer(resendTimer > 0 ? resendTimer - 1 : 0);
      }, 1000);
      return () => {
        clearTimeout(timerId);
        clearTimeout(resendtimerId);
      };
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft, isLoading]);

  useEffect(() => {
    setIsResendDisabled(!resendTimer);
  }, [resendTimer]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Modal */}
      <Modal
        className="OTPValidation"
        show={showModal}
        onHide={() => {
          handleCloseOTPModal(false);
          setShowModal(false);
        }}
        centered
        backdrop="static" // Prevent closing on outside click
        keyboard={false}   // Prevent closing on ESC key
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
          <div className="contact-description">
            {languageData?.please_enter_the_email_verification_code && myProfileData?.updateContactData?.label === myProfile.email && (
              <span className="contact-label">
                {languageData?.please_enter_the_email_verification_code}
              </span>
            )}
            {languageData?.otp_info_message && myProfileData?.updateContactData?.label === myProfile.mobile && (
              <span className="contact-label">
                {languageData?.otp_info_message}
              </span>
            )}
            {myProfileData?.updateContactData?.value && (
              <span className="contact-value">
                {myProfileData?.updateContactData?.value}
              </span>
            )}
          </div>
          {(languageData?.enter_otp_code || languageData?.otp_info_message) && (
            <div
              className="messageSection"
              dangerouslySetInnerHTML={{
                __html:
                  (languageData?.enter_otp_code || languageData?.otp_info_message) ?? "",
              }}
            ></div>
          )}
          <div className="frame-opt-txt">
            <div className="field-wrapper">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`digitInputField field form-input ${inputDisable || isInputDisabled || (!timeLeft) ? "disabled" : ""}`}
                  id={`input-otp${index + 1}`}
                  type="text"
                  maxLength={1}
                  autoComplete="off"
                  placeholder="-"
                  value={otpValueIn[index]}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={inputDisable || isInputDisabled || (!timeLeft)}
                />
              ))}
            </div>
          </div>
          {(messageOTP || !timeLeft) && (
            <div className="frame-opt-error">
              {messageOTP || languageData?.otp_validity_expired_msg}
            </div>
          )}
          <div className="expireOTPSection">
            <div className="expireOTPInnerDiv">
              {!!timeLeft && !isInputDisabled && (
                <span className="span">
                  {getFormattedOTPExpiryMessage(timeLeft)}
                </span>
              )}
            </div>
            <div className="expireOTPInnerDiv2">
              <p>{languageData?.didn_t_receive_otp}</p>
              {(!timeLeft) || isInputDisabled || isResendDisabled ? (
                <a className="hyperlink"
                  target="#"
                  role="button"
                  tabIndex={0}
                  data-testid="resend-otp-btn"
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
