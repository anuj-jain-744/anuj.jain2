import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderSummaryCard from './OrderSummaryCard';

const mockLanguageData = {
  order_summary: 'Order Summary',
  endorsement: 'Endorsement',
  subtotal: 'Subtotal',
  tax: 'Tax',
  vat_amount: 'VAT Amount',
  total_amount: 'Total Amount'
};

const mockAddBenefitData = {
  benefits: [
    { isSelected: true, benefitNameEn: 'Benefit 1', benefitPrice: 100 },
    { isSelected: false, benefitNameEn: 'Benefit 2', benefitPrice: 200 },
    { isSelected: true, benefitNameEn: 'Benefit 3', benefitPrice: 300 }
  ]
};

const mockSubtotal = 400;
const mockVatAmount = 60;
const mockTotalAmount = 460;

describe('OrderSummaryCard', () => {
  test('renders correctly with provided data', () => {
    render(
      <OrderSummaryCard
        languageData={mockLanguageData}
        addBenefitData={mockAddBenefitData}
        subtotal={mockSubtotal}
        vatAmount={mockVatAmount}
        totalAmount={mockTotalAmount}
      />
    );

    // Check if the order summary title is rendered
    expect(screen.getByText('Order Summary')).toBeInTheDocument();

    // Check if the endorsement is rendered
    expect(screen.getByText('Endorsement')).toBeInTheDocument();

    // Check if the selected benefits are rendered
    expect(screen.getByText('Benefit 1')).toBeInTheDocument();
    expect(screen.getByText('SAR 100.00')).toBeInTheDocument();
    expect(screen.getByText('Benefit 3')).toBeInTheDocument();
    expect(screen.getByText('SAR 300.00')).toBeInTheDocument();

    // Check if the subtotal is rendered
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('SAR 400.00')).toBeInTheDocument();

    // Check if the VAT amount is rendered
    expect(screen.getByText('VAT Amount (15%)')).toBeInTheDocument();
    expect(screen.getByText('SAR 60.00')).toBeInTheDocument();

    // Check if the total amount is rendered
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('SAR 460.00')).toBeInTheDocument();
  });
});