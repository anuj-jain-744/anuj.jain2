import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ModalClaimUpload from "./ModalClaimUpload";
import UploadFiles from "components/UploadFiles/UploadFiles";
import userEvent from "@testing-library/user-event";

// Mock the UploadFiles component
jest.mock("components/UploadFiles/UploadFiles", () => {
  return jest.fn(() => <div data-testid="upload-files-mock" />);
});

describe("ModalClaimUpload", () => {
  it("renders UploadFiles component", () => {
    const mockChangeHandlerFiles = jest.fn();
    const mockCheckHandler = jest.fn();

    render(
      <ModalClaimUpload
        changeHandlerFiles={mockChangeHandlerFiles}
        checkHandler={mockCheckHandler}
      />
    );

    expect(screen.getByTestId("upload-files-mock")).toBeInTheDocument();
  });

  it("calls changeHandlerFiles when fileData changes", () => {
    const mockChangeHandlerFiles = jest.fn();
    const mockCheckHandler = jest.fn();

    let capturedChangeHandler: (files: any) => void = () => {};

    (UploadFiles as jest.Mock).mockImplementation(({ changeHandler }) => {
      capturedChangeHandler = changeHandler;
      return <div data-testid="upload-files-mock" />;
    });

    render(
      <ModalClaimUpload
        changeHandlerFiles={mockChangeHandlerFiles}
        checkHandler={mockCheckHandler}
      />
    );

    const fakeFiles = [
      { name: "doc.pdf", size: 1234, base64: "data:base64string" },
    ];
    capturedChangeHandler(fakeFiles);

   waitFor(() => {  
    expect(mockChangeHandlerFiles).toHaveBeenCalledWith(fakeFiles);
});
  });

  it("passes checkHandler correctly to UploadFiles", () => {
    const mockChangeHandlerFiles = jest.fn();
    const mockCheckHandler = jest.fn();

    render(
      <ModalClaimUpload
        changeHandlerFiles={mockChangeHandlerFiles}
        checkHandler={mockCheckHandler}
      />
    );

    expect(UploadFiles).toHaveBeenCalledWith(
      expect.objectContaining({
        changeHandler: expect.any(Function),
        checkHandler: mockCheckHandler,
      }),
      {}
    );
  });
});