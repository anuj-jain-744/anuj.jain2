import React from 'react';
import { render, screen } from '@testing-library/react';
import PremiumBreakUpBody from '../premiumBreakUpBody';
import { PremiumBreakdown, PromoCodeResponse, LanguageData } from 'types/quoteAndBuy';

const mockPremiumArr: PremiumBreakdown[] = [
  { type: '1', amount: 100, sign: 1 },
  { type: '2', amount: 200, sign: 1 },
];

const mockData: PromoCodeResponse = {
  config: {
    premium_breakdown: [
      { code: '1', description: 'Description 1' },
      { code: '2', description: 'Description 2' },
    ],
  },
};

const mockLanguageData: LanguageData = {
  sar: 'SAR',
  subtotal: 'Subtotal',
  vat_amount: 'VAT Amount',
};

const mockProps = {
  title: 'Test Title',
  premiumArr: mockPremiumArr,
  data: mockData,
  languageData: mockLanguageData,
  isHome: false,
  priceAmount: 300,
  homePriceAmount: { minFinalPrice: 400, vatPrice: 60 },
  repairTypeSelected: 'Repair Type',
  selectedBenefits: [{ title: 'Benefit 1', price: 50, code: 'B1' }],
  subtotalAmount: 350,
  vatAmount: 52.5,
};

describe('PremiumBreakUpBody', () => {
  it('renders correctly with given props', () => {
    render(<PremiumBreakUpBody {...mockProps} />);

    // Check if title is rendered
    expect(screen.getByText('Test Title')).toBeInTheDocument();

    // Check if premium breakdown descriptions are rendered
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    // Check if premium amounts are rendered
    expect(screen.getByText('SAR 100.00')).toBeInTheDocument();
    expect(screen.getByText('SAR 200.00')).toBeInTheDocument();

    // Check if selected benefits are rendered
    expect(screen.getByText('Benefit 1')).toBeInTheDocument();
    expect(screen.getByText('SAR 50.00')).toBeInTheDocument();

    // Check if subtotal amount is rendered
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('SAR 350.00')).toBeInTheDocument();

    // Check if VAT amount is rendered
    expect(screen.getByText('VAT Amount (15%)')).toBeInTheDocument();
    expect(screen.getByText('SAR 52.50')).toBeInTheDocument();
  });
});