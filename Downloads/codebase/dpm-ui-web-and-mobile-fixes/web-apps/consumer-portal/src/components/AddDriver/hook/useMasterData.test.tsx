// useMasterData.test.tsx

import { renderHook, act } from '@testing-library/react-hooks';
import { useMasterData } from './useMasterData';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

describe('useMasterData', () => {
  const tableName = 'testTable';
  const mockResponse = { status: 'OK', data: 'testData' };
  const mockError = { status: 'ERROR', errorCode: '404' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should set loading state correctly', async () => {
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useMasterData(tableName));

    act(() => {
      result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
  });

  test('should set masterData on successful API call', async () => {
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useMasterData(tableName));

    act(() => {
      result.current.makeMasterApiCall();
    });

    await waitForNextUpdate();

    expect(result.current.masterData).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  test('should set error on failed API call', async () => {
    (callAPI as jest.Mock).mockResolvedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useMasterData(tableName));

    act(() => {
      result.current.makeMasterApiCall();
    });

    await waitForNextUpdate();

    expect(result.current.error).toEqual(mockError.errorCode);
    expect(result.current.masterData).toBeNull();
  });

  test('should handle API call exception', async () => {
    (callAPI as jest.Mock).mockRejectedValue(new Error('API call failed'));

    const { result, waitForNextUpdate } = renderHook(() => useMasterData(tableName));

    act(() => {
      result.current.makeMasterApiCall();
    });

    await waitForNextUpdate();

    expect(result.current.error).toBeNull();
    expect(result.current.masterData).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});