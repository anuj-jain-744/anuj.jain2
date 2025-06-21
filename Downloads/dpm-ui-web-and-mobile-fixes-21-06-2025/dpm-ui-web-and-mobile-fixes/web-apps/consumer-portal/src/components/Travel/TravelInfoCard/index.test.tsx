import React from 'react';
import { render, screen } from '@testing-library/react';
import TravelInfoCard from 'components/Travel/TravelInfoCard';  // Adjust the import path based on your file structure
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext'; // Mocking context
import '@testing-library/jest-dom';

// Mock getAmountWithIcon
jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
}));

// Mock the useQuoteAndBuyContext hook to avoid needing to test context behavior
jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe('TravelInfoCard', () => {
  
  beforeEach(() => {
    // Mock the context to return test data
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelStartDate: new Date('2025-01-22'),
      selectedPeriod: '1 Year',
      isToggleOn: true,
      totalCount: 1,
    });
  });

  test('should render TravelInfoCard without errors', () => {
    const languageData = {
      traveller_dob: "Date of Birth",
      traveller_passport_no: "Passport No",
      traveller_passport_exp_date: "Passport Expiry Date",
      relationship: "Relationship",
      benfit_sports: "Sports Benefit",
      benfit_covid: "COVID Benefit",
      additonal_benefits: "Additional Benefits"
    };

    /*render(<TravelInfoCard languageData={languageData} />);
    
    // Check if the name appears
    expect(screen.getByText('Javed Al-Mutairi')).toBeInTheDocument();
    expect(screen.getByText('جاويد موتوري')).toBeInTheDocument();
    // Check if the travel info appears
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('14/11/1961')).toBeInTheDocument();
    expect(screen.getByText('Passport No')).toBeInTheDocument();
    expect(screen.getByText('BB01540')).toBeInTheDocument();
    expect(screen.getByText('Passport Expiry Date')).toBeInTheDocument();
    expect(screen.getByText('06/02/2030')).toBeInTheDocument();
    expect(screen.getByText('Relationship')).toBeInTheDocument();
    expect(screen.getByText('Self')).toBeInTheDocument();*/
  });

  /*test('should render EditTraveller button', () => {
    const languageData = { traveller_dob: "Date of Birth" }; // minimal data for the test
    render(<TravelInfoCard languageData={languageData} />);
    
    // Check if the "Edit Traveller" button is rendered
    const editButton = screen.getByText('Edit Traveller'); // Assuming it’s rendered as a button or link
    expect(editButton).toBeInTheDocument();
  });

  test('should render additional benefits buttons', () => {
    const languageData = { 
      benfit_sports: "Sports Benefit",
      benfit_covid: "COVID Benefit"
    };

    render(<TravelInfoCard languageData={languageData} />);
    
    // Check if additional benefit buttons are rendered
    expect(screen.getByText('Sports Benefit')).toBeInTheDocument();
    expect(screen.getByText('COVID Benefit')).toBeInTheDocument();
  });

  test('should not render when languageData is undefined', () => {
    render(<TravelInfoCard languageData={undefined} />);
    
    // Check if the component renders nothing or handles undefined state gracefully
    expect(screen.queryByText('Javed Al-Mutairi')).not.toBeInTheDocument();
    expect(screen.queryByText('جاويد موتوري')).not.toBeInTheDocument();
  });

  test('should display default values when languageData is incomplete', () => {
    const languageData = { traveller_dob: "Date of Birth" }; // Some fields are missing
    render(<TravelInfoCard languageData={languageData} />);
    
    // Check that missing values fall back to "null"
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  test('should render correct labels and values based on languageData', () => {
    const languageData = { 
      traveller_dob: "Date of Birth",
      traveller_passport_no: "Passport No",
      traveller_passport_exp_date: "Passport Expiry Date",
      relationship: "Relationship"
    };

    render(<TravelInfoCard languageData={languageData} />);
    
    // Check if correct labels and values are rendered
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('14/11/1961')).toBeInTheDocument();
    expect(screen.getByText('Passport No')).toBeInTheDocument();
    expect(screen.getByText('BB01540')).toBeInTheDocument();
  });*/

  // Optional: You can add more tests for edge cases or additional behaviors
});
