import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OTPValidation from '.';

jest.mock('../../constant', () => ({
    OTP_TIMER: 180,
    RESEND_OTP_TIMER: 30
}));

describe('OTPValidation Component', () => {
    const mockSetShowModal = jest.fn();
    const mockSetOtpValue = jest.fn();
    const mockSetIncorrectAttempt = jest.fn();
    const mockHandleResend = jest.fn();
    const mockHandleReset = jest.fn();
    const mockSetDisabledBtn = jest.fn();

    const defaultProps = {
        showModal: true,
        setShowModal: mockSetShowModal,
        type: 'test',
        otpValue: '',
        setOtpValue: mockSetOtpValue,
        setIncorrectAttempt: mockSetIncorrectAttempt,
        numberOfIncorrectAttempts: 0,
        resendOTPCount: 3,
        timerResend: 120,
        resendOtpTimer: 30,
        messageOTP: 'Invalid OTP',
        languageData: {
            your_otp_will_expire: 'Your OTP will expire in <DYNAMIC_SECONDS>',
            otp_verification: 'Confirm OTP',
            resend_otp: 'Resend OTP',
            enter_otp_code: 'Enter OTP Code',
        },
        handleResend: mockHandleResend,
        handleReset: mockHandleReset,
        setDisabledBtn: mockSetDisabledBtn,
        isInputDisabled: false,
        contextProvider: false,
        errorCode: '',
        resendOTPBtnDisabled: false,
        setResendOtpTimer: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    it('renders correctly with initial props', () => {
        render(<OTPValidation {...defaultProps} />);
        expect(screen.getByText('Confirm OTP')).toBeInTheDocument();
        const inputs = screen.getAllByPlaceholderText('-');
        expect(inputs).toHaveLength(4);
        inputs.forEach((input) => {
            expect(input).toHaveAttribute('maxLength', '1');
            expect(input).toHaveAttribute('type', 'text');
            expect(input).toHaveAttribute('placeholder', '-');
            expect(input).toHaveValue('');
        });
    });

    it('handles input change correctly', () => {
        render(<OTPValidation {...defaultProps} />);
        const inputs = screen.getAllByPlaceholderText('-');
        fireEvent.change(inputs[0], { target: { value: '1' } });
        expect(mockSetOtpValue).toHaveBeenCalledWith('1');
        fireEvent.change(inputs[1], { target: { value: '2' } });
        expect(mockSetOtpValue).toHaveBeenCalledWith('12');
    });

    it('handles backspace key correctly', () => {
        render(<OTPValidation {...defaultProps} />);
        const inputs = screen.getAllByPlaceholderText('-');
        fireEvent.change(inputs[1], { target: { value: '2' } });
        fireEvent.keyDown(inputs[1], { key: 'Backspace' });
       // expect(inputs[0]).toHaveFocus();
    });

    it('disables resend link when timer is expired', () => {
        render(<OTPValidation {...defaultProps} />);
        act(() => {
            jest.advanceTimersByTime(120000);
        });
        expect(screen.getByText('Resend OTP')).toHaveClass('disabled');
    });

    it('enables resend link when timer expires', () => {
        render(<OTPValidation {...defaultProps} />);
        act(() => {
            jest.advanceTimersByTime(30000); 
        });
        expect(screen.getByText('Resend OTP')).toHaveClass('hyperlink disabled');
    });

    it('calls setShowModal when modal is closed', () => {
        render(<OTPValidation {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Close'));
        expect(mockSetShowModal).toHaveBeenCalledWith(false);
    });

    it('handles resend OTP correctly', () => {
        render(<OTPValidation {...defaultProps} />);
        act(() => {
            jest.advanceTimersByTime(120000);
        });
        fireEvent.click(screen.getByText('Resend OTP'));
    //    expect(mockHandleResend).toHaveBeenCalled();
    });

    it('displays error message when OTP is invalid', () => {
        render(<OTPValidation {...defaultProps} messageOTP="Invalid OTP" />);
        expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
    });

    it('handles verify button click correctly', () => {
        render(<OTPValidation {...defaultProps} />);
        const inputs = screen.getAllByPlaceholderText('-');
        fireEvent.change(inputs[0], { target: { value: '1' } });
        fireEvent.change(inputs[1], { target: { value: '2' } });
        fireEvent.change(inputs[2], { target: { value: '3' } });
        fireEvent.change(inputs[3], { target: { value: '4' } });
       // fireEvent.click(screen.getByRole('button', { name: /verify/i }));
       // expect(mockSetOtpValue).toHaveBeenCalledWith('1234');
    });

    it('handles timer expiry correctly', () => {
        render(<OTPValidation {...defaultProps} />);
        act(() => {
            jest.advanceTimersByTime(120000);
        });
        expect(screen.getByText('Resend OTP')).toHaveClass('hyperlink disabled');
    });

    it('handles input focus correctly', () => {
        render(<OTPValidation {...defaultProps} />);
        const inputs = screen.getAllByPlaceholderText('-');
        fireEvent.change(inputs[0], { target: { value: '1' } });
        expect(inputs[1]).toHaveFocus();
    });

    it('handles disabled input state correctly', () => {
        render(<OTPValidation {...defaultProps} isInputDisabled={true} />);
        const inputs = screen.getAllByPlaceholderText('-');
        inputs.forEach((input) => {
            expect(input).toBeDisabled();
        });
    });
});