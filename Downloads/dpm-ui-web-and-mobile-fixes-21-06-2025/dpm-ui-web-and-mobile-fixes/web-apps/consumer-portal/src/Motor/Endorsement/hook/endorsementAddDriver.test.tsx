import { renderHook, act } from '@testing-library/react-hooks';
import { useEndorsementAddDriverApi } from './endorsementAddDriver';
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

describe('useEndorsementAddDriverApi', () => {
  const mockEnv = {
    VITE_ENDORSEMENT_ADD_DRIVER_BASE_URL: 'https://api.example.com',
    VITE_CONTENT_SAG_USERNAME: 'testUser',
    VITE_CONTENT_SAG_PASSWORD: 'testPass',
  };

  beforeAll(() => {
    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    jest.resetModules();
  });

  test('successful API call', async () => {
    const mockResponse = { status: 200 };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useEndorsementAddDriverApi());

    await act(async () => {
      const response = await result.current.makeApiCall1();
      expect(response).toEqual(mockResponse);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockResponse);
  });

  test('API call with missing credentials', async () => {
    process.env.VITE_CONTENT_SAG_USERNAME = '';
    process.env.VITE_CONTENT_SAG_PASSWORD = '';

    const { result } = renderHook(() => useEndorsementAddDriverApi());

    await act(async () => {
      const response = await result.current.makeApiCall1();
      // expect(response).toBe(null);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('API credentials are not set');
    expect(result.current.data).toBe(null);

    process.env.VITE_CONTENT_SAG_USERNAME = 'testUser';
    process.env.VITE_CONTENT_SAG_PASSWORD = 'testPass';
  });

  test('API call failure', async () => {
    const mockError = new Error('Network error');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useEndorsementAddDriverApi());

    await act(async () => {
      const response = await result.current.makeApiCall1();
      // expect(response).toBe(null);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('API call failed: Network error');
    expect(result.current.data).toBe(null);
  });

  test('state updates correctly during API call', async () => {
    const mockResponse = { status: 200 };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useEndorsementAddDriverApi());

    act(() => {
      result.current.makeApiCall1();
    });

    // expect(result.current.isLoading).toBe(true);
    // expect(result.current.error).toBe(null);
    // expect(result.current.data).toBe(null);

    await act(async () => {
      await result.current.makeApiCall1();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockResponse);
  });
});