import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PremiumBreakUp from '../index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { usePHQuoteBuyContext } from 'context/PHQuoteBuyContext';
import { useCalculatePremiumApi } from 'hook/motor/useCalculatePremiumApi';

jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn()
}));

jest.mock('context/PHQuoteBuyContext', () => ({
  usePHQuoteBuyContext: jest.fn()
}));

jest.mock('hook/motor/useCalculatePremiumApi', () => ({
  useCalculatePremiumApi: jest.fn()
}));

describe('PremiumBreakUp Component', () => {
  beforeEach(() => {
    useQuoteAndBuyContext.mockReturnValue({
      selectedBenefits: [],
      repairTypeSelected: 'Workshop Repair',
      workShopInitialPrice: 100,
      agencyInitialPrice: 200,
      mathInitialPrice: 300,
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
});
