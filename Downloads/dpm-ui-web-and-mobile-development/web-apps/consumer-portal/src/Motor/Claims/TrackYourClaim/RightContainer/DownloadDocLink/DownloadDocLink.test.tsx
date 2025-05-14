import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DownloadDocLink from "./DownloadDocLink"; 
import { useApiCall } from "@dpm/shared-module"; 
import useZipFiles from "../../../../../Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles"; // Adjust path if needed
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mocking external modules
jest.mock("@dpm/shared-module", () => ({
  useApiCall: jest.fn(),
}));

jest.mock('../../../../../../../app-shell/src/utils', () => ({
    getFullUrl: jest.fn(),
    navigateTo: jest.fn(),
  }));

jest.mock("../../../../../Motor/Policy-services/AccessPolicyDocuments/hooks/useZipFiles", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("components/AlertBox", () => ({
  AlertBox: jest.fn(() => <div>Mocked AlertBox</div>),
}));
jest.mock('Motor/ClaimHooks/useClaimContext', () => ({
    useClaimContext: jest.fn(),
  }));

describe("DownloadDocLink Component", () => {
  let makeApiCallMock: jest.Mock;
  let createZipMock: jest.Mock;

  beforeEach(() => {
    makeApiCallMock = jest.fn();
    createZipMock = jest.fn();

    // Mocking the API call response
    useApiCall.mockReturnValue({
      makeApiCall: makeApiCallMock,
      isLoading: false,
      errors: null,
      data: [
        {
          fileName: "document1",
          model: "base64data1", // This should be some base64 string
        },
        {
          fileName: "document2",
          model: "base64data2", // This should be some base64 string
        },
      ],
    });
    (useClaimContext as jest.Mock).mockReturnValue({
        trackClaimInfo:{ loading: "Loading...", download_claim_documents: "Download Documents" }
    })

    // Mocking the useZipFiles hook
    useZipFiles.mockReturnValue({
      createZip: createZipMock,
    });
  });

  it("should trigger document download when clicked", async () => {
    render(<DownloadDocLink policyNumber="P-R35-24-331-014684" />);

    // Check if the download text is present
    const downloadText = screen.getByText("Download Documents");
    expect(downloadText).toBeInTheDocument();

    // Mock the createZip function to resolve a fake Blob
    const mockZipBlob = new Blob([], { type: "application/zip" });
    createZipMock.mockResolvedValue(mockZipBlob);

    // Mock the behavior of the download link
    const createObjectURLSpy = jest.spyOn(URL, "createObjectURL").mockReturnValue("mocked-url");
    const revokeObjectURLSpy = jest.spyOn(URL, "revokeObjectURL");

    // Simulate click on the download link
    fireEvent.click(downloadText);

    // Wait for the document download logic to complete
    await waitFor(() => expect(createZipMock).toHaveBeenCalledTimes(1));
    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);

    // Ensure that the Blob was correctly used in the download process
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);

    // Clean up mocks
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  it("should show an error message if API call fails", async () => {
    // Simulate an error from the API call
    useApiCall.mockReturnValueOnce({
      makeApiCall: makeApiCallMock,
      isLoading: false,
      errors: {
        messages: {
          details: {
            additionalInfo: "Error",
          },
          message_en: "An error occurred.",
        },
      },
      data: null,
    });

    render(<DownloadDocLink policyNumber="P-R35-24-331-014684" />);

    // Simulate API error
    waitFor(() => expect(makeApiCallMock).toHaveBeenCalledTimes(1));

  });

  it("should show loading state when API is loading", async () => {
    // Simulate loading state
    useApiCall.mockReturnValueOnce({
      makeApiCall: makeApiCallMock,
      isLoading: true,
      errors: null,
      data: null,
    });

    render(<DownloadDocLink policyNumber="P-R35-24-331-014684" />);

    // Check if loading text is displayed
    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
  });
});
