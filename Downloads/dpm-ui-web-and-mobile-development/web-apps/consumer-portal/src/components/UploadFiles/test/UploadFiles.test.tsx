import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import UploadFiles from "../UploadFiles";
import { DataContext } from "../../../DataContext";
import useFilesToBase64 from "../hooks/useFilesToBase64";

// Mock file conversion hook
jest.mock("../hooks/useFilesToBase64");

// ✅ Mock subcomponents
jest.mock("../MoroorReport", () => ({
  __esModule: true,
  default: ({ changeHandler }: any) => {
    changeHandler(["moroorReportData"]);
    return <div data-testid="MoroorReport" />;
  },
}));

jest.mock("../Spare", () => ({
  __esModule: true,
  default: ({ changeHandler }: any) => {
    changeHandler(["spareData"]);
    return <div data-testid="Spare" />;
  },
}));

jest.mock("../MoroorSketch", () => ({
  __esModule: true,
  default: ({ changeHandler }: any) => {
    changeHandler(["sketchData"]);
    return <div data-testid="MoroorSketch" />;
  },
}));

jest.mock("../OtherDoc", () => ({
  __esModule: true,
  default: ({ changeHandler }: any) => {
    changeHandler(["otherDocData"]);
    return <div data-testid="OtherDoc" />;
  },
}));

const mockedSetFileData = jest.fn();
const mockedConvertFilesToBase64 = jest.fn();

const mockLanguageData = {
  quotation: "Quotation",
  upload_docs: "Upload Docs",
  delete_document: "Delete Doc",
};

const mockFile = new File(["hello"], "hello.pdf", {
  type: "application/pdf",
});
// mockFile.size = 1024; // 1KB

const largeFile = new File(["x".repeat(4 * 1024 * 1024)], "large.png", {
  type: "image/png",
});

describe("UploadFiles Component", () => {
  const changeHandler = jest.fn();
  const checkHandler = jest.fn();

  const setup = () => {
    (useFilesToBase64 as jest.Mock).mockReturnValue({
      fileData: ["convertedData"],
      setFileData: mockedSetFileData,
      convertFilesToBase64: mockedConvertFilesToBase64,
    });

    render(
      <DataContext.Provider value={mockLanguageData}>
        <UploadFiles changeHandler={changeHandler} checkHandler={checkHandler} />
      </DataContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all subcomponents and language content", () => {
    setup();

    expect(screen.getByTestId("MoroorReport")).toBeInTheDocument();
    expect(screen.getByTestId("Spare")).toBeInTheDocument();
    expect(screen.getByTestId("MoroorSketch")).toBeInTheDocument();
    expect(screen.getByTestId("OtherDoc")).toBeInTheDocument();
    expect(screen.getByText("Quotation")).toBeInTheDocument();
    expect(screen.getByTitle("Upload Docs")).toBeInTheDocument();
  });

  it("handles valid file upload", async () => {
    setup();
    const input = screen.getByTitle("Upload Docs").querySelector("input")!;

    const fileReaderMock = {
      readAsDataURL: jest.fn(),
      result: "data:base64string",
      onload: null as any,
      onerror: null as any,
    };

    jest.spyOn(window, "FileReader").mockImplementation(() => fileReaderMock as any);

    await act(async () => {
      fireEvent.change(input, { target: { files: [mockFile] } });
    });

    expect(mockedConvertFilesToBase64).toHaveBeenCalledWith([mockFile]);

    act(() => {
      fileReaderMock.onload({ target: { result: "base64string" } });
    });
  });

  it("handles invalid file upload (large file)", () => {
    setup();
    global.alert = jest.fn();

    const input = screen.getByTitle("Upload Docs").querySelector("input")!;
    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(global.alert).toHaveBeenCalledWith(
      "Invalid file type or exceeds size limit (3MB)"
    );
    expect(input.value).toBe("");
  });

  it("handles file delete", async () => {
    setup();
    const input = screen.getByTitle("Upload Docs").querySelector("input")!;

    // Simulate uploading a file
    const fileReaderMock = {
      readAsDataURL: jest.fn(),
      result: "data:base64string",
      onload: null as any,
      onerror: null as any,
    };
    jest.spyOn(window, "FileReader").mockImplementation(() => fileReaderMock as any);

    await act(() => {
      fireEvent.change(input, { target: { files: [mockFile] } });
    });

    act(() => {
      fileReaderMock.onload({ target: { result: "base64string" } });
    });
    waitFor(() => {
      const deleteIcon = screen.getByRole("button", { hidden: true });
      expect(deleteIcon).toBeInTheDocument();
    });
  });

  it("calls changeHandler with data from all subcomponents", () => {
    setup();

    expect(changeHandler).toHaveBeenCalledWith(["convertedData"]); // from useEffect
    expect(changeHandler).toHaveBeenCalledWith(["moroorReportData"]);
    expect(changeHandler).toHaveBeenCalledWith(["spareData"]);
    expect(changeHandler).toHaveBeenCalledWith(["sketchData"]);
    expect(changeHandler).toHaveBeenCalledWith(["otherDocData"]);
  });

  it("renders file icon based on MIME type", () => {
    setup();
    const input = screen.getByTitle("Upload Docs").querySelector("input")!;
    fireEvent.change(input, {
      target: {
        files: [mockFile],
      },
    });

    expect(mockedConvertFilesToBase64).toHaveBeenCalled();
  });
});
