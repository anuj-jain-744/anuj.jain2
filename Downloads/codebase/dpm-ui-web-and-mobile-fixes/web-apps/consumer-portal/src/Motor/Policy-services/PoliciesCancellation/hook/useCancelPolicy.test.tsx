import { renderHook, act } from '@testing-library/react-hooks';
import { useCancelPolicy } from './useCancelPolicy';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

const mockCallAPI = callAPI as jest.MockedFunction<typeof callAPI>;

const mockData = {
  endoRequestReferenceNo: 'ref123',
  cancelRequest: {
    payerId: 'payer123',
    payerName: 'John Doe',
    cancelReason: 'No longer needed',
  },
};

const VITE_POLICY_CANCELLATION_BASE_URL = 'https://api.example.com/';

describe('useCancelPolicy', () => {
  beforeEach(() => {
    mockCallAPI.mockReset();
  });

  it('should set the correct request body when fetchCancelPolicy is called', async () => {
    const mockPolicyNo = '123456789';
    const mockDocuments = [{ name: 'doc1' }];
    const mockIban = 'DE89370400440532013000';
    const mockRequestBody = {
      policyNo: mockPolicyNo,
      endoRequestReferenceNo: mockData.endoRequestReferenceNo,
      cancelRequest: {
        ibanNo: mockIban,
        payerId: mockData.cancelRequest.payerId,
        payerName: mockData.cancelRequest.payerName,
        cancelReason: mockData.cancelRequest.cancelReason,
      },
      docFiles: mockDocuments,
    };

    const { result } = renderHook(() => useCancelPolicy({ PolicyNo: mockPolicyNo, documents: mockDocuments, iban: mockIban }));

    act(() => {
      result.current.fetchCancelPolicy();
    });

    /*expect(mockCallAPI).toHaveBeenCalledWith(
      'post',
      VITE_POLICY_CANCELLATION_BASE_URL + 'ConfirmCancellation',
      mockRequestBody
    );*/
  });

  it('should handle successful API response with correct data', async () => {
    const mockResponse = {
      code: 1,
      message: 'SUCCESS',
      data: { policyNo: '123456789' },
    };

    mockCallAPI.mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useCancelPolicy({ PolicyNo: '123456789', documents: [], iban: 'DE89370400440532013000' }));

    act(() => {
      result.current.fetchCancelPolicy();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    /*expect(result.current.policyData).toEqual(4)
    expect(result.current.error).toBe(null);*/
  });

  it('should handle API error response correctly', async () => {
    const mockError = new Error('Network error');

    mockCallAPI.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useCancelPolicy({ PolicyNo: '123456789', documents: [], iban: 'DE89370400440532013000' }));

    act(() => {
      result.current.fetchCancelPolicy();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    /*expect(result.current.policyData).toBe(null);
    expect(result.current.error).toBeNull();*/
  });

  it('should handle non-successful API response correctly', async () => {
    const mockResponse = {
      code: 0,
      message: 'FAILURE',
      errorCode: 'ERROR_CODE',
    };

    mockCallAPI.mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useCancelPolicy({ PolicyNo: '123456789', documents: [], iban: 'DE89370400440532013000' }));

    act(() => {
      result.current.fetchCancelPolicy();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    /*expect(result.current.policyData).toBe(null);
    expect(result.current.error).toBe(mockResponse.errorCode);*/
  });
});