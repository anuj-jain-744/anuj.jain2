import { renderHook, act } from '@testing-library/react-hooks';
import { useMasterData } from './useMasterData';
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

describe('useMasterData', () => {
  const mockEnv = {
    VITE_BACKEND_MASTER_DATA_URL: 'https://api.example.com',
  };

  beforeAll(() => {
    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    jest.resetModules();
  });

  test('successful API call', async () => {
    const mockResponse = { status: "OK", data: { key: "value" } };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMasterData('testTable'));

    await act(async () => {
      await result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.relationData).toEqual(mockResponse);
  });

  test('API call failure', async () => {
    const mockError = new Error('Network error');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useMasterData('testTable'));

    await act(async () => {
      await result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null); // Error is logged, not set in state
    expect(result.current.relationData).toBe(null);
  });

  test('state updates correctly during API call', async () => {
    const mockResponse = { status: "OK", data: { key: "value" } };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMasterData('testTable'));

    act(() => {
      result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.relationData).toBe(null);

    await act(async () => {
      await result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.relationData).toEqual(mockResponse);
  });
});