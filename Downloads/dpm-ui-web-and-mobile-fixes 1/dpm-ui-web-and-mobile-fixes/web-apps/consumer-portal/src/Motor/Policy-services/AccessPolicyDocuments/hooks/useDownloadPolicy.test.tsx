import { renderHook, act } from "@testing-library/react-hooks";
import { useDownloadPolicy } from "./useDownloadPolicy";
import { callAPI } from "@dpm/shared-module";
import { convertBase64toPdf, isBase64 } from "utils/policyDocuments";

jest.mock("@dpm/shared-module");
jest.mock("utils/policyDocuments");

describe("useDownloadPolicy", () => {
  const url = "http://robin.com/api/policy";
  const endorsementUrl = "http://robin.com/api/Endorsement";
  const payload = { policyNo: "value" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes correctly", () => {
    const { result } = renderHook(() => useDownloadPolicy(url, payload));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it("handles API call and sets data correctly", async () => {
    const mockResponse = {
      data: [
        { model: "base64String1", fileName: "Document1" },
        { model: "base64String2" },
      ],
    };

    (callAPI as jest.Mock).mockResolvedValue(mockResponse);
    (isBase64 as jest.Mock).mockReturnValue(true);
    (convertBase64toPdf as jest.Mock).mockResolvedValue(
      new Uint8Array([1, 2, 3])
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useDownloadPolicy(url, payload)
    );

    act(() => {
      result.current.doApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual([
      { name: "Document1", data: new Uint8Array([1, 2, 3]) },
      { name: "Policy_Document_2.pdf", data: new Uint8Array([1, 2, 3]) },
    ]);
  });

  it("handles API call with Endorsement URL correctly", async () => {
    const mockResponse = {
      data: [
        { model: "base64String1", fileName: "Document1" },
        { model: "base64String2" },
      ],
    };

    (callAPI as jest.Mock).mockResolvedValue(mockResponse);
    (isBase64 as jest.Mock).mockReturnValue(true);
    (convertBase64toPdf as jest.Mock).mockResolvedValue(
      new Uint8Array([1, 2, 3])
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useDownloadPolicy(endorsementUrl, payload)
    );

    act(() => {
      result.current.doApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toEqual([
      { name: "Document1", data: new Uint8Array([1, 2, 3]) },
      { name: "Endorsement_Document_2.pdf", data: new Uint8Array([1, 2, 3]) },
    ]);
  });

  it("handles API call error correctly", async () => {
    const mockError = new Error("API call failed");

    (callAPI as jest.Mock).mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDownloadPolicy(url, payload)
    );

    act(() => {
      result.current.doApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it("handles invalid response data correctly", async () => {
    const mockResponse = {
      data: "invalid data",
    };

    (callAPI as jest.Mock).mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDownloadPolicy(url, payload)
    );

    act(() => {
      result.current.doApiCall();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });
});