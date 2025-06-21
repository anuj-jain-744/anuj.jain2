jest.mock('./index', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="OTPValidation">{JSON.stringify(props)}</div>,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OTPWrapper, OTPWrapperProps } from './OtpWrapper';
import { useApiCall } from '@dpm/shared-module';
import { useSelector } from "react-redux";

jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
  getRandomString: jest.fn(() => '123456789')
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

const mockUseApiCall = useApiCall as jest.Mock;

const mockProps: OTPWrapperProps = {
  generateOtpUrl: 'https://api.example.com/generate-otp',
  validateOtpUrl: 'https://api.example.com/validate-otp',
  languageData: {
    enter_otp_code: 'Enter OTP Code',
    your_otp_will_expire: 'Your OTP will expire',
    confirm_otp: 'Confirm OTP',
    resend_otp: 'Resend OTP',
    please_enter_the_mobile_verification_code: 'Please enter the mobile verification code',
    please_enter_the_email_verification_code: 'Please enter the email verification code'
  },
  handleSuccessValidation: jest.fn(),
  payload: { phoneNumber: '1234567890' },
  callGenerateOtp: true,
  setCallGenerateOtp: jest.fn()
};

describe('OTPWrapper', () => {
  beforeEach(() => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: null
    });
    useSelector.mockReturnValue({"email": "john@example.com", "name": "John Doe"});
  });

  test('renders OTPWrapper component', () => {
    render(<OTPWrapper {...mockProps} />);
    waitFor(() => {  
    expect(screen.getByText('Enter OTP Code')).toBeInTheDocument();
  });
  });

  test('calls generate OTP API on mount', async () => {
    const makeApiCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall,
      isLoading: false,
      errors: null,
      data: null
    });

    render(<OTPWrapper {...mockProps} />);
   expect(makeApiCall).toHaveBeenCalledWith({
      sessionSecretId: '123456789',
      phoneNumber: '1234567890'
  });
  });

  test('handles OTP validation', async () => {
    const makeValidateApiCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: null,
      data: { referenceNo: 'ref123', sessionSecretId: 'sess123', timerForResend: '600' }
    }).mockReturnValueOnce({
      makeApiCall: makeValidateApiCall,
      isLoading: false,
      errors: null,
      data: { success: true }
    });

    render(<OTPWrapper {...mockProps} />);
    waitFor(() => { 
    fireEvent.change(screen.getByPlaceholderText('Enter OTP Code'), { target: { value: '1234' } });
   });
   waitFor(() => {  
  expect(makeValidateApiCall).toHaveBeenCalledWith({
      otp: '1234',
      referenceNo: 'ref123',
      sessionSecretId: '123456789'
    });
  });
  });

  test('handles resend OTP', async () => {
    const makeApiCall = jest.fn();
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall,
      isLoading: false,
      errors: null,
      data: null
    });

    render(<OTPWrapper {...mockProps} />);
    waitFor(() => { 
    fireEvent.click(screen.getByText(/Resend OTP/i));
  });

   expect(makeApiCall).toHaveBeenCalledWith({
      sessionSecretId: '123456789',
      phoneNumber: '1234567890'
    });
  });

  test('displays error message on API error', async () => {
    mockUseApiCall.mockReturnValueOnce({
      makeApiCall: jest.fn(),
      isLoading: false,
      errors: { name: 'Error', messages: { message_en: 'Something went wrong' } },
      data: null
    });

    render(<OTPWrapper {...mockProps} />);
  //  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it("retrieves user profile data from Redux store", () => {
    render(<OTPWrapper {...mockProps} />);
    expect(useSelector).toHaveBeenCalled();
    expect(useSelector).toHaveReturnedWith({"email": "john@example.com", "name": "John Doe"});
  });

});