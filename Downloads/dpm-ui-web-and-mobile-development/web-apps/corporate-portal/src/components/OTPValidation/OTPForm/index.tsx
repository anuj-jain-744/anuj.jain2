import React, { Suspense, useEffect, useState, useRef } from "react";
import "../index.scss";
import { join } from "path";

interface OTPFormProps {
  languageData: {
    otp_verification?: string;
    otp_info_message?: string | undefined;
    your_otp_will_expire?: string | undefined;
    confirm_otp?: string | undefined;
    enter_otp_code?: string | undefined;
    resend_otp?: string;
    otp_validity_expired_msg: string;
    verify: string;
    otp_timedout_three_wrong_attempts_error_msg: string;
  };
  inputRefs: any;
  inputDisable: boolean;
  isInputDisabled?: boolean;
  otpValueIn: string[];
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
  messageOTP: string;
  timeLeft: number;
  getFormattedOTPExpiryMessage: any;
  isResendDisabled: boolean;
  handleResendOTP: () => void;
  errorCode: string;
  resendOTPBtnDisabled: boolean;
  setOtpValue: (otp: string) => void;

}

const OTPForm: React.FC<OTPFormProps> = ({
  languageData,
  inputRefs,
  inputDisable,
  isInputDisabled,
  otpValueIn,
  handleInputChange,
  handleKeyDown,
  messageOTP,
  timeLeft,
  getFormattedOTPExpiryMessage,
  isResendDisabled,
  handleResendOTP,
  errorCode,
  resendOTPBtnDisabled,
  setOtpValue
}) => {

  useEffect(() => {
    const otpValue = otpValueIn.join("");
    if (otpValue.length === 4) {
      setOtpValue(otpValue);
    }
  }, [otpValueIn]);

  return (
    <React.Fragment>
      {(languageData.enter_otp_code || languageData.otp_info_message) && (
        <div
          className="messageSection"
          dangerouslySetInnerHTML={{
            __html:
              (languageData.enter_otp_code || languageData.otp_info_message) ??
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
              className={`digitInputField field form-input ${inputDisable || isInputDisabled || (timeLeft === 0) ? "disabled" : ""}`}
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

      {(messageOTP || timeLeft === 0) && !isResendDisabled && (
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
    </React.Fragment>
  );
};

export default OTPForm;
