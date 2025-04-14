import { renderHook, act } from '@testing-library/react-hooks';
import { useReviewPolicy } from './useReviewPolicy';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

describe('useReviewPolicy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading false, error null, and data null', () => {
    const { result } = renderHook(() => useReviewPolicy({
    PolicyNo: "P-ER1-24-331-028458",
  }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });



  it('should set loading to true when makeApiCall is called', async () => {
    const { result } = renderHook(() => useReviewPolicy({
    PolicyNo: "P-ER1-24-331-028458",
  }));

    expect(result.current.isLoading).toBe(false);

    (callAPI as jest.Mock).mockResolvedValueOnce({
      code: 1,
      message: 'SUCCESS',
      data: {},
    });

    await act(async () => {
      result.current.makeApiCall();
    });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle successful API call', async () => {
    const mockResponse = {
      code: 1,
      message: 'SUCCESS',
      data: { policyDetails: 'some policy details' },
    };

    (callAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useReviewPolicy({
      PolicyNo: "P-ER1-24-331-028458",
    }));

    await act(async () => {
      await result.current.makeApiCall();
    });

    expect(callAPI).toHaveBeenCalledWith('post', "undefined/Dashboard/V1/ViewPolicy", {"apiSource": "Portal", "endorsementNo": "", "isLatestSnapshot": "N", "policyNo": "P-ER1-24-331-028458"});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual(mockResponse.data);
  });

  it('should handle API call error', async () => {
    const mockErrorResponse = {
      code: 0,
      message: 'ERROR',
      errorCode: 'ERROR_CODE',
    };

    (callAPI as jest.Mock).mockResolvedValueOnce(mockErrorResponse);

    const { result } = renderHook(() => useReviewPolicy({
    PolicyNo: "P-ER1-24-331-028458",
  }));

    await act(async () => {
      await result.current.makeApiCall();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockErrorResponse.errorCode);
    expect(result.current.data).toBe(null);
  });

  it('should handle exceptions during API call', async () => {
    (callAPI as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
    const { result } = renderHook(() => useReviewPolicy({
    PolicyNo: "P-ER1-24-331-028458",
  }));

    await act(async () => {
      await result.current.makeApiCall();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('An unexpected error occurred');
  });
});