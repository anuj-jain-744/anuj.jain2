import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TravelContent, { TravelItem } from './TravelContent';

describe('TravelContent Component', () => {
  
  // Test data for travel items
  const mockTravelData: TravelItem[] = [
    { label: 'Travel Start Date', value: '01/12/2024' },
    { label: 'Travel End Date', value: '30/12/2024' },
    { label: 'Travel Period', value: 'Up to 30 days' },
    { label: 'Number of Travellers', value: '5' },
  ];

  test('renders TravelContent component without crashing', () => {
    render(<TravelContent travelData={mockTravelData} />);
    
    // Check if the labels and values are rendered
    mockTravelData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });

  test('renders correctly when travelData is an empty array', () => {
    render(<TravelContent travelData={[]} />);
    
    // Ensure no labels or values are displayed when travelData is empty
    expect(screen.queryByText('Travel Start Date')).not.toBeInTheDocument();
    expect(screen.queryByText('Travel End Date')).not.toBeInTheDocument();
    expect(screen.queryByText('Up to 30 days')).not.toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });
  
  test('renders all travel items correctly from travelData prop', () => {
    render(<TravelContent travelData={mockTravelData} />);
    
    // Ensure all mock data is displayed as expected
    mockTravelData.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.value)).toBeInTheDocument();
    });
  });
});

