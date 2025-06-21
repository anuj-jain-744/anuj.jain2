import React, { Suspense, useState, useRef } from "react";
import { Modal, Spinner } from "react-bootstrap"; // Assuming you're using react-bootstrap for modal
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
  handleReset: () => void;
  setDisabledBtn?: (value: boolean) => void;
  languageData: {
    otp_verification?: string;
    otp_info_message?: string | undefined;
    your_otp_will_expire?: string | undefined;
    confirm_otp?: string | undefined;
    enter_otp_code?: string | undefined;
    resend_otp?: string;
    otp_validity_expired_msg: string;
    please_enter_the_mobile_verification_code?: string;
    please_enter_the_email_verification_code?: string;
  };
  isInputDisabled?: boolean;
  // Add other props as needed
}

const OTPValidation: React.FC<Props> = ({
  showModal,
  setShowModal,
  setOtpValue,
  messageOTP,
  languageData,
  isLoading,
  isInputDisabled,
  handleReset,
  setDisabledBtn,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValueIn, setOtpValueIn] = useState<string[]>(Array(4).fill(""));
  const [inputDisable, setInputDisable] = useState<boolean>(false); // State to control disabled attribute

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newArr = [...otpValueIn];
    const { value } = e.target;
    newArr[index] = e.target.value;
    setOtpValueIn(newArr);
    if (/^\d$/.test(value)) {
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      e.target.value = "";
    }
    setOtpValue(newArr.join(""));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClose = () => {
    if (setDisabledBtn) setDisabledBtn(false);
    handleReset();
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Modal */}
      <Modal
        className="OTPValidation"
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
              {Array.from({ length: 4 }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`digitInputField field ${inputDisable || isInputDisabled ? "disabled" : ""
                    }`}
                  id={`input-otp${index + 1}`}
                  type="text"
                  maxLength={1}
                  autoComplete="off"
                  placeholder="-"
                  value={otpValueIn[index]}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={inputDisable || isInputDisabled}
                />
              ))}
            </div>
          </div>
          {messageOTP && <div className="frame-opt-error">{messageOTP}</div>}
        </Modal.Body>
      </Modal>
    </Suspense>
  );
};

export default OTPValidation;
