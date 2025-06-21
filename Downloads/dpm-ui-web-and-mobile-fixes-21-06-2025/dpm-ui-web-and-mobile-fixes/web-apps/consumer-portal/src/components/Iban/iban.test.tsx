import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Iban from "./iban";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
  Bounce: jest.fn(),
}));

const mockLanguageData = {
  upload_bank_documents: "Upload Bank Documents",
  supported_file_type_doc: "Supported file types: PDF, DOC, DOCX, JPG, PNG",
  cheque_leaf: "Cheque Leaf",
  other_documents: "Other Documents",
  uploaded_all_required_docu: "All required documents uploaded",
  upload: "Upload",
  file_size_exceeds_5mb_plea: "File size exceeds 5MB. Please upload a smaller file.",
  not_a_valid_file: "Not a valid file format.",
};

describe("Iban Component", () => {
  let fileData = [null, null];
  const setFileData = jest.fn((updateFn) => {
    fileData = updateFn(fileData);
  });
  const onChequeLeafUpload = jest.fn();
  const onChequeLeafRemove = jest.fn();

  const renderComponent = () =>
    render(
      <Iban
        languageData={mockLanguageData}
        fileData={fileData}
        setFileData={setFileData}
        onChequeLeafUpload={onChequeLeafUpload}
        onChequeLeafRemove={onChequeLeafRemove}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
    fileData = [null, null];
  });

  it("renders accordion title and instructions", () => {
    renderComponent();
    expect(screen.getByText("Upload Bank Documents")).toBeInTheDocument();
    expect(screen.getByText("Cheque Leaf")).toBeInTheDocument();
    expect(screen.getByText("Other Documents")).toBeInTheDocument();
  });

  it("uploads valid file and shows uploaded state", async () => {
    renderComponent();

    const file = new File(["hello"], "test.pdf", { type: "application/pdf" });

    const fileInputs = screen.getAllByLabelText(/Upload Cheque Leaf|Upload Other Documents/i);
    const chequeInput = fileInputs[0];

    fireEvent.change(chequeInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChequeLeafUpload).toHaveBeenCalledWith(file);
      expect(setFileData).toHaveBeenCalled();
    });
  });

  it("shows toast error for oversized file", async () => {
    renderComponent();

    const bigFile = new File(["a".repeat(6 * 1024 * 1024)], "big.pdf", {
      type: "application/pdf",
    });

    const fileInputs = screen.getAllByLabelText(/Upload Cheque Leaf|Upload Other Documents/i);
    fireEvent.change(fileInputs[0], { target: { files: [bigFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        mockLanguageData.file_size_exceeds_5mb_plea,
        expect.any(Object)
      );
    });
  });

  it("shows toast error for invalid file type", async () => {
    renderComponent();

    const invalidFile = new File(["hello"], "test.exe", { type: "application/x-msdownload" });

    const fileInputs = screen.getAllByLabelText(/Upload Cheque Leaf|Upload Other Documents/i);
    fireEvent.change(fileInputs[0], { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        mockLanguageData.not_a_valid_file,
        expect.any(Object)
      );
    });
  });

  it("removes uploaded file and calls onChequeLeafRemove", async () => {
    renderComponent();

    const file = new File(["hello"], "test.pdf", { type: "application/pdf" });
    const fileInputs = screen.getAllByLabelText(/Upload Cheque Leaf|Upload Other Documents/i);

    fireEvent.change(fileInputs[0], { target: { files: [file] } });

    await waitFor(() => expect(onChequeLeafUpload).toHaveBeenCalled());

    // Simulate uploaded file and remove click
    const cancelIcon = await screen.findByAltText("Cancel Icon");
    fireEvent.click(cancelIcon);

    await waitFor(() => {
      expect(onChequeLeafRemove).toHaveBeenCalled();
    });
  });

  it("shows tick section when required file is uploaded", async () => {
    renderComponent();

    const file = new File(["hello"], "test.pdf", { type: "application/pdf" });
    const fileInputs = screen.getAllByLabelText(/Upload Cheque Leaf|Upload Other Documents/i);
    fireEvent.change(fileInputs[0], { target: { files: [file] } });

    const tickText = await screen.findByText("All required documents uploaded");
    expect(tickText).toBeInTheDocument();
  });

  it("toggles accordion open and closed", () => {
    renderComponent();

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(toggleButton.querySelector("img")?.getAttribute("src")).toContain("test-file-stub");

    fireEvent.click(toggleButton);
    expect(toggleButton.querySelector("img")?.getAttribute("src")).toContain("test-file-stub");
  });
});
