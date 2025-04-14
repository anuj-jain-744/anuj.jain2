import { renderHook } from '@testing-library/react';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import useCalculatePremiumPayload from './useCalculatePremiumPayload';
import { mapCalculatePremiumPayload } from './mapCalculatePremiumPayload';

// Mock the dependencies
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('./mapCalculatePremiumPayload');

describe('useCalculatePremiumPayload', () => {
  // Setup mock data
  const mockVehicleDetailsResponseData = { vehicle: 'data' };
  const mockDriverDetailsResponseData = { driver: 'data' };
  const mockOwnerDetailsResponseData = { owner: 'data' };
  const mockVehicleDetails = { additional: 'details' };
  const mockMappedPayload = { mapped: 'payload' };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the mapping function
    mapCalculatePremiumPayload.mockReturnValue(mockMappedPayload);
  });

  it('should return empty object when required data is not available', () => {
    // Mock context with missing data
    useQuoteAndBuyContext.mockReturnValue({
      vehicleDetailsResponseData: null,
      driverDetailsResponseData: null,
      ownerDetailsResponseData: null,
      vehicleDetails: null,
    });

    const { result } = renderHook(() => useCalculatePremiumPayload());

    expect(result.current).toEqual({});
    expect(mapCalculatePremiumPayload).not.toHaveBeenCalled();
  });

  it('should calculate premium payload when all required data is available', () => {
    // Mock context with all required data
    useQuoteAndBuyContext.mockReturnValue({
      vehicleDetailsResponseData: mockVehicleDetailsResponseData,
      driverDetailsResponseData: mockDriverDetailsResponseData,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
      vehicleDetails: mockVehicleDetails,
    });

    const { result } = renderHook(() => useCalculatePremiumPayload());

    expect(mapCalculatePremiumPayload).toHaveBeenCalledWith(
      mockVehicleDetailsResponseData,
      mockDriverDetailsResponseData,
      mockOwnerDetailsResponseData,
      mockVehicleDetails
    );
    expect(result.current).toEqual(mockMappedPayload);
  });

  it('should calculate premium payload with empty vehicleDetails when not provided', () => {
    // Mock context with required data but no vehicleDetails
    useQuoteAndBuyContext.mockReturnValue({
      vehicleDetailsResponseData: mockVehicleDetailsResponseData,
      driverDetailsResponseData: mockDriverDetailsResponseData,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
      vehicleDetails: null,
    });

    const { result } = renderHook(() => useCalculatePremiumPayload());

    expect(mapCalculatePremiumPayload).toHaveBeenCalledWith(
      mockVehicleDetailsResponseData,
      mockDriverDetailsResponseData,
      mockOwnerDetailsResponseData,
      {}
    );
    expect(result.current).toEqual(mockMappedPayload);
  });

  it('should recalculate when dependencies change', () => {
    const mockContext = {
      vehicleDetailsResponseData: mockVehicleDetailsResponseData,
      driverDetailsResponseData: mockDriverDetailsResponseData,
      ownerDetailsResponseData: mockOwnerDetailsResponseData,
      vehicleDetails: mockVehicleDetails,
    };

    useQuoteAndBuyContext.mockReturnValue(mockContext);

    const { result, rerender } = renderHook(() => useCalculatePremiumPayload());

    // Initial render
    expect(mapCalculatePremiumPayload).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual(mockMappedPayload);

    // Update one of the dependencies
    const updatedContext = {
      ...mockContext,
      vehicleDetails: { new: 'details' },
    };
    useQuoteAndBuyContext.mockReturnValue(updatedContext);

    // Rerender the hook
    rerender();

    // Should call mapCalculatePremiumPayload again with new data
    expect(mapCalculatePremiumPayload).toHaveBeenCalledTimes(2);
    expect(mapCalculatePremiumPayload).toHaveBeenLastCalledWith(
      mockVehicleDetailsResponseData,
      mockDriverDetailsResponseData,
      mockOwnerDetailsResponseData,
      { new: 'details' }
    );
  });
});