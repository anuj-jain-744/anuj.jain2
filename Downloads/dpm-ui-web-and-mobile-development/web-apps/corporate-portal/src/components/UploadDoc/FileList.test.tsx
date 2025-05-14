/*import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import FileList from './FileList';
import CancelIcon from '@mui/icons-material/Cancel';

describe('FileList Component', () => {
    const mockFiles = [
      { name: 'file1.pdf', size: 1024 * 50 },
      { name: 'file2.docx', size: 1024 * 100 },
    ];
    const onRemove = jest.fn();
    const language = { file_upload_is_completed: 'Upload Completed' };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders file list correctly', () => {
      render(<FileList files={mockFiles} onRemove={onRemove} language={language} />);
  
      expect(screen.getByText(/Upload Completed/)).toBeInTheDocument();
      expect(screen.getByText(/file1.pdf/)).toBeInTheDocument();
      expect(screen.getByText(/file2.docx/)).toBeInTheDocument();
      expect(screen.getByText(/50.00 KB/)).toBeInTheDocument();
      expect(screen.getByText(/100.00 KB/)).toBeInTheDocument();
    });
  
    test('calls onRemove when the remove icon is clicked', () => {
      render(<FileList files={mockFiles} onRemove={onRemove} language={language} />);
  
      const removeIcons = screen.getAllByTestId(/^remove-icon-/);
      expect(removeIcons.length).toBe(2);
  
      fireEvent.click(removeIcons[0]);
      expect(onRemove).toHaveBeenCalledWith(0);
  
      fireEvent.click(removeIcons[1]);
      expect(onRemove).toHaveBeenCalledWith(1);
    });
  
    test('renders no files correctly', () => {
      render(<FileList files={[]} onRemove={onRemove} language={language} />);
  
      expect(screen.queryByText(/file1.pdf/)).not.toBeInTheDocument();
      expect(screen.queryByText(/file2.docx/)).not.toBeInTheDocument();
    });
  });*/

  import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import FileList from './FileList';
import CancelIcon from '@mui/icons-material/Cancel';

// Mocking the CancelIcon component
jest.mock('@mui/icons-material/Cancel', () => (props:any) => (
  <div {...props} data-testid={props['data-testid']}>
    CancelIcon
  </div>
));

describe('FileList Component', () => {
  const mockFiles = [
    { name: 'file1.pdf', size: 1024 * 50 },
    { name: 'file2.docx', size: 1024 * 100 },
  ];
  const onRemove = jest.fn();
  const language = { file_upload_is_completed: 'Upload Completed' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders file list correctly', () => {
    render(<FileList files={mockFiles} onRemove={onRemove} language={language} />);

    expect(screen.getByText(/Upload Completed/)).toBeInTheDocument();
    expect(screen.getByText(/file1.pdf/)).toBeInTheDocument();
    expect(screen.getByText(/file2.docx/)).toBeInTheDocument();
    expect(screen.getByText(/50.00 KB/)).toBeInTheDocument();
    expect(screen.getByText(/100.00 KB/)).toBeInTheDocument();
  });

  test('calls onRemove when the remove icon is clicked', () => {
    render(<FileList files={mockFiles} onRemove={onRemove} language={language} />);

    const removeIcons = screen.getAllByTestId(/^remove-icon-/);
    expect(removeIcons.length).toBe(2);

    fireEvent.click(removeIcons[0]);
    expect(onRemove).toHaveBeenCalledWith(0);

    fireEvent.click(removeIcons[1]);
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  test('renders no files correctly', () => {
    render(<FileList files={[]} onRemove={onRemove} language={language} />);

    expect(screen.queryByText(/file1.pdf/)).not.toBeInTheDocument();
    expect(screen.queryByText(/file2.docx/)).not.toBeInTheDocument();
  });
});

