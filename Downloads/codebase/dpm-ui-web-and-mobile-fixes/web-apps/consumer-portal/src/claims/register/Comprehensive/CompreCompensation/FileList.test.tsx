import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FileList from "./FileList";

const mockLanguage = {
  file_upload_is_completed: "File upload is completed.",
};

const files = [
  {
    name: "file1.pdf",
    size: 2048,
    base64: "base64string1",
  },
  {
    name: "file2.pdf",
    size: 1024,
    base64: "base64string2",
  },
];

describe("FileList component", () => {
  it("renders file upload completed message", () => {
    render(<FileList files={files} onRemove={() => {}} language={mockLanguage} />);
    expect(screen.getByText(/file upload is completed/i)).toBeInTheDocument();
  });

  it("renders all files with name and size", () => {
    render(<FileList files={files} onRemove={() => {}} language={mockLanguage} />);
    files.forEach(({ name, size }) => {
      expect(screen.getByText(new RegExp(name, "i"))).toBeInTheDocument();
      const sizeInKB = (size / 1024).toFixed(2);
      expect(screen.getByText(new RegExp(`${sizeInKB} KB`, "i"))).toBeInTheDocument();
    });
  });

  it("renders no file entries when files array is empty", () => {
    render(<FileList files={[]} onRemove={() => {}} language={mockLanguage} />);
    expect(screen.getByText(/file upload is completed/i)).toBeInTheDocument();
    
    files.forEach(({ name }) => {
      expect(screen.queryByText(new RegExp(name, "i"))).not.toBeInTheDocument();
    });
  });

  it("calls onRemove with correct index when cancel icon clicked", () => {
    const onRemoveMock = jest.fn();
    const { container } = render(<FileList files={files} onRemove={onRemoveMock} language={mockLanguage} />);

    const svgs = container.querySelectorAll("svg");

    expect(svgs.length).toBe(4);

    fireEvent.click(svgs[1]);
    expect(onRemoveMock).toHaveBeenCalledWith(0);

    fireEvent.click(svgs[3]);
    expect(onRemoveMock).toHaveBeenCalledWith(1);

    expect(onRemoveMock).toHaveBeenCalledTimes(2);
  });
});
