import React from 'react';
import { render, screen } from '@testing-library/react';
import DriverNameCard from './index';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import useCalculatePremiumPayload from 'Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload';
import { useCalculatePremiumApi } from 'hook/motor/useCalculatePremiumApi';

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload');
jest.mock('hook/motor/useCalculatePremiumApi');

describe('DriverNameCard', () => {
  const mockDriverDetailsData = [
    { mainDriverInd: 'Y', driverName: 'John Doe', driverNameArabic: 'جون دو' },
    { mainDriverInd: 'N', driverName: 'Jane Doe', driverNameArabic: 'جين دو' },
  ];

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      driverDetailsResponseData: mockDriverDetailsData,
    });
    (useCalculatePremiumPayload as jest.Mock).mockReturnValue({
      policyRisk: { drivers: mockDriverDetailsData },
    });
    (useCalculatePremiumApi as jest.Mock).mockReturnValue({
      handleCalculatePremium: jest.fn(),
    });
  });

  test('renders correctly when isMounted is true', () => {
    render(<DriverNameCard isMounted={true} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('جين دو')).toBeInTheDocument();
  });

  test('renders correctly when isMounted is false and driverDetailsData is provided', () => {
    render(<DriverNameCard isMounted={false} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('جين دو')).toBeInTheDocument();
  });

  test('calls handleCalculatePremium when conditions are met', () => {
    const { handleCalculatePremium } = useCalculatePremiumApi();
    render(<DriverNameCard isMounted={false} />);
    expect(handleCalculatePremium).toHaveBeenCalledWith({
      policyRisk: { drivers: mockDriverDetailsData },
    });
  });
});