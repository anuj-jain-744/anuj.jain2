import { render, screen } from '@testing-library/react';
import CoveragePlanFooter from './CoveragePlanFooter';
import '@testing-library/jest-dom';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { LanguageData } from 'types/languageData';
import { calculatePremium } from 'Motor/QuoteAndBuy/utils/calculatePremium';

// Mock necessary modules and functions
jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

jest.mock('@dpm/shared-module', () => ({
  getAmountText: jest.fn(() => 'SAR 1000.00'),
}));

jest.mock('../../CommonFunction/CommonFunction', () => ({
  compensationTypeCardFinalVAT: jest.fn(() => 10), // Mock VAT value
}));

jest.mock('Home/QuoteAndBuy/utils/calculatePremium', () => ({
  calculatePremium: jest.fn(() => ({
    minFinalPrice: 1000,
    vatPrice: 100, // mock the VAT value
  })),
}));

describe('CoveragePlanFooter Component', () => {
  const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.Mock;

  const languageData: LanguageData = {
    starting_from: 'Starting From',
    sar: 'SAR',
    vat: 'VAT',
    home_headers: 'coverage1, coverage2', // Example headers
  };

  const mockHomePremiumResponse = {
    coverage1: {
      minFinalPrice: 1000,
      vatPrice: 100,
    },
    coverage2: {
      minFinalPrice: 1500,
      vatPrice: 150,
    },
  };

  beforeEach(() => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      homePremiumResponse: mockHomePremiumResponse,
    });
  });

  test('should render correct coverage plan footer', () => {
    render(<CoveragePlanFooter languageData={languageData} label="home" />);

    // Check if starting from text is rendered
    expect(screen.getByText(languageData.starting_from)).toBeInTheDocument();
    
    // Check if the SAR text is displayed
    expect(screen.getByText(languageData.sar)).toBeInTheDocument();
    
    // Check if the correct amount is displayed
    expect(screen.getByText('SAR 1000.00')).toBeInTheDocument(); // This is coming from the mock getAmountText function
    
    // Check if the VAT text is displayed
    expect(screen.getByText(`+ 10% VAT`)).toBeInTheDocument(); // This is coming from the mock compensationTypeCardFinalVAT function
  });

  test('should calculate and display premium correctly', async () => {
    render(<CoveragePlanFooter languageData={languageData} label="home" />);

    // Ensure that the premium is calculated correctly from the `homePremiumResponse`
    expect(calculatePremium).toHaveBeenCalledWith({
      coverage1: mockHomePremiumResponse.coverage1,
      coverage2: mockHomePremiumResponse.coverage2,
    });
    
    // Check if the correct calculated price and VAT are displayed
    expect(screen.getByText('SAR 1000.00')).toBeInTheDocument();
    expect(screen.getByText(`+ 10% VAT`)).toBeInTheDocument();
  });

  test('should handle empty homePremiumResponse gracefully', () => {
    mockUseQuoteAndBuyContext.mockReturnValue({
      homePremiumResponse: {}, // No premium data
    });

    render(<CoveragePlanFooter languageData={languageData} label="home" />);

    // Ensure that nothing is displayed if there is no premium data
    expect(screen.queryByText('SAR')).not.toBeInTheDocument();
    expect(screen.queryByText('VAT')).not.toBeInTheDocument();
  });

  test('should render with correct language data', () => {
    const customLanguageData: LanguageData = {
      starting_from: 'A partir de',
      sar: 'SAR',
      vat: 'TVA',
      home_headers: ['coverage1', 'coverage2'],
    };

    render(<CoveragePlanFooter languageData={customLanguageData} label="home" />);

    // Check if the translated text is displayed correctly
    expect(screen.getByText('A partir de')).toBeInTheDocument();
    expect(screen.getByText('SAR')).toBeInTheDocument();
    expect(screen.getByText('TVA')).toBeInTheDocument();
  });
});
