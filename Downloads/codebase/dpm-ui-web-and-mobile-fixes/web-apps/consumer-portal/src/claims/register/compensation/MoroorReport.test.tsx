import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MoroorReport from "./MoroorReport";
import { DataContext } from "../../../DataContext";

// Mock icons and image imports (if needed)
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
  moroor_report: "Moroor Report",
  delete_document: "Delete Document",
  upload_docs: "Upload Documents",
};

describe("MoroorReport Component", () => {
  let changeHandlerMock: jest.Mock;

  beforeEach(() => {
    changeHandlerMock = jest.fn();
  });

  function renderComponent() {
    return render(
      <DataContext.Provider value={mockLanguageData}>
        <MoroorReport changeHandler={changeHandlerMock} />
      </DataContext.Provider>
    );
  }

  it("renders upload button initially", () => {
    renderComponent();
    expect(screen.getByText(/Upload Documents/i)).toBeInTheDocument();
    expect(screen.queryByText(/Delete Document/i)).not.toBeInTheDocument();
  });

  it("accepts a valid file upload and shows the file details", async () => {
    renderComponent();

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    // Since we cannot find by role, query input element manually:
    const fileInput = screen.getByTestId("moroor-file-input");
fireEvent.change(fileInput, { target: { files: [file] } });


    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });

    expect(changeHandlerMock).toHaveBeenCalled();
  });

  it("rejects invalid file types and shows alert", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    renderComponent();

    const invalidFile = new File(["dummy content"], "test.txt", {
      type: "text/plain",
    });

    const fileInput = screen.getByRole("button").querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  it("rejects file if size exceeds 3MB", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
    renderComponent();

    const largeFile = new File(["a".repeat(4 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });

    const fileInput = screen.getByRole("button").querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  it("deletes uploaded file on clicking delete button", async () => {
    renderComponent();

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const fileInput = screen.getByRole("button").querySelector('input[type="file"]')!;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTitle(/delete document/i);

    fireEvent.click(deleteButton);

    expect(screen.getByText(/Upload Documents/i)).toBeInTheDocument();
    expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
  });
});
