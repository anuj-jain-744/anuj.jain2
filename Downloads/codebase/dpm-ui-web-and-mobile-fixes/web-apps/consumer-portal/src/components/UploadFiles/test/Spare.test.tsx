import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Spare from "../Spare";
import { DataContext } from "../../../DataContext";

// Mock base64 hook
jest.mock("../hooks/useFilesToBase64", () => () => ({
  fileData: "mockBase64Data",
  setFileData: jest.fn(),
  convertFilesToBase64: jest.fn(),
}));

const mockChangeHandler = jest.fn();
const mockLanguageData = {
  upload_docs: "Upload Documents",
  spare_parts: "Spare Parts",
  delete_document: "Delete Document",
};

const renderComponent = () =>
  render(
    <DataContext.Provider value={mockLanguageData}>
      <Spare changeHandler={mockChangeHandler} />
    </DataContext.Provider>
  );

describe("Spare component", () => {
  beforeEach(() => {
    mockChangeHandler.mockClear();
  });

  it("renders upload button initially", () => {
    renderComponent();
    expect(screen.getByText("Upload Documents")).toBeInTheDocument();
  });

  it("uploads a valid file", async () => {
    renderComponent();

    const file = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });

    Object.defineProperty(file, "size", { value: 1024 }); // 1KB

    const input = screen.getByRole("button").querySelector("input");
    fireEvent.change(input!, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return content.includes("test.jpg");
      })).toBeInTheDocument();
    });
  });

  it("rejects an invalid file type", () => {
    window.alert = jest.fn();
    renderComponent();

    const file = new File(["dummy content"], "test.exe", {
      type: "application/x-msdownload",
    });

    Object.defineProperty(file, "size", { value: 1024 }); // 1KB

    const input = screen.getByRole("button").querySelector("input");
    fireEvent.change(input!, {
      target: { files: [file] },
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  it("rejects a file larger than 3MB", () => {
    window.alert = jest.fn();
    renderComponent();

    const file = new File(["a".repeat(4 * 1024 * 1024)], "large.jpg", {
      type: "image/jpeg",
    });

    Object.defineProperty(file, "size", { value: 4 * 1024 * 1024 }); // 4MB

    const input = screen.getByRole("button").querySelector("input");
    fireEvent.change(input!, {
      target: { files: [file] },
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  it("displays delete icon and allows file deletion", async () => {
    renderComponent();

    const file = new File(["dummy content"], "test.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(file, "size", { value: 1024 });

    const input = screen.getByRole("button").querySelector("input");
    fireEvent.change(input!, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByText("test.jpg")).toBeInTheDocument();
    });

    const deleteIcon = screen.getByTitle("Delete Document");
    fireEvent.click(deleteIcon);

    waitFor(() => {
      expect(screen.getByText("Upload Documents")).toBeInTheDocument();
    });
  });

  it("calls changeHandler when fileData changes", async () => {
    renderComponent();
    await waitFor(() => {
      expect(mockChangeHandler).toHaveBeenCalledWith("mockBase64Data");
    });
  });
});
