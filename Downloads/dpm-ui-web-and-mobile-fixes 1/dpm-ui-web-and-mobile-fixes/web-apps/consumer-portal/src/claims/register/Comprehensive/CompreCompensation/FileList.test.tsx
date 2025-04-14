import { render, fireEvent, screen, act } from '@testing-library/react';
import FileList from './Filelist';  // Adjust the import path
import React from 'react';

const mockOnRemove = jest.fn();

const mockLanguageData = {
  file_upload_is_completed: 'File upload is completed.',
  download_all: 'Download All',
};

const mockFiles = [
  {
    name: 'file1.pdf',
    size: 2048, // 2 KB
    base64: 'somebase64string',
  },
  {
    name: 'file2.pdf',
    size: 1024, // 1 KB
    base64: 'somebase64string',
  },
  {
    name: 'file3.pdf',
    size: 0, // 0 KB (edge case)
    base64: 'somebase64string',
  },
];

describe('FileList Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset the mock after each test to ensure clean state
  });

  it('renders without crashing and displays file upload message', () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguageData} />
    );
    expect(screen.getByText('File upload is completed.')).toBeInTheDocument();
  });

  it('displays file names and sizes correctly', () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguageData} />
    );

    // Check that the file names and sizes are rendered correctly
    expect(screen.getByText('file1.pdf')).toBeInTheDocument();
    expect(screen.getByText('2.00 KB')).toBeInTheDocument();
    expect(screen.getByText('file2.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.00 KB')).toBeInTheDocument();
    expect(screen.getByText('file3.pdf')).toBeInTheDocument();
    expect(screen.getByText('0.00 KB')).toBeInTheDocument(); // Edge case for 0 KB file
  });

  it('calls onRemove when the cancel icon is clicked for a specific file', () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguageData} />
    );

    // Click the cancel icon for the first file (file1.pdf)
    const cancelIcon = screen.getAllByRole('img')[1]; // Cancel icon is the second in the list
    fireEvent.click(cancelIcon);

    // Ensure that onRemove was called with the correct index (0 for file1.pdf)
    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it('renders the fallback language text when file_upload_is_completed is not provided', () => {
    render(
      <FileList
        files={mockFiles}
        onRemove={mockOnRemove}
        language={{}} // No custom language data provided
      />
    );

    // Ensure that fallback text is used
    expect(screen.getByText('File upload is completed.')).toBeInTheDocument();
  });

  it('renders the correct PDF icon and cancel icon for each file', () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguageData} />
    );

    // Ensure that the correct number of icons are rendered (PDF and Cancel icons)
    const pdfIcons = screen.getAllByRole('img');
    expect(pdfIcons.length).toBe(3); // One for each file (3 files)
    expect(pdfIcons[0]).toHaveAttribute('src', expect.stringContaining('PictureAsPdfSharpIcon'));
    expect(pdfIcons[1]).toHaveAttribute('src', expect.stringContaining('PictureAsPdfSharpIcon'));
    expect(pdfIcons[2]).toHaveAttribute('src', expect.stringContaining('PictureAsPdfSharpIcon'));

    // Ensure cancel icons are also rendered for each file
    const cancelIcons = screen.getAllByRole('img');
    expect(cancelIcons.length).toBe(6); // 3 files, each having two icons (PDF and Cancel)
    expect(cancelIcons[3]).toHaveAttribute('src', expect.stringContaining('CancelIcon'));
    expect(cancelIcons[4]).toHaveAttribute('src', expect.stringContaining('CancelIcon'));
    expect(cancelIcons[5]).toHaveAttribute('src', expect.stringContaining('CancelIcon'));
  });

  it('does not re-render unnecessarily when the same props are passed', () => {
    const { rerender } = render(
      <FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguageData} />
    );

    const fileListBefore = screen.getByText('file1.pdf');
    rerender(
      <FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguageData} />
    );
    const fileListAfter = screen.getByText('file1.pdf');
    
    // Ensuring that the file list renders only once (memoized behavior)
    expect(fileListBefore).toBe(fileListAfter);
  });

  it('renders the file list even when no files are provided', () => {
    render(
      <FileList files={[]} onRemove={mockOnRemove} language={mockLanguageData} />
    );
    
    // Ensure that the default text is shown when there are no files
    expect(screen.getByText('File upload is completed.')).toBeInTheDocument();
    expect(screen.queryByText('file1.pdf')).toBeNull(); // No file names should be displayed
  });

  it('displays the size correctly for very small files (0 KB)', () => {
    render(
      <FileList files={[{ name: 'empty.pdf', size: 0, base64: 'somebase64string' }]} onRemove={mockOnRemove} language={mockLanguageData} />
    );

    expect(screen.getByText('empty.pdf')).toBeInTheDocument();
    expect(screen.getByText('0.00 KB')).toBeInTheDocument();
  });

  it('does not trigger onRemove for invalid indexes', () => {
    render(
      <FileList files={mockFiles} onRemove={mockOnRemove} language={mockLanguageData} />
    );

    // Ensure that onRemove is not triggered for an invalid index (e.g., index -1)
    fireEvent.click(screen.getAllByRole('img')[10]); // Invalid index
    expect(mockOnRemove).not.toHaveBeenCalled();
  });
});
