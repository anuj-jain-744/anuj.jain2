import { renderHook, act } from '@testing-library/react-hooks';
import { useUploadFile } from './useUploadFile'; // Adjust the import path as necessary
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

describe('useUploadFile', () => {
  const mockFileData = [
    { name: 'test.pdf', base64: 'data:application/pdf;base64,...' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.VITE_BACKEND_SAG_BASE_URL = 'http://localhost';
    process.env.VITE_CONTENT_SAG_USERNAME = 'testUser';
    process.env.VITE_CONTENT_SAG_PASSWORD = 'testPassword';
  });

  test('should make a successful API call', async () => {
    const mockResponse = { Status: 'OK' };
    (callAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useUploadFile());

    act(() => {
      result.current.makeApiCall(mockFileData);
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockResponse);
    expect(callAPI).toHaveBeenCalledTimes(1);
  });

  test('should handle missing credentials', async () => {
    delete process.env.VITE_CONTENT_SAG_USERNAME;
    delete process.env.VITE_CONTENT_SAG_PASSWORD;
    const { result } = renderHook(() => useUploadFile());

    await act(async () => {
      await result.current.makeApiCall(mockFileData);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('API credentials are not set');
  });

  test('should handle API call failure', async () => {
    const mockError = new Error('Network Error');
    (callAPI as jest.Mock).mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useUploadFile());

    act(() => {
      result.current.makeApiCall(mockFileData);
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(`API call failed: ${mockError}`);
  });
});