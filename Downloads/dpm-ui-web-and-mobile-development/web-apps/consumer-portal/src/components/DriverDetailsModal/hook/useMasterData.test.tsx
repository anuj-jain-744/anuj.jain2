import { renderHook, act } from "@testing-library/react-hooks";
import { useMasterData } from "./useMasterData";
import { callAPI } from "@dpm/shared-module";

jest.mock("@dpm/shared-module");

const mockCallAPI = callAPI as jest.Mock;

describe("useMasterData Hook", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("initializes correctly", () => {
    const { result } = renderHook(() => useMasterData("testTable"));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.relationData).toBe(null);
  });

  test("handles successful API call", async () => {
    const mockResponse = { status: "OK", data: "testData" };
    mockCallAPI.mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() => useMasterData("testTable"));

    act(() => {
      result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.relationData).toBe(mockResponse);
  });

  test("handles failed API call", async () => {
    const mockError = { status: "ERROR", errorCode: "404" };
    mockCallAPI.mockResolvedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useMasterData("testTable"));

    act(() => {
      result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockError.errorCode);
    expect(result.current.relationData).toBe(null);
  });

  test("handles API call exception", async () => {
    mockCallAPI.mockRejectedValue(new Error("Network Error"));

    const { result, waitForNextUpdate } = renderHook(() => useMasterData("testTable"));

    act(() => {
      result.current.makeMasterApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.relationData).toBe(null);
  });
});