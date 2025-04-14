
import { renderHook, act } from '@testing-library/react-hooks';
import { useEndoAddDriverPayment } from './useEndoAddDriverPayment';
import { callAPI } from '@dpm/shared-module';

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn(),
}));

describe('useEndoAddDriverPayment', () => {
  const PolicyNo = 'POL123';
  const SequenceNo = 'SEQ123';
  const ReferenceNo = 'REF123';
  const driverId = 'DRIVER123';

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useEndoAddDriverPayment({ PolicyNo, SequenceNo, ReferenceNo }));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentData).toBe(null);
  });

  it('should set loading state and call API', async () => {
    const { result } = renderHook(() => useEndoAddDriverPayment({ PolicyNo, SequenceNo, ReferenceNo }));

    act(() => {
      result.current.makeAddDriverPaymentApiCall({ driverId });
    });

    expect(result.current.isLoading).toBe(true);
    expect(callAPI).toHaveBeenCalledWith(
      'post',
      expect.any(String),
      expect.objectContaining({
        policyNo: PolicyNo,
        endoRequestReferenceNo: ReferenceNo,
        vehicles: [
          {
            sequenceNo: SequenceNo,
            drivers: [driverId],
          },
        ],
      })
    );
  });

  it('should handle API success response', async () => {
    callAPI.mockResolvedValueOnce({ code: 1, message: 'SUCCESS', data: 'paymentData' });

    const { result, waitForNextUpdate } = renderHook(() => useEndoAddDriverPayment({ PolicyNo, SequenceNo, ReferenceNo }));

    act(() => {
      result.current.makeAddDriverPaymentApiCall({ driverId });
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.paymentData).toEqual({ code: 1, message: 'SUCCESS', data: 'paymentData' });
    expect(result.current.error).toBe(null);
  });

  it('should handle API error response', async () => {
    callAPI.mockResolvedValueOnce({ code: 0, message: 'ERROR', errorCode: 'ERR123' });

    const { result, waitForNextUpdate } = renderHook(() => useEndoAddDriverPayment({ PolicyNo, SequenceNo, ReferenceNo }));

    act(() => {
      result.current.makeAddDriverPaymentApiCall({ driverId });
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.paymentData).toBe(null);
    expect(result.current.error).toBe('ERR123');
  });

  it('should handle API call failure', async () => {
    callAPI.mockRejectedValueOnce(new Error('API call failed'));

    const { result, waitForNextUpdate } = renderHook(() => useEndoAddDriverPayment({ PolicyNo, SequenceNo, ReferenceNo }));

    act(() => {
      result.current.makeAddDriverPaymentApiCall({ driverId });
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.paymentData).toBe(null);
    expect(result.current.error).toBe(null);
  });
});