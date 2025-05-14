import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadDoc from "./UploadDoc";
import { LanguageData } from "types/languageData";

// Mocks
jest.mock("../../hooks/useUploadFile", () => ({
  useUploadFile: () => ({
    makeApiCall: jest.fn(() => Promise.resolve({ status: "OK" })),
    isLoading: false,
  }),
}));

jest.mock("../../hooks/useFilesToBase64", () => {
  return () => ({
    fileData: mockFileData,
    setFileData: mockSetFileData,
    convertFilesToBase64: mockConvertFilesToBase64,
  });
});

jest.mock("./UploadButton", () => (props: any) => {
  return (
    <button onClick={() => props.handleFileChange({ target: { files: mockFiles } })}>
      Mock Upload Button
    </button>
  );
});

jest.mock("./FileList", () => (props: any) => {
  return (
    <div data-testid="file-list">
      {props.files.map((file: any, index: number) => (
        <div key={index}>
          <span>{file.name}</span>
          <button onClick={() => props.onRemove(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
});

// Mock Data
const mockSetFileData = jest.fn();
const mockConvertFilesToBase64 = jest.fn();
const mockFileData = [{ name: "testfile.pdf", base64: "data:pdf;base64,test" }];
const mockFiles = [new File(["dummy content"], "testfile.pdf", { type: "application/pdf" })];

const languageData: LanguageData = {
  upload_the_supporting_docs: "Upload Supporting Documents",
  supported_formats: "Supported formats: PDF, JPG",
  upload_accident_report: "Upload Accident Report",
  uploading: "Uploading...",
  submit: "Submit",
};

describe("UploadDoc component", () => {
  const handleSuccessMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with languageData", () => {
    render(<UploadDoc handleSuccess={handleSuccessMock} languageData={languageData} />);
    expect(screen.getByText(languageData.upload_the_supporting_docs)).toBeInTheDocument();
    expect(screen.getByText(languageData.supported_formats)).toBeInTheDocument();
    expect(screen.getByText(languageData.upload_accident_report)).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("calls convertFilesToBase64 when files are uploaded", () => {
    render(<UploadDoc handleSuccess={handleSuccessMock} languageData={languageData} />);
    fireEvent.click(screen.getByText("Mock Upload Button"));
    expect(mockConvertFilesToBase64).toHaveBeenCalledWith(mockFiles);
  });

  it("renders uploaded files and allows removing", async () => {
    render(<UploadDoc handleSuccess={handleSuccessMock} languageData={languageData} />);
    expect(screen.getByTestId("file-list")).toBeInTheDocument();
    expect(screen.getByText("testfile.pdf")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove"));
    expect(mockSetFileData).toHaveBeenCalledWith(expect.any(Function));
  });

  it("submits files and calls handleSuccess when API returns OK", async () => {
    render(<UploadDoc handleSuccess={handleSuccessMock} languageData={languageData} />);
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(handleSuccessMock).toHaveBeenCalledWith(true);
    });
  });

  it("disables submit button if no fileData or loading", () => {
    // override fileData to empty
    jest.mocked(mockFileData).length = 0;

    const { rerender } = render(<UploadDoc handleSuccess={handleSuccessMock} languageData={languageData} />);
    const button = screen.getByText("Submit").closest("button");
    expect(button).toBeDisabled();

    rerender(
      <UploadDoc
        handleSuccess={handleSuccessMock}
        languageData={languageData}
      />
    );
  });

  it("renders loading state when languageData is not passed", () => {
    const { container } = render(<UploadDoc handleSuccess={handleSuccessMock} languageData={undefined as any} />);
    expect(container).toHaveTextContent("Loading");
  });
});
