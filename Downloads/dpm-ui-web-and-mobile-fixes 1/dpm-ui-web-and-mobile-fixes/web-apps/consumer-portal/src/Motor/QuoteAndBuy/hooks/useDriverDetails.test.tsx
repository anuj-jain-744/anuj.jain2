import { renderHook, act } from '@testing-library/react-hooks';
import useDriverData, { formatDOB } from './useDriverDetails';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useApiCall } from '@dpm/shared-module';

// Mock necessary modules
jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('@dpm/shared-module', () => ({
  useApiCall: jest.fn(),
}));

describe('formatDOB', () => {
  it('should format the date of birth correctly', () => {
    expect(formatDOB('15-07-1410')).toBe('07-1410');
    expect(formatDOB('20-03-1995')).toBe('03-1995');
  });

  it('should return undefined if the input is undefined', () => {
    expect(formatDOB(undefined)).toBeUndefined();
  });
});

describe('useDriverData Hook', () => {
  let mockSetDriverDetailsResponseData: jest.Mock;
  let mockUseApiCall: jest.Mock;
  let mockDriverApiCall: jest.Mock;

  beforeEach(() => {
    mockSetDriverDetailsResponseData = jest.fn();
    mockUseApiCall = useApiCall as jest.Mock;
    mockDriverApiCall = jest.fn().mockResolvedValue({});

    mockUseApiCall.mockReturnValue({
      makeApiCall: mockDriverApiCall,
      isLoading: false,
      errors: null,
      data: null,
    });

    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      setDriverDetailsResponseData: mockSetDriverDetailsResponseData,
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should not call API if driverId, dobH, or dobG is missing', () => {
    const { result } = renderHook(() =>
      useDriverData({
        driverId: '',
        dobH: '',
        dobG: '',
        mainDriverInd: 'N',
        vehicleDefinitionType: 'Car',
        vehicleId: '123',
      })
    );

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(mockDriverApiCall).not.toHaveBeenCalled();
  });

  it('should call API with correct payload for main driver', async () => {
    const driverDetails = {
      driverId: '123',
      dobH: '15-07-1410',
      dobG: '20-03-1995',
      mainDriverInd: 'Y',
      vehicleDefinitionType: 'Car',
      vehicleId: '456',
    };

    const { result } = renderHook(() => useDriverData(driverDetails));

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(mockUseApiCall).toHaveBeenCalledWith(
      2,
      "/Motor/QuoteAndBuy/V1/GetDriverDetails",
      "post"
    );

    expect(mockDriverApiCall).toHaveBeenCalledWith({
      driverId: '123',
      dobH: '07-1410',
      dobG: '03-1995',
      mainDriverInd: 'Y',
      vehicleDefinitionType: 'Car',
      vehicleId: '456',
    });
  });

  it('should call API with correct payload for additional driver', async () => {
    const driverDetails = {
      driverId: '456',
      dobH: '10-05-1420',
      dobG: '05-12-2000',
      mainDriverInd: 'N',
      vehicleDefinitionType: 'Car',
      vehicleId: '789',
    };

    const { result } = renderHook(() => useDriverData(driverDetails));

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(mockDriverApiCall).toHaveBeenCalledWith({
      driverId: '456',
      dobH: '05-1420',
      dobG: '12-2000',
      mainDriverInd: 'N',
      vehicleDefinitionType: 'Car',
      vehicleId: '789',
    });
  });

  it('should set driver details response data if API call is successful and driver does not exist', async () => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: mockDriverApiCall,
      isLoading: false,
      errors: null,
      data: { driverID: '123', name: 'John Doe' },
    });

    const driverDetails = {
      driverId: '123',
      dobH: '15-07-1410',
      dobG: '20-03-1995',
      mainDriverInd: 'Y',
      vehicleDefinitionType: 'Car',
      vehicleId: '456',
    };

    const { result } = renderHook(() => useDriverData(driverDetails));

    act(() => {
      jest.advanceTimersByTime(600);
    });

    // Simulate the API call resolving
    // mockDriverApiCall.mockResolvedValueOnce({ driverID: '123', name: 'John Doe' });

    // Wait for the promises to resolve
    await act(async () => {
      await Promise.resolve(); // Resolve any pending promises
    });

    expect(mockSetDriverDetailsResponseData).toHaveBeenCalledWith(expect.any(Function));

    // Call the function that was passed to setDriverDetailsResponseData
    const updateFunction = mockSetDriverDetailsResponseData.mock.calls[0][0];
    const newDriverDetails = updateFunction([]); // Pass in the previous state

    expect(newDriverDetails).toEqual([{ driverID: '123', name: 'John Doe' }]);
  });

  it('should not set driver details response data if API call is successful but driver already exists', async () => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: mockDriverApiCall,
      isLoading: false,
      errors: null,
      data: { driverID: '123', name: 'John Doe' },
    });

    const driverDetails = {
      driverId: '123',
      dobH: '15-07-1410',
      dobG: '20-03-1995',
      mainDriverInd: 'Y',
      vehicleDefinitionType: 'Car',
      vehicleId: '456',
    };

    const { result } = renderHook(() => useDriverData(driverDetails));

    act(() => {
      jest.advanceTimersByTime(600);
    });

    const existingDriver = [{ driverID: '123', name: 'Jane Doe' }];

    const updateFunction = mockSetDriverDetailsResponseData.mock.calls[0][0];
    const newDriverDetails = updateFunction(existingDriver); // Pass in the previous state

    expect(newDriverDetails).toEqual(existingDriver);
    expect(mockSetDriverDetailsResponseData).toHaveBeenCalled();
  });

  it('should return loading state and errors from useApiCall', () => {
    mockUseApiCall.mockReturnValue({
      makeApiCall: mockDriverApiCall,
      isLoading: true,
      errors: ['API error'],
      data: null,
    });

    const driverDetails = {
      driverId: '123',
      dobH: '15-07-1410',
      dobG: '20-03-1995',
      mainDriverInd: 'Y',
      vehicleDefinitionType: 'Car',
      vehicleId: '456',
    };
    const { result } = renderHook(() => useDriverData(driverDetails));

    expect(result.current.isDriverLoading).toBe(true);
    expect(result.current.driverApiErrors).toEqual(['API error']);
  });
});
