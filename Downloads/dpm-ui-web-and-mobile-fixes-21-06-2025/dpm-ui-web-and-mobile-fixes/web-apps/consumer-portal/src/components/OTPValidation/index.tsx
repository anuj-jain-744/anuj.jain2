import React, { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { Modal, Spinner } from "react-bootstrap"; // Assuming you're using react-bootstrap for modal
import { useSelector } from "react-redux";
import { RootState } from "@dpm/shared-module";
import { LanguageData } from "types/languageData";
import { myProfile, OTP_LENGTH, OTP_TIMER } from "constant";
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
  messageOTP: string;
  isLoading?: boolean;
  handleResend: () => void;
  handleReset: () => void;
  setDisabledBtn?: (value: boolean) => void;
  languageData: LanguageData
  isInputDisabled?: boolean;
}

const OTPValidation: React.FC<Props> = ({
  showModal,
  setShowModal,
  setOtpValue,
  timerResend,
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

  const handleCloseOTPModal = () => {
    if (setDisabledBtn) setDisabledBtn(false);
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
    handleCloseOTPModal();
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
      setTimeLeft(timerResend ?? OTP_TIMER); // default to OTP_TIMER = 180 seconds if timerResend is not provided
    }
  }, [showModal, timerResend]);

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Modal */}
      <Modal
        className="OTPValidation"
        show={showModal}
        onHide={() => {
          handleCloseOTPModal();
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
                  (languageData?.enter_otp_code ||
                    languageData?.otp_info_message) ??
                  "",
              }}
            ></div>
          )}
          <div className="frame-opt-txt">
            <div className="field-wrapper">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`digitInputField field ${inputDisable || isInputDisabled || (timeLeft === 0) ? "disabled" : ""
                    }`}
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
          {messageOTP && <div className="frame-opt-error">{messageOTP}</div>}
          {timeLeft === 0 && (
            <div className="frame-opt-error dummy">
              {languageData?.otp_validity_expired_msg}
            </div>
          )}
          <div className="expireOTPSection">
            <div className="expireOTPInnerDiv">
              {timeLeft !== 0 && (
                <span className="span">
                  {getFormattedOTPExpiryMessage(timeLeft)}
                </span>
              )}
            </div>
            <div className="expireOTPInnerDiv2">
              <p>{languageData?.didn_t_receive_otp || "Didn't receive the code? "}</p>
              <a
                className={`hyperlink ${(timeLeft === 0 && !isResendDisabled) || isInputDisabled
                  ? ""
                  : "disabled"
                  }`}
                role="button"
                tabIndex={0}
                target="#"
                onClick={() => {
                  if (
                    (timeLeft === 0 && !isResendDisabled) ||
                    isInputDisabled
                  ) {
                    handleResendOTP();
                  }
                }}
              >
                {languageData?.resend_otp}
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Suspense>
  );
};

export default OTPValidation;
