import { renderHook, act } from "@testing-library/react-hooks";
import { useEndorsementAddBenefitApi } from "./useEndorsementAddBenefit";
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

describe("useEndorsementAddBenefitApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should make a successful API call", async () => {
    const mockResponse = { success: true };
    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() =>
      useEndorsementAddBenefitApi({ PolicyNo: "yourPolicyNumber" })
    );

    act(() => {
      result.current.makeAddBenefitApiCall();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(undefined);
    expect(result.current.benefitData).toEqual(null);
  });

  it("should handle API call errors", async () => {
    const mockError = new Error("API call failed");
    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() =>
      useEndorsementAddBenefitApi({ PolicyNo: "yourPolicyNumber" })
    );

    act(() => {
      result.current.makeAddBenefitApiCall();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.benefitData).toBe(null);
  });
});
