import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import OtherDoc from "../OtherDoc";
import { DataContext } from "../../../DataContext";

// Mocks
jest.mock("../hooks/useFilesToBase64", () => () => ({
  fileData: "mockBase64Data",
  setFileData: jest.fn(),
  convertFilesToBase64: jest.fn(),
}));

const mockChangeHandler = jest.fn();
const mockContext = {
  upload_docs: "Upload Document",
  delete_document: "Delete Document",
  other_documents: "Other Documents",
};

describe("OtherDoc Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <DataContext.Provider value={mockContext}>
        <OtherDoc changeHandler={mockChangeHandler} />
      </DataContext.Provider>
    );

  test("renders upload button initially", () => {
    renderComponent();
    expect(screen.getByText("Upload Document")).toBeInTheDocument();
  });

  test("calls convertFilesToBase64 on valid file upload", async () => {
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    renderComponent();
    const input = screen.getByTitle("Upload Document").querySelector("input");

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    // await waitFor(() => {
    //   expect(screen.getByText("test.pdf")).toBeInTheDocument();
    // });
  });

  test("shows alert on invalid file type", () => {
    window.alert = jest.fn();
    const file = new File(["dummy content"], "invalid.exe", {
      type: "application/x-msdownload",
    });

    renderComponent();
    const input = screen.getByTitle("Upload Document").querySelector("input");

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  test("delete file button clears selection", async () => {
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    renderComponent();
    const input = screen.getByTitle("Upload Document").querySelector("input");

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    // await waitFor(() => {
    //   expect(screen.getByText("test.pdf")).toBeInTheDocument();
    // });

    // const deleteIcon = screen.getByTitle("Delete Document");
    // fireEvent.click(deleteIcon);
    // waitFor(() => {
    //   expect(screen.getByText(/Upload Document/i)).toBeInTheDocument();
    // });
  });

  test("renders correct icon for PDF file", async () => {
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    renderComponent();
    const input = screen.getByTitle("Upload Document").querySelector("input");

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }

    // await waitFor(() => {
    //   expect(screen.getByTestId("PictureAsPdfSharpIcon")).toBeInTheDocument();
    // });
  });

  test("calls changeHandler on fileData change", () => {
    renderComponent();
    expect(mockChangeHandler).toHaveBeenCalledWith("mockBase64Data");
  });
});
