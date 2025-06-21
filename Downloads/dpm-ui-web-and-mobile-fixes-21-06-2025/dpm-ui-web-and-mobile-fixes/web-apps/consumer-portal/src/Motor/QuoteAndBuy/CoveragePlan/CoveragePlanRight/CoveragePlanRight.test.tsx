// CoveragePlanRight.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import CoveragePlanRight from '.';

// Mock all child components
jest.mock('./VehicleInformation', () => (props: any) => <div data-testid="VehicleInformation" {...props}>VehicleInformation</div>);
jest.mock('components/PremiumBreakUp', () => (props: any) => <div data-testid="PremiumBreakUp" {...props}>PremiumBreakUp</div>);
jest.mock('../Components/DidYouKnowPlain', () => (props: any) => <div data-testid="DidYouKnowPlain" {...props}>DidYouKnowPlain</div>);
jest.mock('components/PolicyStartDate', () => (props: any) => <div data-testid="PolicyStartDate" {...props}>PolicyStartDate</div>);
jest.mock('../Components/SumInsuredDeductibleCard', () => (props: any) => <div data-testid="SumInsuredDeductibleCard" {...props}>SumInsuredDeductibleCard</div>);
jest.mock('components/HomeCoverageDeductibleCard', () => (props: any) => <div data-testid="HomeCoverageDeductibleCard" {...props}>HomeCoverageDeductibleCard</div>);
jest.mock('../../../../components/NationalAddress', () => (props: any) => <div data-testid="NationalAddress" {...props}>NationalAddress</div>);
jest.mock('components/ExistingPremiumBreakUp', () => (props: any) => <div data-testid="ExistingPremiumBreakUp" {...props}>ExistingPremiumBreakUp</div>);
jest.mock('components/RenewalPolicy', () => (props: any) => <div data-testid="RenewalPolicy" {...props}>RenewalPolicy</div>);

// Mock hooks
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('context/PHQuoteBuyContext');
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(() => ({
    makeApiCall: jest.fn(),
    data: 'promoData'
  }))
}));

// Mock constants
jest.mock('../ConstantValue/ConstantValue', () => ({
  IThirdParty: 'THIRD_PARTY',
  coverage_plan_for_renew: true
}));

import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { usePHQuoteBuyContext } from 'context/PHQuoteBuyContext';

const languageData = {
  national_address: 'National Address',
  additional_drivers: 'Additional Drivers',
  add_driver: 'Add Driver',
  third_party: 'Third Party',
  title: 'Home Title',
  comprehensive: 'Comprehensive',
  existing_premium_breakup: 'Existing Premium Breakup',
  premium_breakup: 'Premium Breakup'
};

describe('CoveragePlanRight', () => {
  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: 'THIRD_PARTY',
      homePremiumResponse: {},
      isRenewpolicy: false
    });
    (usePHQuoteBuyContext as jest.Mock).mockReturnValue({
      homePolicyRenewal: false
    });
  });

  it('renders PolicyStartDate and NationalAddress', () => {
    render(<CoveragePlanRight languageData={languageData} />);
    expect(screen.getByTestId('PolicyStartDate')).toBeInTheDocument();
    expect(screen.getByTestId('NationalAddress')).toBeInTheDocument();
  });

  it('renders VehicleInformation and SumInsuredDeductibleCard when not home', () => {
    render(<CoveragePlanRight languageData={languageData} />);
    expect(screen.getByTestId('VehicleInformation')).toBeInTheDocument();
    expect(screen.getByTestId('SumInsuredDeductibleCard')).toBeInTheDocument();
  });

  it('renders HomeCoverageDeductibleCard when isHome is true', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValueOnce({
      repairTypeSelected: true,
      coverageType: 'THIRD_PARTY',
      homePremiumResponse: { some: 'data' },
      isRenewpolicy: false
    });
    render(<CoveragePlanRight languageData={languageData} />);
    expect(screen.getByTestId('HomeCoverageDeductibleCard')).toBeInTheDocument();
  });

  it('renders RenewalPolicy when homePolicyRenewal is true', () => {
    (usePHQuoteBuyContext as jest.Mock).mockReturnValueOnce({
      homePolicyRenewal: true
    });
    render(<CoveragePlanRight languageData={languageData} />);
    expect(screen.getByTestId('RenewalPolicy')).toBeInTheDocument();
  });

  it('renders ExistingPremiumBreakUp when coverage_plan_for_renew is true', () => {
    render(<CoveragePlanRight languageData={languageData} />);
    expect(screen.getByTestId('ExistingPremiumBreakUp')).toBeInTheDocument();
  });

  it('renders PremiumBreakUp with correct subtitle for third party', () => {
    render(<CoveragePlanRight languageData={languageData} />);
    const premiumBreakup = screen.getByTestId('PremiumBreakUp');
    expect(premiumBreakup).toHaveTextContent('PremiumBreakUp');
    expect(premiumBreakup).toHaveAttribute('subtitle', languageData.third_party);
  });

  it('renders DidYouKnowPlain when isHome is true', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValueOnce({
      repairTypeSelected: true,
      coverageType: 'THIRD_PARTY',
      homePremiumResponse: { some: 'data' },
      isRenewpolicy: false
    });
    render(<CoveragePlanRight languageData={languageData} />);
    expect(screen.getByTestId('DidYouKnowPlain')).toBeInTheDocument();
  });

  it('renders nothing if languageData is undefined', () => {
    render(<CoveragePlanRight languageData={undefined} />);
    // Should still render PolicyStartDate but not others
    expect(screen.getByTestId('PolicyStartDate')).toBeInTheDocument();
  });

  it('sets subtitle to languageData.title when isHome is true and coverageType is not IThirdParty', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValueOnce({
      repairTypeSelected: true,
      coverageType: 'COMPREHENSIVE', // Not IThirdParty
      homePremiumResponse: { some: 'data' }, // isHome = true
      isRenewpolicy: false
    });
    render(<CoveragePlanRight languageData={languageData} />);
    const premiumBreakup = screen.getByTestId('PremiumBreakUp');
    expect(premiumBreakup).toHaveAttribute('subtitle', languageData.title);
  });
  
  it('sets subtitle to languageData.comprehensive when isHome is false and coverageType is not IThirdParty', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValueOnce({
      repairTypeSelected: true,
      coverageType: 'COMPREHENSIVE', // Not IThirdParty
      homePremiumResponse: {}, // isHome = false
      isRenewpolicy: false
    });
    render(<CoveragePlanRight languageData={languageData} />);
    const premiumBreakup = screen.getByTestId('PremiumBreakUp');
    expect(premiumBreakup).toHaveAttribute('subtitle', languageData.comprehensive);
  });
  
});
