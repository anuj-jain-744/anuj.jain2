import { renderHook, act } from '@testing-library/react-hooks';
import { useCancelPolicy } from './useCancelPolicy';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

const mockCallAPI = callAPI as jest.MockedFunction<typeof callAPI>;

describe('useCancelPolicy', () => {
  beforeEach(() => {
    mockCallAPI.mockReset();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCancelPolicy({ PolicyNo: '123456789', documents: [] }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.policyData).toBe(null);
  });

  it('should set loading state when fetchCancelPolicy is called', async () => {
    const { result } = renderHook(() => useCancelPolicy({ PolicyNo: '123456789', documents: [] }));

    act(() => {
      result.current.fetchCancelPolicy();
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

    const { result, waitForNextUpdate } = renderHook(() => useCancelPolicy({ PolicyNo: '123456789', documents: [] }));

    act(() => {
      result.current.fetchCancelPolicy();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.policyData).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
  });

  it('should handle API error response', async () => {
    const mockError = null;

    mockCallAPI.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useCancelPolicy({ PolicyNo: '123456789', documents: [] }));

    act(() => {
      result.current.fetchCancelPolicy();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.policyData).toBe(null);
  });
});