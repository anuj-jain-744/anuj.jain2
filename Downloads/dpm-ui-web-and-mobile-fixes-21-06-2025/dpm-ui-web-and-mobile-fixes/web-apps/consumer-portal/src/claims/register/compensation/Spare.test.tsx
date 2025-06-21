import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Spare from "./Spare";
import { DataContext } from "../../../DataContext";

// Mock icons and image imports
jest.mock("@mui/icons-material/PictureAsPdfSharp", () => () => <div>PDFIcon</div>);
jest.mock("@mui/icons-material/DeleteOutlined", () => () => <div>DeleteIcon</div>);
jest.mock("../../assets/svg/icons/UploadBlue.svg", () => "upload-blue.svg");

// Mock useFilesToBase64 hook
jest.mock("./hooks/useFilesToBase64", () => ({
  __esModule: true,
  default: () => ({
    fileData: null,
    setFileData: jest.fn(),
    convertFilesToBase64: jest.fn(),
  }),
}));

const mockLanguageData = {
  spare_parts: "Spare Parts",
  delete_document: "Delete Document",
  upload_docs: "Upload Documents",
};

describe("Spare component", () => {
  let changeHandlerMock: jest.Mock;

  beforeEach(() => {
    changeHandlerMock = jest.fn();
  });

  function renderComponent() {
    return render(
      <DataContext.Provider value={mockLanguageData}>
        <Spare changeHandler={changeHandlerMock} />
      </DataContext.Provider>
    );
  }

  it("renders upload button initially", () => {
    renderComponent();
    expect(screen.getByTitle(/upload documents/i)).toBeInTheDocument();
    expect(screen.getByText(/spare parts/i)).toBeInTheDocument();
  });

  it("accepts a valid file upload and shows file details", async () => {
    renderComponent();

    const file = new File(["file content"], "file.pdf", {
      type: "application/pdf",
    });

    const input = screen.getByTestId("file-input-spare");

    fireEvent.change(input, { target: { files: [file] } });

    // Wait for state update and file name to appear
    await waitFor(() => {
      expect(screen.getByText("file.pdf")).toBeInTheDocument();
    });

    // Delete button should now be visible (title from delete_document)
    expect(screen.getByTitle(/delete document/i)).toBeInTheDocument();

    // changeHandler should have been called at least once (due to useEffect on fileData)
    expect(changeHandlerMock).toHaveBeenCalled();
  });

  it("rejects invalid file type and shows alert", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    renderComponent();

    const invalidFile = new File(["content"], "file.txt", {
      type: "text/plain",
    });

    const input = screen.getByTestId("file-input-spare");

    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  it("rejects file larger than 3MB and shows alert", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    renderComponent();

    const largeFile = new File([new ArrayBuffer(4 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });

    const input = screen.getByTestId("file-input-spare");

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  it("deletes the uploaded file on clicking delete button", async () => {
    renderComponent();

    const file = new File(["content"], "file.pdf", {
      type: "application/pdf",
    });

    const input = screen.getByTestId("file-input-spare");
    fireEvent.change(input, { target: { files: [file] } });

    // Wait for upload to complete and file name to be visible
    await waitFor(() => {
      expect(screen.getByText("file.pdf")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle(/delete document/i);
    fireEvent.click(deleteButton);

    // Upload button should be visible again after delete
    expect(screen.getByTitle(/upload documents/i)).toBeInTheDocument();
    expect(screen.queryByText("file.pdf")).not.toBeInTheDocument();
  });
});
