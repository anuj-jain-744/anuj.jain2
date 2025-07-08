import { renderHook } from '@testing-library/react-hooks';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import useUpdateRequestPayload from './useUpdateRequestPayload';
import { mapCalculatePremiumPayload } from './mapCalculatePremiumPayload';

// Mock the dependencies
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('./mapCalculatePremiumPayload');

describe('useUpdateRequestPayload', () => {
  const mockTravelDateRange = ['2025-07-01', '2025-07-10'];
  const mockTravellerType = 'individual';
  const mockOwnerDetailsResponseData = {
    nationalId: '1234567890',
    customerNameEnglish: 'John Doe',
    mobile: '1234567890',
    primaryAddress: {
      streetName: '123 Main St',
      city: 'Riyadh',
    },
  };
  const mockMappedPayload = { key: 'value' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelDateRange: [],
      travellerType: null,
      ownerDetailsResponseData: null,
    });
    (mapCalculatePremiumPayload as jest.Mock).mockReturnValue(mockMappedPayload);
  });

  it('should return null when required data is not available', () => {
    const { result } = renderHook(() => useUpdateRequestPayload());
    expect(result.current).toBeNull();
  });

  it('should update the payload when all required data is available', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelDateRange: mockTravelDateRange,
      travellerType: mockTravellerType,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
    });

    const { result } = renderHook(() => useUpdateRequestPayload());

    expect(mapCalculatePremiumPayload).toHaveBeenCalledWith(
      mockTravelDateRange,
      mockTravellerType,
      mockOwnerDetailsResponseData
    );
    expect(result.current).toEqual(mockMappedPayload);
  });

  it('should not update the payload if travelDateRange is incomplete', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelDateRange: ['2025-07-01'],
      travellerType: mockTravellerType,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
    });

    const { result } = renderHook(() => useUpdateRequestPayload());
    expect(result.current).toBeNull();
    expect(mapCalculatePremiumPayload).not.toHaveBeenCalled();
  });

  it('should not update the payload if travellerType is missing', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelDateRange: mockTravelDateRange,
      travellerType: null,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
    });

    const { result } = renderHook(() => useUpdateRequestPayload());
    expect(result.current).toBeNull();
    expect(mapCalculatePremiumPayload).not.toHaveBeenCalled();
  });

  it('should not update the payload if ownerDetailsResponseData is missing', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      travelDateRange: mockTravelDateRange,
      travellerType: mockTravellerType,
      ownerDetailsResponseData: null,
    });

    const { result } = renderHook(() => useUpdateRequestPayload());
    expect(result.current).toBeNull();
    expect(mapCalculatePremiumPayload).not.toHaveBeenCalled();
  });
});