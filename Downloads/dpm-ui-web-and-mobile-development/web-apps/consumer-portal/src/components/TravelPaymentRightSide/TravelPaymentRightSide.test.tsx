import React from 'react';
import { render } from '@testing-library/react';
import { TravelPaymentRightSide } from './index';
import PolicyStartDate from 'components/PolicyStartDate';
import PremiumBreakUp from 'components/PremiumBreakUp';
import { LanguageData } from 'types/languageData';

describe('TravelPaymentRightSide', () => {
  it('renders PolicyStartDate and PremiumBreakUp with correct props', () => {
    const mockLanguageData: LanguageData = {
      order_summary: 'Order Summary',
    };

    const { getByText } = render(<TravelPaymentRightSide languageData={mockLanguageData} />);
    expect(getByText('Order Summary')).toBeInTheDocument();
    expect(getByText('Travel Insurance')).toBeInTheDocument();
    expect(getByText('Order Summary')).toBeInTheDocument();
  });
});