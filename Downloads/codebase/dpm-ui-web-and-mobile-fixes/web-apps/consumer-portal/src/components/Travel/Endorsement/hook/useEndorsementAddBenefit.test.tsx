import { renderHook, act } from "@testing-library/react-hooks";
import { useEndorsementAddBenefitApi } from "./useEndorsementAddBenefit";
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module", () => ({
  callAPI: jest.fn(),
}));

jest.mock("../../../../constant", () => ({
  VITE_ENDORSEMENT_ADD_BENEFIT_BASE_URL: "https://mock-benefit-base-url/",
}));

describe("useEndorsementAddBenefitApi", () => {
  const policyNo = "POLICY123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useEndorsementAddBenefitApi({ PolicyNo: policyNo }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.benefitData).toBe(null);
    expect(typeof result.current.makeAddBenefitApiCall).toBe("function");
  });

  it("makes successful API call and sets benefitData", async () => {
    (callAPI as jest.Mock).mockResolvedValue({
      code: 1,
      message: "SUCCESS",
      data: { benefitId: 101 },
    });

    const { result } = renderHook(() => useEndorsementAddBenefitApi({ PolicyNo: policyNo }));

    await act(async () => {
      await result.current.makeAddBenefitApiCall();
    });

    expect(callAPI).toHaveBeenCalledWith(
      "post",
      "https://mock-benefit-base-url/",
      { policyNo }
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.benefitData).toEqual({
      code: 1,
      message: "SUCCESS",
      data: { benefitId: 101 },
    });
  });

  it("sets error state when API returns errorCode", async () => {
    (callAPI as jest.Mock).mockResolvedValue({
      code: 0,
      message: "FAIL",
      errorCode: "ERR_BENEFIT_001",
    });

    const { result } = renderHook(() => useEndorsementAddBenefitApi({ PolicyNo: policyNo }));

    await act(async () => {
      await result.current.makeAddBenefitApiCall();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.benefitData).toBe(null);
    expect(result.current.error).toBe("ERR_BENEFIT_001");
  });

  it("handles exceptions and logs error", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (callAPI as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useEndorsementAddBenefitApi({ PolicyNo: policyNo }));

    await act(async () => {
      await result.current.makeAddBenefitApiCall();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.benefitData).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error: ", null);

    consoleErrorSpy.mockRestore();
  });
});
