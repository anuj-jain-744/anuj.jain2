import React from 'react';
import { render, screen } from '@testing-library/react';
import TravelDetailCard from './index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { CombinedData } from 'types/languageData';

// Mock image asset
jest.mock('assets/QuoteAndBuy/flightIcon.png', () => 'flight-icon.png');

// Mock the custom hook
jest.mock('components/hooks/useQuoteAndBuyContext');

const mockedUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

const mockLanguageData: CombinedData = {
  travel_start_date: 'Travel Start Date',
  travel_end_date: 'Travel End Date',
  travel_period: 'Travel Period',
  no_of_travellers: 'Number of Travellers',
  policy_period: 'Policy Period',
  premium_amount: 'Premium Amount',
  travellerType: 'Traveller Type',
  sar: 'SAR',
  // add other keys if required
};

const mockPolicyData = {
  policyEffectiveDate: '2024-06-01',
  policyExpiryDate: '2024-06-10',
  pricingOptions: [
    {
      premiumDue: '100.00',
    },
  ],
  purchasedCoverage: [],
  quotationDate: '2024-05-01',
  renewalInd: 'N',
};

describe('TravelDetailCard', () => {
  beforeEach(() => {
    mockedUseQuoteAndBuyContext.mockReturnValue({
      travelStartDate: new Date('2024-06-01'),
      selectedPeriod: '9 days',
      totalCount: 2,
      travellerType: 'family',
    });
  });

  it('renders travel details correctly', () => {
    render(<TravelDetailCard languageData={mockLanguageData} policyRelData={mockPolicyData} />);

    // Labels
    expect(screen.getByText('Travel Start Date')).toBeInTheDocument();
    expect(screen.getByText('Travel End Date')).toBeInTheDocument();
    expect(screen.getByText('Travel Period')).toBeInTheDocument();
    expect(screen.getByText('Number of Travellers')).toBeInTheDocument();

    // Values
    expect(screen.getByText('6/1/2024', { exact: false })).toBeInTheDocument(); // Start date
    expect(screen.getByText('10/06/2024', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('9 days')).toBeInTheDocument(); // Period
    expect(screen.getByText('2')).toBeInTheDocument(); // Number of travellers

    // Traveller Type Section
    expect(screen.getByText('Traveller Type')).toBeInTheDocument();
    expect(screen.getByText('family')).toBeInTheDocument();
  });


  it('handles missing languageData gracefully', () => {
    render(<TravelDetailCard languageData={null} policyRelData={mockPolicyData} />);
    expect(screen.getByText(/default-label/)).toBeInTheDocument();
  });

  it('renders number of travellers as 1 when travellerType is self', () => {
    mockedUseQuoteAndBuyContext.mockReturnValue({
      travelStartDate: new Date('2024-06-01'),
      selectedPeriod: '5 days',
      totalCount: 5,
      travellerType: 'self',
    });

    render(<TravelDetailCard languageData={mockLanguageData} policyRelData={mockPolicyData} />);
    
    expect(screen.getByText('Number of Travellers')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles travellerType missing and shows default value', () => {
    mockedUseQuoteAndBuyContext.mockReturnValue({
      travelStartDate: new Date('2024-06-01'),
      selectedPeriod: '3 days',
      totalCount: 2,
      travellerType: null,
    });

    render(<TravelDetailCard languageData={mockLanguageData} policyRelData={mockPolicyData} />);

    expect(screen.getByText('default-value')).toBeInTheDocument();
  });
  
});
