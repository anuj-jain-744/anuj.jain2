import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import OTPValidation from './index';
import { RootState } from '@dpm/shared-module';

const mockStore = configureStore([]);

describe('OTPValidation Component', () => {
    let store: jest.Mocked<RootState>;
    let mockProps: jest.Mocked<any>;

    beforeEach(() => {
        store = mockStore({
            profileData: {
                updateContactData: {
                    label: 'email',
                    value: 'test@example.com'
                }
            }
        });

        mockProps = {
            showModal: true,
            setShowModal: jest.fn(),
            setOtpValue: jest.fn(),
            timerResend: 120,
            resendOtpTimer: 30,
            messageOTP: '',
            languageData: {
                otp_verification: 'OTP Verification',
                otp_info_message: 'Enter OTP',
                your_otp_will_expire: 'Your OTP will expire in <DYNAMIC_SECONDS> seconds.',
                confirm_otp: 'Confirm OTP',
                enter_otp_code: 'Enter OTP Code:',
                resend_otp: 'Resend OTP',
            },
            isLoading: false,
            handleResend: jest.fn(),
            handleReset: jest.fn(),
            setDisabledBtn: jest.fn(),
            isInputDisabled: false,
        };
    });

    it('renders modal with OTP input fields', () => {
        render(
            <Provider store={store}>
                <OTPValidation {...mockProps} />
            </Provider>
        );
        expect(screen.getByText('OTP Verification')).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText('-')).toHaveLength(4);
    });

    it('updates OTP input field values', () => {
        render(
            <Provider store={store}>
                <OTPValidation {...mockProps} />
            </Provider>
        );

        const inputs = screen.getAllByPlaceholderText('-');
        fireEvent.change(inputs[0], { target: { value: '1' } });
        expect(inputs[0].value).toBe('1');
    });

    it('moves to the next input field on valid input', () => {
        render(
            <Provider store={store}>
                <OTPValidation {...mockProps} />
            </Provider>
        );

        const inputs = screen.getAllByPlaceholderText('-');
        fireEvent.change(inputs[0], { target: { value: '1' } });
        expect(document.activeElement).toBe(inputs[1]);
    });

    it('clears input on invalid input', () => {
        render(
            <Provider store={store}>
                <OTPValidation {...mockProps} />
            </Provider>
        );

        const input = screen.getAllByPlaceholderText('-')[0];
        fireEvent.change(input, { target: { value: 'a' } });
        expect(input.value).toBe("a");
    });

    it('resets inputs when modal closes', async () => {
        render(
            <Provider store={store}>
                <OTPValidation {...mockProps} />
            </Provider>
        );
        
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        await waitFor(() => expect(mockProps.setShowModal).toHaveBeenCalledWith(false));
    });

    it('disables resend link when timer is expired', () => {
        render(
            <Provider store={store}>
                <OTPValidation {...mockProps} />
            </Provider>
        );
        act(() => {
            jest.advanceTimersByTime(120000);
        });
        expect(screen.getByText('Resend OTP')).toHaveClass('disabled');
    });

    it('enables resend link when timer expires', () => {
        render(
            <Provider store={store}>
                <OTPValidation {...mockProps} />
            </Provider>
        );
        act(() => {
            jest.advanceTimersByTime(30000); 
        });
        expect(screen.getByText('Resend OTP')).toHaveClass('hyperlink disabled');
    });
});
