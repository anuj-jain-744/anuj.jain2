import { renderHook, act } from '@testing-library/react-hooks';
import useSaveRedisData from './useSaveRedisData';
import { useQuoteAndBuyContext } from 'components/hooks/useQuoteAndBuyContext';
import { useApiCall } from '@dpm/shared-module';

jest.mock('components/hooks/useQuoteAndBuyContext');
jest.mock('@dpm/shared-module');

describe('useSaveRedisData', () => {
  const mockSetJourneyData = jest.fn();
  const mockMakeApiCall = jest.fn();

  beforeEach(() => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      redisKey: 'testRedisKey',
      journeyData: '',
      setJourneyData: mockSetJourneyData,
    });

    (useApiCall as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update journeyData and call makeApiCall with driverDetails key', () => {
    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('driverDetails', { name: 'John Doe' }, 1);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ currentStep: 1, driverDetails: { name: 'John Doe' } }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ currentStep: 1, driverDetails: { name: 'John Doe' } }) }, true);
  });

  test('should update journeyData and call makeApiCall with multiValue key', () => {
    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('multiValue', { key1: 'value1', key2: 'value2' }, 2);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ currentStep: 2, key1: 'value1', key2: 'value2' }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ currentStep: 2, key1: 'value1', key2: 'value2' }) }, true);
  });

  test('should update journeyData and call makeApiCall with other keys', () => {
    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('otherKey', 'otherValue', 3);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ currentStep: 3, otherKey: 'otherValue' }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ currentStep: 3, otherKey: 'otherValue' }) }, true);
  });

  test('should handle empty journeyData', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      redisKey: 'testRedisKey',
      journeyData: '',
      setJourneyData: mockSetJourneyData,
    });

    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('newKey', 'newValue', 4);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ currentStep: 4, newKey: 'newValue' }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ currentStep: 4, newKey: 'newValue' }) }, true);
  });

  test('should handle empty key', () => {
    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('', 'someValue', 5);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ currentStep: 5 }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ currentStep: 5 }) }, true);
  });

  test('should handle multiValue with non-object value', () => {
    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('multiValue', 'nonObjectValue', 6);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ currentStep: 6, multiValue: 'nonObjectValue' }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ currentStep: 6, multiValue: 'nonObjectValue' }) }, true);
  });

  test('should handle existing journeyData', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      redisKey: 'testRedisKey',
      journeyData: JSON.stringify({ existingKey: 'existingValue' }),
      setJourneyData: mockSetJourneyData,
    });

    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('newKey', 'newValue', 7);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ existingKey: 'existingValue', currentStep: 7, newKey: 'newValue' }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ existingKey: 'existingValue', currentStep: 7, newKey: 'newValue' }) }, true);
  });

  test('should handle invalid JSON in journeyData', () => {
    (useQuoteAndBuyContext as jest.Mock).mockReturnValue({
      redisKey: 'testRedisKey',
      journeyData: '',
      setJourneyData: mockSetJourneyData,
    });

    const { result } = renderHook(() => useSaveRedisData());

    act(() => {
      result.current.saveRedisData('newKey', 'newValue', 8);
    });

    expect(mockSetJourneyData).toHaveBeenCalledWith(JSON.stringify({ currentStep: 8, newKey: 'newValue' }));
    expect(mockMakeApiCall).toHaveBeenCalledWith({ key: 'testRedisKey', value: JSON.stringify({ currentStep: 8, newKey: 'newValue' }) }, true);
  });
});