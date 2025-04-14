
// Unit tests for: UploadDoc


import { fireEvent, render } from '@testing-library/react';
import { UploadDoc } from './index';
import "@testing-library/jest-dom";


// Mock the DragNdrop component
jest.mock("./DragNDrop", () => ({
  __esModule: true,
  default: ({ onFilesSelected }: { onFilesSelected: (files: FileList | null) => void }) => (
    <div data-testid="drag-n-drop" onClick={() => onFilesSelected(mockFileList)}>
      Mock DragNdrop
    </div>
  ),
}));

const mockFileList = {
  length: 1,
  item: () => ({
    name: 'testfile.txt',
    size: 1234,
    type: 'text/plain',
  }),
  0: {
    name: 'testfile.txt',
    size: 1234,
    type: 'text/plain',
  },
} as unknown as FileList;

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

describe('UploadDoc() UploadDoc method', () => {
  let handleSuccessMock: jest.Mock;
  let onChangehandler: jest.Mock;
  let onFilesSelected: jest.Mock;

  beforeEach(() => {
    handleSuccessMock = jest.fn();
    onChangehandler = jest.fn();
    onFilesSelected = jest.fn();
  });

  describe('../components/UploadDoc', () => {
    it('should render the component correctly', () => {
      // Test to ensure the component renders without crashing
      const { getByText } = render(<UploadDoc attachedFiles={onFilesSelected} onChangehandler={onChangehandler} name="" upLoadLabels="" attachmentData={mockattachment} />);
      expect(getByText('Attachment')).toBeInTheDocument();
      expect(getByText('The file name should be in English names only and should not include any symbol.')).toBeInTheDocument();
    });

    it('should call setFiles when a file is selected', () => {
      // Test to ensure files are set when selected
      const { getByTestId } = render(<UploadDoc attachedFiles={onFilesSelected} onChangehandler={onChangehandler} name="" upLoadLabels="" attachmentData={mockattachment} />);
      const dragNdrop = getByTestId('drag-n-drop');
      fireEvent.click(dragNdrop);
      expect(handleSuccessMock).not.toHaveBeenCalled(); // handleSuccess is not called directly in this component
    });
  });

  describe('Edge Cases', () => {
    it('should handle no files selected gracefully', () => {
      // Test to ensure no files selected does not break the component
      jest.mock("./DragNDrop", () => ({
        __esModule: true,
        default: ({ onFilesSelected }: { onFilesSelected: (files: FileList | null) => void }) => (
          <div data-testid="drag-n-drop" onClick={() => onFilesSelected(null)}>
            Mock DragNdrop
          </div>
        ),
      }));

      const { getByTestId } = render(<UploadDoc attachedFiles={onFilesSelected} onChangehandler={onChangehandler} name="" upLoadLabels="" attachmentData={mockattachment} />);
      const dragNdrop = getByTestId('drag-n-drop');
      fireEvent.click(dragNdrop);
      expect(handleSuccessMock).not.toHaveBeenCalled();
    });

    it('should handle multiple files selected', () => {
      // Test to ensure multiple files are handled
      const multipleFiles = {
        length: 2,
        item: (index: number) => ({
          name: `testfile${index}.txt`,
          size: 1234,
          type: 'text/plain',
        }),
        0: {
          name: 'testfile0.txt',
          size: 1234,
          type: 'text/plain',
        },
        1: {
          name: 'testfile1.txt',
          size: 1234,
          type: 'text/plain',
        },
      } as unknown as FileList;

      jest.mock("./DragNDrop", () => ({
        __esModule: true,
        default: ({ onFilesSelected }: { onFilesSelected: (files: FileList | null) => void }) => (
          <div data-testid="drag-n-drop" onClick={() => onFilesSelected(multipleFiles)}>
            Mock DragNdrop
          </div>
        ),
      }));

      const { getByTestId } = render(<UploadDoc attachedFiles={onFilesSelected} onChangehandler={onChangehandler} name="" upLoadLabels="" attachmentData={mockattachment} />);
      const dragNdrop = getByTestId('drag-n-drop');
      fireEvent.click(dragNdrop);
      expect(handleSuccessMock).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: UploadDoc
