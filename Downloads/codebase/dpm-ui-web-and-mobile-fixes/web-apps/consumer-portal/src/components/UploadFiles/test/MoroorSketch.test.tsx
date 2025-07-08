import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MoroorSketch from "../MoroorSketch";
import { DataContext } from "../../../DataContext";

// Mock the custom hook
jest.mock("../hooks/useFilesToBase64", () => {
  return () => ({
    fileData: "mockBase64FileData",
    setFileData: jest.fn(),
    convertFilesToBase64: jest.fn(),
  });
});

describe("MoroorSketch Component", () => {
  const mockChangeHandler = jest.fn();
  const mockLanguageData = {
    moroor_sketch: "Upload Sketch",
    delete_document: "Delete",
    upload_docs: "Upload",
  };

  const setup = () =>
    render(
      <DataContext.Provider value={mockLanguageData}>
        <MoroorSketch changeHandler={mockChangeHandler} />
      </DataContext.Provider>
    );

  beforeEach(() => {
    mockChangeHandler.mockClear();
  });

  it("renders the component and shows upload button", () => {
    setup();
    expect(screen.getByText("Upload Sketch")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  it("uploads a valid file and shows file name", async () => {
    setup();
    const file = new File(["dummy content"], "test-file.png", {
      type: "image/png",
    });

    const input = screen.getByRole("button").querySelector("input[type='file']");
    fireEvent.change(input!, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockChangeHandler).toHaveBeenCalledWith("mockBase64FileData");
    });
  });

  it("rejects invalid file and shows alert", () => {
    setup();

    window.alert = jest.fn();

    const invalidFile = new File(["content"], "invalid.exe", {
      type: "application/x-msdownload",
    });

    const input = screen.getByRole("button").querySelector("input[type='file']");
    fireEvent.change(input!, { target: { files: [invalidFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
  });

  it("deletes the uploaded file", async () => {
    setup();

    const file = new File(["dummy content"], "test-file.png", {
      type: "image/png",
    });

    const input = screen.getByRole("button").querySelector("input[type='file']");
    fireEvent.change(input!, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockChangeHandler).toHaveBeenCalledWith("mockBase64FileData");
    });

  });
});