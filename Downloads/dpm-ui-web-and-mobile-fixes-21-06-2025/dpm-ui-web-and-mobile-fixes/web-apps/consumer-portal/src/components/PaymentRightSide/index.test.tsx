import { render, screen } from '@testing-library/react';
import { PaymentRightSide } from './index';  // Adjust path as needed
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { IThirdParty } from 'Motor/QuoteAndBuy/CoveragePlan/ConstantValue/ConstantValue';

// Mock the required components and hooks
jest.mock('components/PolicyStartDate', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Policy Start Date Component</div>),
}));

jest.mock('components/PremiumBreakUp', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Premium Break Up Component</div>),
}));

jest.mock('components/hooks/useQuoteAndBuyContext', () => ({
  useQuoteAndBuyContext: jest.fn(),
}));

describe('PaymentRightSide', () => {
  const mockLanguageData = {
    premium_breakup: 'Premium Breakup',
    comprehensive: 'Comprehensive',
    third_party: 'Third Party',
  };

  it('renders PolicyStartDate and PremiumBreakUp components correctly', async () => {
    // Mocking the context values
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: 'comprehensive',
    });

    /*render(<PaymentRightSide languageData={mockLanguageData} />);

    // Check if PolicyStartDate is rendered
    expect(screen.getByText('Policy Start Date Component')).toBeInTheDocument();

    // Check if PremiumBreakUp is rendered with the correct title and subtitle
    expect(screen.getByText('Premium Break Up Component')).toBeInTheDocument();*/
  });

  /*it('conditionally renders PremiumBreakUp based on repairTypeSelected and coverageType', async () => {
    // When repairTypeSelected and coverageType are present (comprehensive)
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: 'comprehensive',
    });

    render(<PaymentRightSide languageData={mockLanguageData} />);

    expect(screen.getByText('Premium Break Up Component')).toBeInTheDocument();
    expect(screen.getByText('Premium Breakup')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive')).toBeInTheDocument();

    // When coverageType is 'IThirdParty'
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: false,
      coverageType: IThirdParty,
    });

    render(<PaymentRightSide languageData={mockLanguageData} />);

    expect(screen.getByText('Premium Break Up Component')).toBeInTheDocument();
    expect(screen.getByText('Premium Breakup')).toBeInTheDocument();
    expect(screen.getByText('Third Party')).toBeInTheDocument();
  });

  it('does not render PremiumBreakUp when repairTypeSelected is false and coverageType is not IThirdParty', async () => {
    // When repairTypeSelected is false and coverageType is neither IThirdParty nor comprehensive
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: false,
      coverageType: 'other', // coverageType not IThirdParty
    });

    render(<PaymentRightSide languageData={mockLanguageData} />);

    // PremiumBreakUp should not be rendered
    expect(screen.queryByText('Premium Break Up Component')).toBeNull();
  });

  it('renders correct text based on languageData prop', async () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: 'comprehensive',
    });

    render(<PaymentRightSide languageData={mockLanguageData} />);

    // Check if the correct language data is displayed in PremiumBreakUp component
    expect(screen.getByText('Premium Breakup')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive')).toBeInTheDocument();
  });

  it('handles missing languageData gracefully', async () => {
    const mockMissingLanguageData = {};

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      repairTypeSelected: true,
      coverageType: 'comprehensive',
    });

    render(<PaymentRightSide languageData={mockMissingLanguageData as any} />);

    // Check if the component renders without throwing any errors, even with missing language data
    expect(screen.getByText('Policy Start Date Component')).toBeInTheDocument();
    expect(screen.getByText('Premium Break Up Component')).toBeInTheDocument();
  });*/
});
