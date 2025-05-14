import { renderHook, act } from '@testing-library/react-hooks';
import { useCancelRefund } from './useCancelRefund';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

const mockCallAPI = callAPI as jest.MockedFunction<typeof callAPI>;

describe('useCancelRefund', () => {
  beforeEach(() => {
    mockCallAPI.mockReset();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCancelRefund({ PolicyNo: '123456789' }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.policyData).toBe(null);
  });

  it('should set loading state when fetchCancelRefundData is called', async () => {
    const { result } = renderHook(() => useCancelRefund({ PolicyNo: '123456789' }));

    act(() => {
      result.current.fetchCancelRefundData();
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle successful API response', async () => {
    const mockResponse = {
      code: 1,
      message: 'SUCCESS',
      data: { policyNo: '123456789' },
    };

    mockCallAPI.mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useCancelRefund({ PolicyNo: '123456789' }));

    act(() => {
      result.current.fetchCancelRefundData();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.policyData).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
  });

  it('should handle API error response', async () => {
    const mockError = new Error('Network error');

    mockCallAPI.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useCancelRefund({ PolicyNo: '123456789' }));

    act(() => {
      result.current.fetchCancelRefundData();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.policyData).toBe(null);
    expect(result.current.error).toBe(mockError.message);
  });
});