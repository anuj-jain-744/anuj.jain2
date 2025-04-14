import { renderHook, act } from "@testing-library/react-hooks";
import { useEndorsementPayment } from "./useEndorsementPayment"; 
import { callAPI } from "@dpm/shared-module";

jest.mock('@dpm/shared-module', () => ({
  callAPI: jest.fn() as jest.MockedFunction<typeof callAPI>,
}));

describe("useEndorsementPayment", () => {
  const mockPolicyNo = "12345"; 

  it("should initialize with loading, error and paymentData state", () => {
    const { result } = renderHook(() =>
      useEndorsementPayment({ PolicyNo: mockPolicyNo })
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentData).toBe(null);
  });

  it("should handle loading state when makePaymentApiCall is called", async () => {
    const { result } = renderHook(() =>
      useEndorsementPayment({ PolicyNo: mockPolicyNo })
    );

    const mockBenefitId = "benefit-123";

    (callAPI as jest.Mock).mockResolvedValueOnce({ code: 1, message: "SUCCESS" });

    act(() => {
      result.current.makePaymentApiCall({ benefitId: mockBenefitId });
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentData).toBe(null);
  });

  it("should set paymentData when API call is successful", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEndorsementPayment({ PolicyNo: mockPolicyNo })
    );

    const mockBenefitId = "benefit-123";
    const mockApiResponse = { code: 1, message: "SUCCESS", data: "mockData" };

    (callAPI as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    act(() => {
      result.current.makePaymentApiCall({ benefitId: mockBenefitId });
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentData).toBe(mockApiResponse);
  });

  it("should handle errors when API call fails", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEndorsementPayment({ PolicyNo: mockPolicyNo })
    );

    const mockBenefitId = "benefit-123";

    (callAPI as jest.Mock).mockRejectedValueOnce(new Error("API call failed"));

    act(() => {
      result.current.makePaymentApiCall({ benefitId: mockBenefitId });
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentData).toBe(null);
  });

  it("should handle non-success responses from the API call", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useEndorsementPayment({ PolicyNo: mockPolicyNo })
    );

    const mockBenefitId = "benefit-123";
    const mockErrorResponse = { code: 0, message: "FAIL", errorCode: "ERROR_CODE" };

    (callAPI as jest.Mock).mockResolvedValueOnce(mockErrorResponse);

    act(() => {
      result.current.makePaymentApiCall({ benefitId: mockBenefitId });
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockErrorResponse.errorCode);
    expect(result.current.paymentData).toBe(null);
  });
});
