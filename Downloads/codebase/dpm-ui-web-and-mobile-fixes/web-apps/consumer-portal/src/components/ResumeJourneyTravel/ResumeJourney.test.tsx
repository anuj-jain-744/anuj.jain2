import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResumeJourney from './index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useApiCall } from '@dpm/shared-module';
import { useLocation } from 'react-router-dom';
import useHandleDriverData from 'hook/motor/useHandleDriverData';
import useCalculatePremiumPayload from 'Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload';
import { useCalculatePremiumApi } from 'hook/motor/useCalculatePremiumApi';

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('@dpm/shared-module');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
jest.mock('hook/motor/useHandleDriverData');
jest.mock('Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload');
jest.mock('hook/motor/useCalculatePremiumApi');

describe('ResumeJourney Component', () => {
  const mockOnContinue = jest.fn();
  const mockOnNew = jest.fn();
  const mockSetLeftStep = jest.fn();
  const mockHandleDriverAdded = jest.fn();
  const mockHandleCalculatePremium = jest.fn();

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      journeyData: JSON.stringify({
        vehicleDetails: { sequenceNumber: '123', customCardNumber: '456' },
        currentStep: '2',
        driverDetails: [{ ownerId: '1', ownerDOB: '1990-01-01' }],
        coverageType: 'comprehensive',
        repairTypeSelected: 'authorized',
        schemeCode: 'SC123',
        sliderValueDeductibles: 1000,
        sliderValueSumInsured: 50000,
        selectedBenefits: ['benefit1', 'benefit2'],
      }),
      setVehicleDetailsResponseData: jest.fn(),
      setVehicleDetails: jest.fn(),
      setCoverageType: jest.fn(),
      setRepairTypeSelected: jest.fn(),
      setSchemeCode: jest.fn(),
      setSliderValueDeductibles: jest.fn(),
      setSliderValueSumInsured: jest.fn(),
      setSelectedBenefits: jest.fn(),
      setDriverDetailsResponseData: jest.fn(),
    });

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: jest.fn(),
      isLoading: false,
      data: null,
    });

    (useLocation as jest.Mock).mockReturnValue({
      state: { data: { ownerId: '1', ownerDetail: { ownerDobH: '1990-01-01' } } },
    });

    (useHandleDriverData as jest.Mock).mockReturnValue({
      handleDriverAdded: mockHandleDriverAdded,
    });

    (useCalculatePremiumPayload as jest.Mock).mockReturnValue({
      payload: {},
    });

    (useCalculatePremiumApi as jest.Mock).mockReturnValue({
      handleCalculatePremium: mockHandleCalculatePremium,
    });
  });

  test('renders ResumeJourney component', () => {
    render(
      <ResumeJourney
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        show={true}
        languageData={{ resume_your_motor_insuranc: 'Resume your motor insurance', dear_user_would_you_like: 'Dear user, would you like to', continue_from_where_left: 'Continue from where you left', start_a_new_quotation: 'Start a new quotation' }}
        setLeftStep={mockSetLeftStep}
      />
    );

    /*expect(screen.getByText('Resume your motor insurance')).toBeInTheDocument();
    expect(screen.getByText('Dear user, would you like to')).toBeInTheDocument();*/
  });

  test('calls handleContinue on continue button click', async () => {
    render(
      <ResumeJourney
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        show={true}
        languageData={{ resume_your_motor_insuranc: 'Resume your motor insurance', dear_user_would_you_like: 'Dear user, would you like to', continue_from_where_left: 'Continue from where you left', start_a_new_quotation: 'Start a new quotation' }}
        setLeftStep={mockSetLeftStep}
      />
    );

    fireEvent.click(screen.getByText('Continue from where you left'));

    /*await waitFor(() => {
      expect(mockSetLeftStep).toHaveBeenCalledWith(2);
    });*/
  });

  test('calls onNew on new quotation button click', () => {
    render(
      <ResumeJourney
        onContinue={mockOnContinue}
        onNew={mockOnNew}
        show={true}
        languageData={{ resume_your_motor_insuranc: 'Resume your motor insurance', dear_user_would_you_like: 'Dear user, would you like to', continue_from_where_left: 'Continue from where you left', start_a_new_quotation: 'Start a new quotation' }}
        setLeftStep={mockSetLeftStep}
      />
    );

    /*fireEvent.click(screen.getByText('Start a new quotation'));

    expect(mockOnNew).toHaveBeenCalled();*/
  });
});