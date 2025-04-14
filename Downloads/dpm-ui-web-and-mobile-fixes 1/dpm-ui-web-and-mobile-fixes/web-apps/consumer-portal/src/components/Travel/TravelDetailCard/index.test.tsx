import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TravelDetailCard from 'components/Travel/TravelDetailCard';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

// Mock the context used in the component
jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe('TravelDetailCard', () => {
  const mockLanguageData = {
    travellerType: 'Traveller Type',
    travel_start_date: 'Travel Start Date',
    travel_end_date: 'Travel End Date',
    travel_period: 'Travel Period',
    no_of_travellers: 'Number of Travellers',
    policy_period: 'Policy Period',
    premium_amount: 'Premium Amount',
  };

  beforeEach(() => {
    // Mock the context return values
    useQuoteAndBuyContext.mockReturnValue({
      travelStartDate: '01/12/2024',
      selectedPeriod: 'Up to 30 days',
      totalCount: 5,
      travellerType: '1', // 'Family'
    });
  });

  test('renders TravelDetailCard component without crashing', () => {
    render(<TravelDetailCard languageData={mockLanguageData} />);
    
    // Check if the traveller type and travel details are rendered correctly
    expect(screen.getByText('Traveller Type')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('01/12/2024')).toBeInTheDocument(); // Travel start date
    expect(screen.getByText('Up to 30 days')).toBeInTheDocument(); // Travel period
    expect(screen.getByText('5')).toBeInTheDocument(); // Number of travellers
  });

  test('displays the correct traveller type based on context value', () => {
    // Mock traveller type "1" (Family)
    useQuoteAndBuyContext.mockReturnValue({
      travelStartDate: '01/12/2024',
      selectedPeriod: 'Up to 30 days',
      totalCount: 5,
      travellerType: '1', // Family
    });

    render(<TravelDetailCard languageData={mockLanguageData} />);
    
    // Check if "Family" is displayed
    expect(screen.getByText('Family')).toBeInTheDocument();

    // Now change traveller type to "2" (Self)
    useQuoteAndBuyContext.mockReturnValue({
      travelStartDate: '01/12/2024',
      selectedPeriod: 'Up to 30 days',
      totalCount: 5,
      travellerType: '2', // Self
    });

    render(<TravelDetailCard languageData={mockLanguageData} />);

    // Check if "Self" is displayed
    expect(screen.getByText('Self')).toBeInTheDocument();
  });

  test('displays the correct travel data', () => {
    render(<TravelDetailCard languageData={mockLanguageData} />);

    // Check if the travel data labels and values are rendered
    expect(screen.getByText('Travel Start Date')).toBeInTheDocument();
    expect(screen.getByText('01/12/2024')).toBeInTheDocument();
    expect(screen.getByText('Travel End Date')).toBeInTheDocument();
    expect(screen.getByText('30/12/2024')).toBeInTheDocument();
    expect(screen.getByText('Travel Period')).toBeInTheDocument();
    expect(screen.getByText('Up to 30 days')).toBeInTheDocument();
    expect(screen.getByText('Number of Travellers')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('displays the correct policy details', () => {
    render(<TravelDetailCard languageData={mockLanguageData} />);

    // Check if the policy details are rendered
    expect(screen.getByText('Policy Period')).toBeInTheDocument();
    expect(screen.getByText('SAR 40,000.00')).toBeInTheDocument(); // Mocked policy value
    expect(screen.getByText('Premium Amount')).toBeInTheDocument();
  });

  test('renders the travel logo correctly', () => {
    render(<TravelDetailCard languageData={mockLanguageData} />);

    const logo = screen.getByAltText('user icon');
    expect(logo).toBeInTheDocument();
  });
});

