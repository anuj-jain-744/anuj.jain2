import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import useFilesToBase64 from "./useFilesToBase64";

describe("useFilesToBase64 Hook", () => {
  it("should initialize with empty fileData", () => {
    const { result } = renderHook(() => useFilesToBase64());
    expect(result.current.fileData).toEqual([]);
  });

  it("should convert valid files to base64 and update fileData", async () => {
    const { result } = renderHook(() => useFilesToBase64());

    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    const mockFileList = {
      length: 1,
      item: (index: number) => (index === 0 ? mockFile : null),
      [0]: mockFile,
    } as unknown as FileList;

    act(() => {
      result.current.convertFilesToBase64(mockFileList);
    });

    await waitFor(() => {
      expect(result.current.fileData.length).toBe(1);
      expect(result.current.fileData[0].name).toBe("test.pdf");
      expect(result.current.fileData[0].size).toBe(mockFile.size);
      expect(result.current.fileData[0].base64).toContain("data:application/pdf;base64,");
    });
  });

  it("should not add invalid file types to fileData", async () => {
    const { result } = renderHook(() => useFilesToBase64());

    const mockInvalidFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });
    const mockFileList = {
      length: 1,
      item: (index: number) => (index === 0 ? mockInvalidFile : null),
      [0]: mockInvalidFile,
    } as unknown as FileList;

    act(() => {
      result.current.convertFilesToBase64(mockFileList);
    });

    await waitFor(() => {
      expect(result.current.fileData.length).toBe(0);
    });
  });

  it("should not add files exceeding size limit to fileData", async () => {
    const { result } = renderHook(() => useFilesToBase64());

    const largeFile = new File(["a".repeat(4 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });
    const mockFileList = {
      length: 1,
      item: (index: number) => (index === 0 ? largeFile : null),
      [0]: largeFile,
    } as unknown as FileList;

    act(() => {
      result.current.convertFilesToBase64(mockFileList);
    });

    await waitFor(() => {
      expect(result.current.fileData.length).toBe(0);
    });
  });

  it("should handle null files gracefully", () => {
    const { result } = renderHook(() => useFilesToBase64());

    act(() => {
      result.current.convertFilesToBase64(null);
    });

    expect(result.current.fileData).toEqual([]);
  });
});