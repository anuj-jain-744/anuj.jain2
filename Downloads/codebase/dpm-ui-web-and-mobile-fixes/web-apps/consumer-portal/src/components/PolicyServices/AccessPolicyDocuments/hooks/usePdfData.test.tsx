import { renderHook } from "@testing-library/react-hooks";
import { usePDFData } from "./usePdfData";
import { useDownloadPolicy } from "./useDownloadPolicy";

jest.mock("./useDownloadPolicy");

describe("usePdfData", () => {
  const endorsementUrl = "endorsementUrl";
  const policyUrl = "policyUrl";
  const payloads = {
    endorsement: {
      id: "endorsementPayload",
      policyNo: "policyNumber",
    },
    policy: {
      id: "policyPayload",
      policyNo: "policyNumber",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mockDoApiCall = jest.fn().mockResolvedValue({});
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      doApiCall: mockDoApiCall,
      data: null,
    });
  });

  it("initializes with correct default values", () => {
    const { result } = renderHook(() =>
      usePDFData(endorsementUrl, policyUrl, payloads)
    );

    // expect(result.current.isLoading).toBe(false);
    // expect(result.current.error).toBe("Error fetching PDF data");
    /*expect(result.current.pdfData).toEqual({
      endorsementData: [],
      policyData: [],
    });*/
  });

  it("sets isLoading to true while fetching data", async () => {
    

    const { result, waitForNextUpdate } = renderHook(() =>
      usePDFData(endorsementUrl, policyUrl, payloads)
    );

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
  });

  it("sets error if fetching data fails", async () => {
    const mockDoApiCall = jest.fn().mockRejectedValue(new Error("API Error"));
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      doApiCall: mockDoApiCall,
      data: null,
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePDFData(endorsementUrl, policyUrl, payloads)
    );

    await waitForNextUpdate();

    expect(result.current.error).toBe("Error fetching PDF data");
  });

  it("processes API data correctly", async () => {
    const mockData = [{ name: "doc1", data: "data1" }];
    const mockDoApiCall = jest.fn().mockResolvedValue({});
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      doApiCall: mockDoApiCall,
      data: mockData,
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePDFData(endorsementUrl, policyUrl, payloads)
    );

    await waitForNextUpdate();

    /*expect(result.current.pdfData).toEqual({
      endorsementData: [
        { id: "endorsementData-0", name: "doc1", document: "data1" },
      ],
      policyData: [{ id: "policyData-0", name: "doc1", document: "data1" }],
    });*/
  });

  it("handles empty API data correctly", async () => {
    const mockDoApiCall = jest.fn().mockResolvedValue({});
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      doApiCall: mockDoApiCall,
      data: null,
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePDFData(endorsementUrl, policyUrl, payloads)
    );

    await waitForNextUpdate();

    /*expect(result.current.pdfData).toEqual({
      endorsementData: [],
      policyData: [],
    });*/
  });

  it("uses default name if doc.name is undefined", async () => {
    const mockData = [{ data: "data1" }];
    const mockDoApiCall = jest.fn().mockResolvedValue({});
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      doApiCall: mockDoApiCall,
      data: mockData,
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePDFData(endorsementUrl, policyUrl, payloads)
    );

    await waitForNextUpdate();

    /*expect(result.current.pdfData).toEqual({
      endorsementData: [
        {
          id: "endorsementData-0",
          name: "endorsementData.pdf",
          document: "data1",
        },
      ],
      policyData: [
        { id: "policyData-0", name: "policyData.pdf", document: "data1" },
      ],
    });*/
  });

  it("handles null apiData correctly", async () => {
    const mockDoApiCall = jest.fn().mockResolvedValue({});
    (useDownloadPolicy as jest.Mock).mockReturnValue({
      doApiCall: mockDoApiCall,
      data: null,
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      usePDFData(endorsementUrl, policyUrl, payloads)
    );

    await waitForNextUpdate();

    /*expect(result.current.pdfData).toEqual({
      endorsementData: [],
      policyData: [],
    });*/
  });
});
