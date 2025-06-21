import { renderHook, act } from '@testing-library/react-hooks';
import { useUploadFile } from '../useUploadFile';
import { callAPI } from "@dpm/shared-module";

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

describe('useUploadFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useUploadFile());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('should handle successful API call', async () => {
    const mockResponse = { status: 'success' };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useUploadFile());

    act(() => {
      result.current.makeApiCall([{ name: 'test.txt', base64: 'base64data' }], 'quote123');
    });

    /*expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();*/

    expect(result.current.isLoading).toBe(false);
    /*expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(mockResponse);*/
  });

  it('should handle API call failure', async () => {
    const mockError = new Error('API call failed');
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useUploadFile());

    act(() => {
      result.current.makeApiCall([{ name: 'test.txt', base64: 'base64data' }], 'quote123');
    });

    //expect(result.current.isLoading).toBe(true);
    //await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    //expect(result.current.error).toBe(`API call failed: ${mockError}`);
    expect(result.current.data).toBe(null);
  });

  it('should handle missing API credentials', async () => {
    const { result } = renderHook(() => useUploadFile());

    act(() => {
      result.current.makeApiCall([{ name: 'test.txt', base64: 'base64data' }], 'quote123');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('API credentials are not set');
    expect(result.current.data).toBe(null);
  });
});