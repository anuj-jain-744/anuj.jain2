import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MoroorReport from "../MoroorReport";
import { DataContext } from "../../../DataContext";

// Mock useFilesToBase64
jest.mock("../hooks/useFilesToBase64", () => ({
  __esModule: true,
  default: () => ({
    fileData: "mockFileData",
    setFileData: jest.fn(),
    convertFilesToBase64: jest.fn(),
  }),
}));

// Mock icons to avoid rendering issues
jest.mock("@mui/icons-material/PictureAsPdfSharp", () => () => <div data-testid="pdf-icon" />);
jest.mock("@mui/icons-material/HighlightOff", () => (props: any) => (
  <div data-testid="delete-icon" onClick={props.onClick} />
));
jest.mock("@mui/icons-material/Image", () => () => <div data-testid="image-icon" />);
jest.mock("components/ThemeComponents/TypographyAndIcon", () => ({ text }: any) => <div>{text}</div>);

describe("MoroorReport Component", () => {
  const mockLanguageData = {
    moroor_report: "Moroor Report",
    upload_docs: "Upload Documents",
    delete_document: "Delete Document",
  };

  const mockChangeHandler = jest.fn();
  const mockCheckHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with upload button", () => {
    render(
      <DataContext.Provider value={mockLanguageData}>
        <MoroorReport changeHandler={mockChangeHandler} checkHandler={mockCheckHandler} />
      </DataContext.Provider>
    );

    expect(screen.getByText("Moroor Report")).toBeInTheDocument();
    expect(screen.getByText("Upload Documents")).toBeInTheDocument();
  });

  it("handles file upload (valid file)", async () => {
    render(
      <DataContext.Provider value={mockLanguageData}>
        <MoroorReport changeHandler={mockChangeHandler} checkHandler={mockCheckHandler} />
      </DataContext.Provider>
    );

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const input = screen.getByRole("button").querySelector("input[type='file']")!;
    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(mockCheckHandler).toHaveBeenCalledWith("Moroor Report", true);
      expect(mockChangeHandler).toHaveBeenCalledWith("mockFileData");
    });
  });

  it("handles invalid file upload", async () => {
    window.alert = jest.fn(); // Mock alert
    render(
      <DataContext.Provider value={mockLanguageData}>
        <MoroorReport changeHandler={mockChangeHandler} checkHandler={mockCheckHandler} />
      </DataContext.Provider>
    );

    const file = new File(["large content"], "large.exe", {
      type: "application/x-msdownload",
    });

    const input = screen.getByRole("button").querySelector("input[type='file']")!;
    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid file type or exceeds size limit (3MB)");
    });
  });

  it("deletes file when delete icon is clicked", async () => {
    // Manually set file via DOM simulation (since FileReader is async)
    const { container } = render(
      <DataContext.Provider value={mockLanguageData}>
        <MoroorReport changeHandler={mockChangeHandler} checkHandler={mockCheckHandler} />
      </DataContext.Provider>
    );

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    const input = container.querySelector("input[type='file']")!;
    fireEvent.change(input, {
      target: { files: [file] },
    });

    // Simulate showing file in UI (mocking internal state is complex)
    await waitFor(() => {
      expect(mockChangeHandler).toHaveBeenCalledWith("mockFileData");
    });

    const deleteIcon = await screen.findByTestId("delete-icon");
    fireEvent.click(deleteIcon);

    await waitFor(() => {
      expect(mockChangeHandler).toHaveBeenCalledWith(null);
    });
  });

  it("renders appropriate icon based on file type", async () => {
    const { container } = render(
      <DataContext.Provider value={mockLanguageData}>
        <MoroorReport changeHandler={mockChangeHandler} checkHandler={mockCheckHandler} />
      </DataContext.Provider>
    );

    const file = new File(["dummy content"], "image.png", {
      type: "image/png",
    });

    const input = container.querySelector("input[type='file']")!;
    fireEvent.change(input, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByTestId("image-icon")).toBeInTheDocument();
    });
  });
});
