import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UploadDocs from "./UploadDocs";
import { useClaimContext } from "Motor/ClaimHooks/useClaimContext";
import { useUploadFile } from "../../../../../../claims/register/TrackClaim/hooks/useUploadClaimFile";
import { toast } from "react-toastify";

jest.mock("Motor/ClaimHooks/useClaimContext", () => ({
  useClaimContext: jest.fn(),
}));

jest.mock("../../../../../../claims/register/TrackClaim/hooks/useUploadClaimFile", () => ({
  useUploadFile: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("UploadDocs Component", () => {
  const mockOnClose = jest.fn();
  const mockSetIsSuccess = jest.fn();
  const mockMakeApiCall = jest.fn();

  beforeEach(() => {
    (useClaimContext as jest.Mock).mockReturnValue({
      trackNewData: {
        claimTrackingDetails: [
          {
            taskStatus: "Pending",
            taskId: 1,
            uploadDocumnets: [
              { documentId: "doc1", documentName: "Document 1" },
              { documentId: "doc2", documentName: "Document 2" },
            ],
          },
        ],
      },
      trackClaimInfo: {
        upload_the_supporting_docs: "Upload Your Supporting Documents",
        supported_file_type_doc: "<p>Supported formats: PDF, PNG, JPEG</p>",
        submit_documents: "Submit Documents",
        file_removed: "File removed",
        no_files_selected: "No files selected",
        file_with_the_same_name_already_exists: "File with the same name already exists",
        invalid_file_type: "Invalid file type",
        file_uploaded_successfully: "File uploaded successfully",
        error_in_uploading_documents: "Error in uploading documents",
        documents_are_submitted_successfully: "Documents are submitted successfully",
        all_documents_submitted_successfully: "All documents submitted successfully",
      },
    });

    (useUploadFile as jest.Mock).mockReturnValue({
      makeApiCall: mockMakeApiCall,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with context values", () => {
    render(<UploadDocs onClose={mockOnClose} setIsSuccess={mockSetIsSuccess} />);

    expect(screen.getByText(/upload your supporting documents/i)).toBeInTheDocument();
    expect(screen.getByText(/supported formats:/i)).toBeInTheDocument();
    expect(screen.getByText(/submit documents/i)).toBeInTheDocument();
  });

  test("handles file upload successfully", async () => {
    render(<UploadDocs onClose={mockOnClose} setIsSuccess={mockSetIsSuccess} />);

    console.log("fileItems in Test");


    const fileInputs = screen.getAllByTestId("file-input");
    const file = new File(["dummy content"], "example.pdf", { type: "application/pdf" });

    fireEvent.change(fileInputs[0], { target: { files: [file] } });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalled()
    );
  });


  const mockUpdateItemsError = jest.fn();
  const mockResetFileInput = jest.fn();

  const initialFileItems = [
    { id: "1", file: { name: "Document1.pdf" } },
    { id: "2", file: { name: "Document2.pdf" } },
  ];

  const mockTrackClaimInfo = {
    file_with_the_same_name_already_exists: "File with the same name already exists",
  };

  const setup = () => {
    render(
      <UploadDocs
        fileItems={initialFileItems}
        updateItemsError={mockUpdateItemsError}
        resetFileInput={mockResetFileInput}
        trackClaimInfo={mockTrackClaimInfo}
      />
    );
  };

  test("calls resetFileInput when a duplicate file is uploaded", () => {
  setup();

  const fileInput = screen.getByTestId("file-input"); // Assuming the file input has this test ID

  // Simulate an existing file in the system
  const existingFile = { id: "1", file: { name: "Document1.pdf" } };
  const duplicateFile = new File(["content"], "Document1.pdf", {
    type: "application/pdf",
  });

  // Mock the fileItems to include the existing file
  const mockFileItems = [
    existingFile,
    { id: "2", file: { name: "Document2.pdf" } },
  ];

  // Simulate the duplicate file upload
  fireEvent.change(fileInput, { target: { files: [duplicateFile] } });

  // Assert that the duplicate file logic is triggered
  expect(mockResetFileInput).toHaveBeenCalledWith(fileInput);

  // Ensure updateItemsError is called with the correct arguments
  expect(mockUpdateItemsError).toHaveBeenCalledWith(
    existingFile.id,
    "Document1.pdf - File with the same name already exists"
  );

  // Ensure toast.error is called
  expect(toast.error).toHaveBeenCalledWith(
    "Document1.pdf - File with the same name already exists",
    { autoClose: 2000 }
  );
});




  test("shows error for invalid file type", async () => {
    render(<UploadDocs onClose={mockOnClose} setIsSuccess={mockSetIsSuccess} />);

    const fileInput = screen.getAllByTestId("file-input");
    const invalidFile = new File(["dummy content"], "example.txt", { type: "text/plain" });

    fireEvent.change(fileInput[0], { target: { files: [invalidFile] } });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalled()
    );
  });

  test("shows error for file size exceeding limit", async () => {
    render(<UploadDocs onClose={mockOnClose} setIsSuccess={mockSetIsSuccess} />);

    const fileInput = screen.getByTestId("file-input");
    const largeFile = new File(["dummy content".repeat(1024 * 1024 * 5)], "large-file.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalled()
    );
  });

  test("removes file correctly", async () => {
    render(<UploadDocs onClose={mockOnClose} setIsSuccess={mockSetIsSuccess} />);

    const removeButton = screen.getByTestId("removefile_testid");
    fireEvent.click(removeButton);

    await waitFor(() =>
      expect(toast.info).toHaveBeenCalled()
    );
  });

  test("submits all files successfully", async () => {
    mockMakeApiCall.mockResolvedValue({ message: "SUCCESS" });

    render(<UploadDocs onClose={mockOnClose} setIsSuccess={mockSetIsSuccess} />);

    // Simulate valid file upload
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["dummy content"], "example.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalled()
    );

    // Simulate clicking the submit button
    const submitButton = screen.getByRole("button", { name: /submit documents/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalled()
    );

    expect(mockSetIsSuccess).toHaveBeenCalledWith(false);
  });

  test("shows error when submitting files fails", async () => {
    mockMakeApiCall.mockResolvedValue({ message: "ERROR" });

    render(<UploadDocs onClose={mockOnClose} setIsSuccess={mockSetIsSuccess} />);

    const submitButton = screen.getByRole("button", { name: /submit documents/i });
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalled()
    );
  });
});
