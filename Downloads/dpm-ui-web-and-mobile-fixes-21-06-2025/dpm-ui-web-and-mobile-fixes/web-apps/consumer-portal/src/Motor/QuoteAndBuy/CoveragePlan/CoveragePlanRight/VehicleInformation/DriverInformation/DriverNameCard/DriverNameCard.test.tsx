// DriverNameCard.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DriverNameCard from '.';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useSelector } from 'react-redux';
import { useCalculatePremiumApi } from 'hook/motor/useCalculatePremiumApi';

// Mock all dependencies
jest.mock('react-redux');
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload');
jest.mock('hook/motor/useCalculatePremiumApi');
jest.mock('utils/quoteAndBuy', () => ({
  getGenderProfileIcon: jest.fn((gender) => 
    gender === 'M' ? 'male-icon.png' : 'female-icon.png'
  )
}));

const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockUseQuoteAndBuyContext = useQuoteAndBuyContext as jest.MockedFunction<typeof useQuoteAndBuyContext>;
const mockUseCalculatePremiumApi = useCalculatePremiumApi as jest.MockedFunction<typeof useCalculatePremiumApi>;

describe('DriverNameCard', () => {
  const mockUserInfo = { userId: 'user123' };
  const mockDriverData = [
    {
      driverID: 'user123',
      mainDriverInd: 'Y',
      driverName: 'Main Driver',
      gender: 'M'
    },
    {
      driverID: 'driver456',
      mainDriverInd: 'N',
      driverName: 'Additional Driver 1',
      driverNameArabic: 'سائق إضافي ١',
      gender: 'F'
    },
    {
      driverID: 'driver789',
      mainDriverInd: 'N',
      driverName: 'Additional Driver 2',
      driverNameArabic: 'سائق إضافي ٢',
      gender: 'M'
    }
  ];

  beforeEach(() => {
    mockUseSelector.mockImplementation((selector) => selector({
      auth: { userInfo: mockUserInfo }
    }));

    mockUseQuoteAndBuyContext.mockReturnValue({
      driverDetailsResponseData: mockDriverData
    });

    (useCalculatePremiumApi as jest.Mock).mockReturnValue({
      handleCalculatePremium: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ... previous tests ...

  it('should call handleCalculatePremium when conditions are met', async () => {
    const mockHandleCalculatePremium = jest.fn();
    mockUseCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: mockHandleCalculatePremium
    });

    // Mock the premium payload
    require('Motor/QuoteAndBuy/hooks/useCalculatePremiumPayload').default
      .mockImplementation(() => ({
        policyRisk: {
          drivers: mockDriverData // Matching driver count
        }
      }));

    render(<DriverNameCard isMounted={false} />);
    
    await waitFor(() => {
      expect(mockHandleCalculatePremium).toHaveBeenCalled();
    });
  });

  it('should not call handleCalculatePremium when isMounted is true', () => {
    const mockHandleCalculatePremium = jest.fn();
    mockUseCalculatePremiumApi.mockReturnValue({
      handleCalculatePremium: mockHandleCalculatePremium
    });

    render(<DriverNameCard isMounted={true} />);
    
    expect(mockHandleCalculatePremium).not.toHaveBeenCalled();
  });

  it('should display correct gender icons', () => {
    render(<DriverNameCard isMounted={false} />);
    
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'female-icon.png');
    expect(images[1]).toHaveAttribute('src', 'male-icon.png');
  });

  it('should show empty state when no additional drivers exist', () => {
    mockUseQuoteAndBuyContext.mockReturnValueOnce({
      driverDetailsResponseData: [mockDriverData[0]]
    });

    render(<DriverNameCard isMounted={false} />);
  });

  it('should update driver list when userInfo changes', () => {
    const { rerender } = render(<DriverNameCard isMounted={false} />);
    
    // Initial state shows 2 additional drivers
    expect(screen.getAllByText(/Additional Driver/)).toHaveLength(2);

    // Change user ID to match second driver
    mockUseSelector.mockImplementationOnce((selector) => selector({
      auth: { userInfo: { userId: 'driver456' } }
    }));

    rerender(<DriverNameCard isMounted={false} />);
  });
});
