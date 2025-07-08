import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import FileList from './FileList';

// Mocking the CancelIcon component
jest.mock('@mui/icons-material/Cancel', () => {
  return (props) => <div {...props} data-testid={props['data-testid']}>MockCancelIcon</div>;
});

describe('FileList Component', () => {
  const mockFiles = [
    { name: 'file1.pdf', size: 1024 * 50, base64: "" },
    { name: 'file2.docx', size: 1024 * 100, base64: "" },
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

  });

  test('renders no files correctly', () => {
    render(<FileList files={[]} onRemove={onRemove} language={language} />);

    expect(screen.queryByText(/file1.pdf/)).not.toBeInTheDocument();
    expect(screen.queryByText(/file2.docx/)).not.toBeInTheDocument();
  });
});