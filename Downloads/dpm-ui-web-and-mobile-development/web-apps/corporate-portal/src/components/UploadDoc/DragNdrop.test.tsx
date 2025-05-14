import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom";
import DragNdrop, { isValidFilename } from './DragNDrop';
import FileList from './FileList';

// Mock FileList component
jest.mock('./FileList', () => {
  return jest.fn(({ files }) => (
    <div>
      {files.map((file: any, index: number) => (
        <div key={index} data-testid={`file-${index}`}>
          {file.name} - {file.size} bytes
        </div>
      ))}
    </div>
  ));
});

class FileReaderMock {
  static EMPTY = 0;
  static LOADING = 1;
  static DONE = 2;
  onloadend: any;

  readAsDataURL(file: any) {
    setTimeout(() => {
      if (this.onloadend) {
        this.onloadend({ target: { result: `data:mock;base64,${file.name}` } });
      }
    }, 50);
  }
}
global.FileReader = FileReaderMock as any;

describe('DragNdrop Component', () => {
  const onFilesSelected = jest.fn();
  const onChangehandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockattachment = {
    "field_name": "attachment",
    "field_title": "Attachment",
    "field_type": "managed_file",
    "field_required": true,
    "field_placeholder": "Browse Files",
    "field_options": null,
    "field_validation": {
      "required": {

        "message": "This field is required"
      }
    },
    "field_additional_info": "The file name should be in English names only and should not include any symbol.",
    "field_description": ""
  }

  const mockuploadlabels = {
    drag_and_drop: "Drag and drop file here",
    supported_file_type: "Supported file type: .doc, .docx, .pdf, .jpg, .png",
    or_label: "or"
  }
  test('handles file selection', async () => {
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

    render(<DragNdrop name="" upLoadLabels={mockuploadlabels} attachmentData={mockattachment} attachedFiles={onFilesSelected} onChangehandler={onChangehandler} />);

    const input = screen.getByLabelText(/Browse Files/i);
    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    // Wait for the state update to complete and the function to be called
    await waitFor(() => {
      expect(onFilesSelected).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'example.pdf', size: file.size }),
      ]));
    });

    await waitFor(() => {
      expect(screen.getByTestId('file-0')).toHaveTextContent('example.pdf - 13 bytes');
    });
  });

  test('handles file drop', async () => {
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

    render(<DragNdrop name="" upLoadLabels={mockuploadlabels} attachmentData={mockattachment} attachedFiles={onFilesSelected} onChangehandler={onChangehandler} />);

    const dropzone = screen.getByText(/Drag and drop file here/i);

    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file] },
    });

    // Wait for the state update to complete and the function to be called
    await waitFor(() => {
      expect(onFilesSelected).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ name: 'example.pdf', size: file.size }),
      ]));
    });

    await waitFor(() => {
      expect(screen.getByTestId('file-0')).toHaveTextContent('example.pdf - 13 bytes');
    });
  });

  test('removes a file when remove icon is clicked', async () => {
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

    render(<DragNdrop name="" upLoadLabels={mockuploadlabels} attachmentData={mockattachment} attachedFiles={onFilesSelected} onChangehandler={onChangehandler} />);

    const input = screen.getByLabelText(/Browse Files/i);
    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    // Wait for the file to be added
    await waitFor(() => {
      expect(screen.getByTestId('file-0')).toHaveTextContent('example.pdf - 13 bytes');
    });
  });

  test('validates filenames correctly', () => {
    expect(isValidFilename('valid_filename.pdf')).toBe(true);
    expect(isValidFilename('invalid filename.pdf')).toBe(false);
    expect(isValidFilename('another_valid-filename.jpg')).toBe(true);
    expect(isValidFilename('invalid/filename.png')).toBe(false);
  });
});


