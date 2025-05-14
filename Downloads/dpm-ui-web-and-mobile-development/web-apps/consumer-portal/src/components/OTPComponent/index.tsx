import React, { Suspense, useContext, useEffect, useState, useRef } from "react";
import { Modal } from 'react-bootstrap'; // Assuming you're using react-bootstrap for modal
import './OTPComponent.scss';

interface Props {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    type: string;
    otpValue: string;
    setOtpValue: (otp: string) => void;
    setIncorrectAttempt: (attempt: number) => void;
    numberOfIncorrectAttempts?: number,
    resendOTPCount?: number,
    timerResend?: number,
    languageData: {
        otp_info_message: string;
        your_otp_will_expire: string;
        confirm_otp: string;
        resend_otp: string;
        enter_otp_code: string;
    }
    // Add other props as needed
}

const OTPComponent: React.FC<Props> = (props) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState((props?.timerResend) ? props.timerResend : 120); // timeOTP seconds
    const [noOfAttemp, setNoOfAttempt] = useState(props.resendOTPCount);
    const [resendCount, setresendCount] = useState(0);
    const [otpValueIn, setOtpValueIn] = useState<string[]>(Array(6).fill(''));
    const [isDisabled, setIsDisabled] = useState(true);
    const [inputDisable, setInputDisable] = useState<boolean>(false); // State to control disabled attribute

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newArr = [...otpValueIn];
        const { value } = e.target;
        newArr[index] = e.target.value;
        setOtpValueIn(newArr);
        if (/^\d$/.test(value)) {
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        } else {
            e.target.value = '';
        }
        props.setOtpValue(newArr.join(''));
        // if (newArr.join('').length === 6) {
        //     setInputDisable(true);
        // }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOTP = () => {
        if (resendCount >= parseInt(props.resendOTPCount)) {
            return;
        }
        setTimeLeft(props.timerResend);
        setIsDisabled(true);
        setInputDisable(false);
        props.setOtpValue('');
        setOtpValueIn(Array(6).fill(''));
        for (let i = 0; i < 6; i++) {
            const inputElement = document.getElementById(`input-otp${i + 1}`) as HTMLInputElement;
            inputElement.value = ''
        }
        // setresendCount(resendCount - 1);
        props.setIncorrectAttempt(props.numberOfIncorrectAttempts);
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
                setIsDisabled(false);
            }, 1000);
            return () => clearTimeout(timerId);
        } else {
            setIsDisabled(false);
        }

    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const getFormattedOTPExpiryMessage = (timeLeft: number): JSX.Element => {
        const formattedTime = formatTime(timeLeft);
        const msg = (props?.languageData?.your_otp_will_expire)?props?.languageData?.your_otp_will_expire:"";
        const htmlContent = msg.replace(
            '<DYNAMIC_SECONDS>',
            `<span class="text-wrapper-4">${formattedTime}</span>`
        );

        return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {/* Modal */}
            <Modal show={props.showModal} onHide={() => props.setShowModal(false)} centered>
                <div className="OTPComponent">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <h4 className="modal-title">{props?.languageData?.confirm_otp}</h4>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="messageSection" dangerouslySetInnerHTML={{ __html: props?.languageData.otp_info_message }}></div>
                        <div className="frame-3">
                            {props.type === 'mail' ?
                                <span className="text-wrapper-3">{props.languageData.enter_otp_code}</span> :
                                <span className="text-wrapper-3">{props.languageData.enter_otp_code}</span>}
                            <div className="field-wrapper">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className="digitInputField field"
                                        id={`input-otp${index + 1}`}
                                        type="text"
                                        maxLength={1}
                                        autoComplete="off"
                                        placeholder='-'
                                        value={otpValueIn[index]}
                                        onChange={(e) => handleInputChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        disabled={inputDisable}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="expireOTPSection">
                            <div className="expireOTPInnerDiv">
                                <span className="span">
                                    {getFormattedOTPExpiryMessage(timeLeft)}
                                </span>
                            </div>
                            <div className="expireOTPInnerDiv2">
                                {timeLeft == 0 && !isDisabled ?
                                    <a className="hyperlink" target='#' onClick={handleResendOTP}> {props?.languageData?.resend_otp} </a>
                                    : <a className="hyperlink disabled" target='#'> {props?.languageData?.resend_otp} </a>
                                }
                            </div>
                        </div>
                    </Modal.Body>
                </div >
            </Modal>
        </Suspense>
    );
}

export default OTPComponent;
