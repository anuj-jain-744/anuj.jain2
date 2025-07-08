import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewQuotation from './ReviewQuotation';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { LanguageData } from "types/languageData";

// Mock the child components
jest.mock('components/QuoteCard', () => jest.fn(() => <div>QuoteCards</div>));
jest.mock('components/VehicalDetailCard', () => jest.fn(() => <div>VehicalDetailCard</div>));
jest.mock('components/HousePropertyDetails', () => jest.fn(() => <div>HousePropertyDetails</div>));
jest.mock('components/DeclarationCard', () => jest.fn(() => <div>DeclarationCard</div>));
jest.mock('components/SubscribeEmail', () => jest.fn(() => <div>SubscribeEmail</div>));
jest.mock('../../../claims/register/compensation/TermsAndCon', () => jest.fn(() => <div>TermsAndCon</div>));
jest.mock('components/BuyProductHeading', () => jest.fn(() => <div>BuyProductHeading</div>));

jest.mock("components/hooks/useQuoteAndBuyContext", () => ({
    useQuoteAndBuyContext: jest.fn(),
  }));
  const mockLanguageData: LanguageData = {
    review_quotation: 'Review Your Quotation',
      personarrary: [],
      declaration_confirmation: 'Declaration Confirmation',
  };

describe('ReviewQuotation', () => {
  // Mocking the context hook
  const mockSetLeftStep = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetIsTermCondition = jest.fn();

  const mockContextValue = {
    email: '',
    setEmail: mockSetEmail,
    isTermCondition: false,
    setIsTermCondition: mockSetIsTermCondition,
    homePremiumResponse: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render BuyProductHeading and QuoteCards when languageData is provided', () => {
  

    // Mocking the context hook
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(mockContextValue);

    render(<ReviewQuotation languageData={mockLanguageData} setLeftStep={mockSetLeftStep} leftStep={1} />);

    // Check if BuyProductHeading and QuoteCards are rendered
    expect(screen.getByText('BuyProductHeading')).toBeInTheDocument();
    expect(screen.getByText('QuoteCards')).toBeInTheDocument();
  });

  it('should render HousePropertyDetails if homePremiumResponse is not empty', () => {
  

    // Mocking the context with a non-empty homePremiumResponse
    const homePremiumResponse = { property: 'sample property' };
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ ...mockContextValue, homePremiumResponse });

    render(<ReviewQuotation languageData={mockLanguageData} setLeftStep={mockSetLeftStep} leftStep={1} />);

    // Expect HousePropertyDetails to be rendered
    expect(screen.getByText('HousePropertyDetails')).toBeInTheDocument();
    // Ensure VehicalDetailCard is not rendered
    expect(screen.queryByText('VehicalDetailCard')).not.toBeInTheDocument();
  });

  it('should render VehicalDetailCard if homePremiumResponse is empty', () => {
  

    // Mocking the context with an empty homePremiumResponse
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({ ...mockContextValue, homePremiumResponse: {} });

    render(<ReviewQuotation languageData={mockLanguageData} setLeftStep={mockSetLeftStep} leftStep={1} />);

    // Expect VehicalDetailCard to be rendered
    expect(screen.getByText('VehicalDetailCard')).toBeInTheDocument();
    // Ensure HousePropertyDetails is not rendered
    expect(screen.queryByText('HousePropertyDetails')).not.toBeInTheDocument();
  });

  it('should render DeclarationCard, SubscribeEmail, and TermsAndCon', () => {
  

    // Mocking the context hook
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue(mockContextValue);

    render(<ReviewQuotation languageData={mockLanguageData} setLeftStep={mockSetLeftStep} leftStep={1} />);

    // Check if the components DeclarationCard, SubscribeEmail, and TermsAndCon are rendered
    expect(screen.getByText('DeclarationCard')).toBeInTheDocument();
    expect(screen.getByText('SubscribeEmail')).toBeInTheDocument();
    expect(screen.getByText('TermsAndCon')).toBeInTheDocument();
  });
});
