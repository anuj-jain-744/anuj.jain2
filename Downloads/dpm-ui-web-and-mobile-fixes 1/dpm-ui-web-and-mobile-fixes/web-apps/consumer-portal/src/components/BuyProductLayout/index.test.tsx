import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Layout from './index';
import { QuoteAndBuyProvider } from 'Motor/QuoteAndBuy/QuoteAndBuyContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock all the hooks and dependencies
jest.mock('Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload', () => ({
  __esModule: true,
  default: jest.fn(() => ({ 
    somePayloadData: 'test'
  }))
}));

jest.mock('hook/motor/useCalculatePremiumApi', () => ({
  useCalculatePremiumApi: jest.fn(() => ({
    handleCalculatePremium: jest.fn(),
    isAllError: false,
    isLoadingCalculatePremium: false,
    isCalculateData: false,
    isError: undefined
  }))
}));

jest.mock('hook/common/useSaveRedisData', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    saveRedisData: jest.fn()
  }))
}));

jest.mock('@dpm/shared-module', () => ({
  isValidEmail: jest.fn((email) => email === 'valid@example.com'),
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: null,
    errors: null,
    isLoading: false
  }))
}));

const mockContext = {
  isTermCondition: true,
  email: 'valid@example.com',
  coverageType: 'comprehensive',
  repairTypeSelected: 'Workshop Repair',
  sliderValueDeductibles: 1000,
  journeyData: null,
  vehicleDetails: { make: 'Toyota', model: 'Camry' },
  setRepairTypeSelected: jest.fn(),
  schemeCode: 'SCHEME123',
  setJourneyData: jest.fn(),
  setRedisKey: jest.fn(),
  addDriverFormData: { name: 'John Doe' },
  selectedBenefits: [{ code: 'B1', price: '100', title: 'Benefit 1' }],
  sliderValueSumInsured: 50000,
  setCoverageType: jest.fn()
};

// Mock the context hook
jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(() => mockContext)
}));

// Updated mock language data with all required properties
const mockLanguageData = {
  select_coverage: 'Select Coverage',
  review_quotation: 'Review Quotation',
  make_payment: 'Make Payment',
  enter_otp_code: 'Enter OTP code',
  your_otp_will_expire: 'Your OTP will expire',
  confirm_otp: 'Confirm OTP',
  resend_otp: 'Resend OTP',
  back: 'Back',
  continue: 'Continue',
  new_quotation: 'New Quotation'
};

// Mock the BuyProductFooter component with unique test IDs for each step
jest.mock('components/BuyProductFooter', () => {
  return {
    __esModule: true,
    default: ({ handleOnClickHandler, buttonTitle, handleBackBtn, classNames }) => (
      <div data-testid={`product-footer-${buttonTitle.replace(/\s/g, '-').toLowerCase()}`} className={classNames}>
        {handleBackBtn && <button onClick={handleBackBtn}>Back</button>}
        <button onClick={handleOnClickHandler}>{buttonTitle}</button>
      </div>
    )
  };
});

// Mock AlertBox component
jest.mock('components/AlertBox', () => ({
  AlertBox: ({ title, description, showAlertModal }) => 
    showAlertModal ? <div data-testid="alert-box">{title}<p>{description}</p></div> : null
}));

// Mock OTPWrapper component
jest.mock('components/OTPValidation/OtpWrapper', () => ({
  OTPWrapper: () => <div data-testid="otp-wrapper"></div>
}));

// Mock ResumeJourney component
jest.mock('components/ResumeJourney', () => {
  return {
    __esModule: true,
    default: ({ show, onContinue, onNew }) => 
      show ? (
        <div data-testid="resume-journey">
          <button onClick={onContinue}>Continue</button>
          <button onClick={onNew}>New</button>
        </div>
      ) : null
  };
});

const mockLeftPanel = <div data-testid="left-panel">Left Panel Content</div>;
const mockRightPanel = <div data-testid="right-panel">Right Panel Content</div>;
const mockNavigateTo = jest.fn();

describe('Layout Component', () => {
  const renderComponent = (step = 1, props = {}) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: '/test', state: { data: { ownerId: '12345', mobileNumber: '1234567890' } } }]}>
        <Routes>
          <Route path="/test" element={
            <Layout
              leftPanel={mockLeftPanel}
              rightPanel={mockRightPanel}
              leftStep={step}
              languageData={mockLanguageData}
              setLeftStep={jest.fn()}
              navigateTo={mockNavigateTo}
              {...props}
            />
          } />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders left and right panels', () => {
    renderComponent();
    
    expect(screen.getByTestId('left-panel')).toBeInTheDocument();
    expect(screen.getByTestId('right-panel')).toBeInTheDocument();
  });

  test('renders Select Coverage button on step 1', () => {
    renderComponent(1);
    
    expect(screen.getByText('Select Coverage')).toBeInTheDocument();
    expect(screen.getByTestId('product-footer-select-coverage')).toBeInTheDocument();
  });

  test('renders Review Quotation button on step 2', () => {
    renderComponent(2);
    
    expect(screen.getByText('Review Quotation')).toBeInTheDocument();
    expect(screen.getByTestId('product-footer-review-quotation')).toBeInTheDocument();
  });

  test('renders Make Payment button on step 3', () => {
    renderComponent(3);
    
    expect(screen.getByText('Make Payment')).toBeInTheDocument();
    expect(screen.getByTestId('product-footer-make-payment')).toBeInTheDocument();
  });

  test('calls handleSelectCoverage when Select Coverage button is clicked', async () => {
    const { useCalculatePremiumApi } = require('hook/motor/useCalculatePremiumApi');
    const mockHandleCalculatePremium = jest.fn();
    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: mockHandleCalculatePremium,
      isAllError: false,
      isLoadingCalculatePremium: false,
      isCalculateData: false
    });

    renderComponent(1);
    
    fireEvent.click(screen.getByText('Select Coverage'));
    
    expect(mockHandleCalculatePremium).toHaveBeenCalled();
  });

  test('updates payment button disabled state based on term condition and email', async () => {
    const { useQuoteAndBuyContext } = require('components/hooks/useQuoteAndBuyContext');
    
    // First render with valid conditions
    useQuoteAndBuyContext.mockReturnValue({
      ...mockContext,
      isTermCondition: true,
      email: 'valid@example.com'
    });
    
    const { rerender } = renderComponent(3);
    
    // Check for active class
    expect(screen.getByTestId('product-footer-make-payment')).toHaveClass('make-btn-payment-active');
    
    // Update context to have invalid email
    useQuoteAndBuyContext.mockReturnValue({
      ...mockContext,
      isTermCondition: true,
      email: 'invalid-email'
    });
    
    // Force re-render
    await act(async () => {
      rerender(
        <MemoryRouter initialEntries={[{ pathname: '/test', state: { data: { ownerId: '12345', mobileNumber: '1234567890' } } }]}>
          <Routes>
            <Route path="/test" element={
              <Layout
                leftPanel={mockLeftPanel}
                rightPanel={mockRightPanel}
                leftStep={3}
                languageData={mockLanguageData}
                setLeftStep={jest.fn()}
                navigateTo={mockNavigateTo}
              />
            } />
          </Routes>
        </MemoryRouter>
      );
    });

    // Check for disabled class
    expect(screen.getByTestId('product-footer-make-payment')).toHaveClass('make-btn-payment');
  });

  test('shows alert when calculatePremium API returns error', async () => {
    const { useCalculatePremiumApi } = require('hook/motor/useCalculatePremiumApi');
    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn(),
      isAllError: true,
      isLoadingCalculatePremium: false,
      isCalculateData: false
    });

    renderComponent(1);
    
    // Wait for the alert to appear
    await waitFor(() => {
      expect(screen.getByTestId('alert-box')).toBeInTheDocument();
    });
  });

  test('updates leftStep when isCalculateData becomes true', async () => {
    const { useCalculatePremiumApi } = require('hook/motor/useCalculatePremiumApi');
    const mockSetLeftStep = jest.fn();
    
    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn(),
      isAllError: false,
      isLoadingCalculatePremium: false,
      isCalculateData: false
    });

    const { rerender } = renderComponent(1, { setLeftStep: mockSetLeftStep });
    
    // Update to simulate API success
    useCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: jest.fn(),
      isAllError: false,
      isLoadingCalculatePremium: false,
      isCalculateData: true
    });
    
    // Trigger a re-render
    await act(async () => {
      rerender(
        <MemoryRouter initialEntries={[{ pathname: '/test', state: { data: { ownerId: '12345', mobileNumber: '1234567890' } } }]}>
          <Routes>
            <Route path="/test" element={
              <Layout
                leftPanel={mockLeftPanel}
                rightPanel={mockRightPanel}
                leftStep={1}
                languageData={mockLanguageData}
                setLeftStep={mockSetLeftStep}
                navigateTo={mockNavigateTo}
              />
            } />
          </Routes>
        </MemoryRouter>
      );
    });
    
    expect(mockSetLeftStep).toHaveBeenCalledWith(2);
  });

  test('handles back button click on step 2', () => {
    const mockSetLeftStep = jest.fn();
    const mockSetCoverageType = jest.fn();
    const mockSetRepairTypeSelected = jest.fn();
    
    const { useQuoteAndBuyContext } = require('components/hooks/useQuoteAndBuyContext');
    useQuoteAndBuyContext.mockReturnValue({
      ...mockContext,
      setCoverageType: mockSetCoverageType,
      setRepairTypeSelected: mockSetRepairTypeSelected
    });
    
    renderComponent(2, { setLeftStep: mockSetLeftStep });
    
    // Find and click the back button
    fireEvent.click(screen.getByText('Back'));
    
    expect(mockSetCoverageType).toHaveBeenCalledWith(null);
    expect(mockSetRepairTypeSelected).toHaveBeenCalledWith(null);
    expect(mockSetLeftStep).toHaveBeenCalledWith(1);
  });

  test('enables review quotation button when conditions are met', async () => {
    const { useQuoteAndBuyContext } = require('components/hooks/useQuoteAndBuyContext');
    
    // First render with conditions where button should be enabled
    useQuoteAndBuyContext.mockReturnValue({
      ...mockContext,
      coverageType: 'comprehensive',
      repairTypeSelected: 'Workshop Repair'
    });
    
    const { rerender } = renderComponent(2);
    
    // Check for active class
    expect(screen.getByTestId('product-footer-review-quotation')).toHaveClass('make-btn-payment-active');
    
    // Update context to conditions where button should be disabled
    useQuoteAndBuyContext.mockReturnValue({
      ...mockContext,
      coverageType: 'comprehensive',
      repairTypeSelected: null
    });
    
    // Force re-render of the same component instance
    await act(async () => {
      rerender(
        <MemoryRouter initialEntries={[{ pathname: '/test', state: { data: { ownerId: '12345', mobileNumber: '1234567890' } } }]}>
          <Routes>
            <Route path="/test" element={
              <Layout
                leftPanel={mockLeftPanel}
                rightPanel={mockRightPanel}
                leftStep={2}
                languageData={mockLanguageData}
                setLeftStep={jest.fn()}
                navigateTo={mockNavigateTo}
              />
            } />
          </Routes>
        </MemoryRouter>
      );
    });
    
    // Check for disabled class
    expect(screen.getByTestId('product-footer-review-quotation')).toHaveClass('make-btn-payment');
  });

  test('navigates to payment success page when quote is generated', async () => {
    const { useApiCall } = require('@dpm/shared-module');
    
    // Mock api call with success response
    useApiCall.mockReturnValue({
      makeApiCall: jest.fn(),
      data: { model: { quoteId: 'QUOTE123' } },
      errors: null,
      isLoading: false
    });

    const useSaveRedisData = require('hook/common/useSaveRedisData').default;
    const mockSaveRedisData = jest.fn();
    useSaveRedisData.mockReturnValue({
      saveRedisData: mockSaveRedisData
    });

    renderComponent(3);
    
    await waitFor(() => {
      expect(mockSaveRedisData).toHaveBeenCalledWith('empty', null, 3);
      expect(mockNavigateTo).toHaveBeenCalledWith('/direct-pay/success', expect.any(Object));
    });
  });
});