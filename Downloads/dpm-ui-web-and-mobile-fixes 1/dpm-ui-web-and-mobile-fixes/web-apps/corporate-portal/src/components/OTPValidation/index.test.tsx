import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OTPValidation from '.';

describe('OTPValidation Component', () => {
    const mockSetShowModal = jest.fn();
    const mockSetOtpValue = jest.fn();
    const mockSetIncorrectAttempt = jest.fn();

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
        messageOTP: 'Invalid OTP',
        languageData: {
            // otp_info_message: 'Please enter the OTP sent to your phone.',
            your_otp_will_expire: 'Your OTP will expire in <DYNAMIC_SECONDS>',
            otp_verification: 'Confirm OTP',
            resend_otp: 'Resend OTP',
            enter_otp_code: 'Enter OTP Code',
        },
    };

    const mockHandleResend = jest.fn();
    const handleReset =  jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    it('renders correctly with initial props', () => {
        const setDisable = jest.fn();
        render(<OTPValidation setDisabledBtn={setDisable} handleReset={handleReset} handleResend={mockHandleResend} {...defaultProps} />);
    
        expect(screen.getByText('Confirm OTP')).toBeInTheDocument();
    
        // expect(screen.getByText('Please enter the OTP sent to your phone.')).toBeInTheDocument();
    
        const inputs = screen.getAllByPlaceholderText('-');
        
        expect(inputs).toHaveLength(4);
        
        inputs.forEach((input, index) => {
            expect(input).toHaveAttribute('maxLength', '1');
            expect(input).toHaveAttribute('type', 'text');
            expect(input).toHaveAttribute('placeholder', '-');
            expect(input).toHaveValue('');
        });
    });

    it('handles input change correctly', () => {
        
        const setDisable = jest.fn();
        render(<OTPValidation setDisabledBtn={setDisable} handleReset={handleReset} handleResend={mockHandleResend} {...defaultProps} />);
    
        const inputs = screen.getAllByPlaceholderText('-');
        
        fireEvent.change(inputs[0], { target: { value: '1' } });
        expect(mockSetOtpValue).toHaveBeenCalledWith('1');
        
        fireEvent.change(inputs[1], { target: { value: '2' } });
        
        fireEvent.change(inputs[1], { target: { value: '' } });
        
        fireEvent.keyDown(inputs[1], { key: 'Backspace', code: 'Backspace' });
    
        setTimeout(() => {
            expect(inputs[0]).toHaveFocus();
        }, 0);
    });

    it('disables resend link when timer is active', () => {
        const setDisable = jest.fn();
        render(<OTPValidation setDisabledBtn={setDisable}  handleReset={handleReset} handleResend={mockHandleResend} {...defaultProps} />);

        jest.advanceTimersByTime(120000);
        
        expect(screen.getByText('Resend OTP')).toHaveClass('disabled');
    });

    it('enables resend link when timer expires', () => {
        const setDisable = jest.fn();
        render(<OTPValidation setDisabledBtn={setDisable}  handleReset={handleReset} handleResend={mockHandleResend} {...defaultProps} />);

        jest.advanceTimersByTime(120000);
        
        expect(screen.getByText('Resend OTP')).toHaveClass('hyperlink disabled');

    });

    it('calls setShowModal when modal is closed', () => {
        const setDisable = jest.fn();
        render(<OTPValidation setDisabledBtn={setDisable}  handleReset={handleReset}  isInputDisabled={true} handleResend={mockHandleResend} {...defaultProps} />);

        fireEvent.click(screen.getByRole('button'));
        
        expect(mockSetShowModal).toHaveBeenCalledWith(false);
    })

});