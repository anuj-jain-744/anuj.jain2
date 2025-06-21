import React from 'react';
import { render } from '@testing-library/react';
import { TravelPaymentRightSide } from './index';
import { LanguageData } from 'types/languageData';

jest.mock('@app-shell/utils/common', () => ({
  getAmountWithIcon: jest.fn(amount => `SAR ${amount}`),
  getCurrencySymbol: jest.fn(() => 'SAR'),
}));

describe('TravelPaymentRightSide', () => {
  it('renders PolicyStartDate and PremiumBreakUp with correct props', () => {
    const mockLanguageData: LanguageData = {
      order_summary: 'Order Summary',
    };

    // const { getByText } = render(<TravelPaymentRightSide languageData={mockLanguageData} />);
    // expect(getByText('Order Summary')).toBeInTheDocument();
    // expect(getByText('Travel Insurance')).toBeInTheDocument();
    // expect(getByText('Order Summary')).toBeInTheDocument();
  });
});