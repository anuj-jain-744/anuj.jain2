import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PremiumBreakUp from '../index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { usePHQuoteBuyContext } from 'context/PHQuoteBuyContext';
import { useCalculatePremiumApi } from 'hook/motor/useCalculatePremiumApi';

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn()
}));

jest.mock('context/PHQuoteBuyContext', () => ({
  usePHQuoteBuyContext: jest.fn()
}));

jest.mock('hook/motor/useCalculatePremiumApi', () => ({
  useCalculatePremiumApi: jest.fn(),
}));

// Mock the OTPWrapper component
jest.mock('components/OTPValidation/OtpWrapper', () => ({
  __esModule: true,
  OTPWrapper: jest.fn((props) => (
    <div data-testid="otp-wrapper">
      <button onClick={props.handleSuccessValidation}>Mock OTP Success</button>
    </div>
  )),
}));


// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

describe('PremiumBreakUp Component', () => {
  const requestPayload = {
    vehicleDetailsResponseData: {
      vehicleType: 'Car',
      vehicleMake: 'Toyota',
      vehicleModel: 'Camry',
      vehicleYear: 2020,
    },
    driverDetailsResponseData: {
      driverName: 'John Doe',
      driverAge: 30,
    },
    ownerDetailsResponseData: {
      ownerName: 'Jane Doe',
      ownerAddress: '123 Main St',
    },
    vehicleDetails: {},
    countryData: { countryCode: 'SA' },
  };

  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue({
      selectedBenefits: [],
      repairTypeSelected: 'Workshop Repair',
      workShopInitialPrice: 100,
      agencyInitialPrice: 200,
      mathInitialPrice: 300,
      comp3rdParty: { pricingOptions: [{ finalAmount: 400 }] },
      premium: 0,
      setPremium: jest.fn(),
      travelcoverage: 'worldwide',
      travelcoverageTypeCode: '1'
    });

    usePHQuoteBuyContext.mockReturnValue({
      selectedContetBenefits: []
    });

    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn()
    });
  });

  test('renders PremiumBreakUp component with title and subtitle', () => {
    render(
      <PremiumBreakUp
        languageData={{ sar: 'SAR', subtotal: 'Subtotal' }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
        producttype="Motor"
      />
    );
    expect(screen.getByText('Premium Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Breakdown Details')).toBeInTheDocument();
  });

  test('toggles promo code switch', () => {
    render(
      <PremiumBreakUp
        languageData={{ apply_promo_code: 'Apply Promo Code', sar: 'SAR' }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
        producttype="Motor"
      />
    );
    const toggleSwitch = screen.getByRole('checkbox');
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).toBeChecked();
  });

  /*test.each([
    ['Workshop Repair', 100],
    ['Mawthoq Repair', 300],
    ['Agency Repair', 200],
    ['Unknown Repair', 400], // Default case
  ])(
    'renders correct price for repairTypeSelected: %s',
    (repairTypeSelected, expectedPrice) => {
      useQuoteAndBuyContext.mockReturnValue({
        selectedBenefits: [],
        repairTypeSelected,
        workShopInitialPrice: 100,
        agencyInitialPrice: 200,
        mathInitialPrice: 300,
        comp3rdParty: { pricingOptions: [{ finalAmount: 400 }] },
        premium: 0,
        setPremium: jest.fn(),
        travelcoverage: 'worldwide',
        travelcoverageTypeCode: '1',
      });

  //     render(
  //       <PremiumBreakUp
  //         languageData={{ sar: 'SAR', subtotal: 'Subtotal' }}
  //         title="Premium Breakdown"
  //         subtitle="Breakdown Details"
  //         producttype="Motor"
  //       />
  //     );

  //     // Assert the correct price is displayed based on repairTypeSelected
  //     expect(screen.getByText(`SAR ${expectedPrice}`)).toBeInTheDocument();
    }
  );



  test('renders OTPWrapper and calls handleSuccessValidation', () => {

    render(
      <PremiumBreakUp
        languageData={{
          enter_otp_code: 'Enter OTP',
          your_otp_will_expire: 'Your OTP will expire soon',
          confirm_otp: 'Confirm OTP',
          resend_otp: 'Resend OTP',
          sar: 'SAR',
        }}
        title="Premium Breakdown"
        subtitle="Breakdown Details"
        producttype="Motor"
        data={{
          config: { promo_code_applied_successfully: 'Promo Applied Successfully' },
        }}
      />
    );

    // Assert that the OTPWrapper is rendered
    const otpWrapper = screen.getByTestId('otp-wrapper');
    expect(otpWrapper).toBeInTheDocument();


  });*/

});