import React from 'react';
import { render, screen } from '@testing-library/react';
import {MotorInsurance} from './index';
import { useLocation } from 'react-router-dom';

import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';

jest.mock("components/ContentBenefits", () => jest.fn(() => <div>Content Benefits</div>));
jest.mock('components/hooks/useQuoteAndBuyContext');
(useQuoteAndBuyContext as jest.Mock).mockReturnValue({
  setRedisKey: jest.fn(),
  setOwnerDetailsResponseData: jest.fn(),
  setProductName: jest.fn(),
  setIsRenewpolicy: jest.fn(),
});

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('QuoteAndBuy', () => {
    beforeEach(() => {
        (useLocation as jest.Mock).mockReturnValue({
            state: {
              data: {
                ownerDetail: {
                  ownerFullNameEnglish : "Test Name",
                },
              },
            },
        });
      });
    
    test('renders the product name', () => {
    
        render(<MotorInsurance />);
        const quoteBuy =screen.getByTestId("quote-buy")
        expect(quoteBuy).toBeInTheDocument();       
    });

});